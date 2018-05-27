import * as THREE from 'three'
import Loader from './Loader.js'
import Step from './Step.js'
import Position from './Position.js'
import Animator from './Animator.js'
import Console from './Console.js'
import OrbitControls from 'orbit-controls-es6'
import { CSS3DRenderer } from 'three-renderer-css3d';
import { parsePos, parseCamera, parseCameras, parseScale, flatten } from './Utils.js';
import { update } from 'es6-tween'

class Slider {

    async init() {
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('keydown', (event) => this.onKeydown(event))
        document.addEventListener('mousedown', (event) => this.onMousedown(event));
        window.addEventListener("hashchange", () => this.onHashChange());

       

        this.loader = new Loader();
        await this.loader.init();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x00ff00, 0.0);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = 0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        document.body.appendChild(this.renderer.domElement);

        this.cssRenderer = new CSS3DRenderer({ antialias: true });
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = 0;
        document.body.appendChild(this.cssRenderer.domElement);

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20000);
        this.controls = new OrbitControls(this.camera, this.cssRenderer.domElement);
        this.controls.enabled = false;
        
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();

        this.ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        
        this.pointLight = new THREE.PointLight(0xffffff, 0.7);
        

        this.camera.add(this.pointLight);
        this.scene.add(this.ambientLight);
        this.scene.add(this.camera);

        const slider = document.getElementById('slider')
        const modelsElems = slider.getElementsByTagName('model');
        this.globalModels = Array.from(modelsElems).map(({
            attributes: {
                'data-name': { value: name },
                'data-pos': { value: pos },
                scale: { value: scale } = { scale: { value: null }}
            }
        }) => ({ pos: parsePos(pos), scale: parseScale(scale), model: this.loader.model(name) }));

        this.globalModels.forEach(({ pos, scale, model : { model : { scene } } }) => {
            const s = scene.clone()
            this.scene.add(s);
            s.rotation.setFromVector3(pos.dir);
            s.position.set(pos.pos.x,pos.pos.y,pos.pos.z);
            s.frustumCulled = false;
            s.traverse(function(child)
            {
                child.castShadow = true;
                child.receiveShadow = true;
            });
            if(scale)
                s.scale.multiply(scale)
        });

        this.camPos = parseCamera(slider.attributes.camera.value);
        this.camera.position.set(0, 0, 0).add(this.camPos.pos);
        this.camera.lookAt(this.camPos.dir);
        this.controls.update();
        this.cssScale = parseScale(slider.attributes['css-scale'].value);

        this.loadSkyBox();

        if(slider.attributes.axis && slider.attributes.axis.value == 'true') {
            this.worldAxis = new THREE.AxesHelper(200);
            this.scene.add(this.worldAxis);
        }

        
        const steps = slider.getElementsByClassName("step");
        this.step = 0;
        this.steps = Array.from(steps).map(({
            attributes: {
                camera: { value: camera } = { camera: { value: null } },
                duration: { value: duration } = { duration: { value: null } },
                'data-name': { value: name },
                'data-pos': { value: pos },
                persistent: { value: persistent } = { persistent: { value: false } }
            }
        }, i) => {
            const step = new Step(steps[i], name, parsePos(pos), parseCameras(camera), duration, persistent);
            step.object.scale.multiply(this.cssScale);
            if(persistent)
                this.cssScene.add(step.object)
            return step;
        });

        this.console = new Console(this);

        this.animator = new Animator(this);

        let firstSlide = this.steps[0];
        const hash = window.location.hash;
        if(hash && hash.length > 0) {
            let step;
            const findSlide = this.steps.filter(({ name }, i) => {
                const f = name === hash.substring(1, hash.length);
                if(f) {
                    step = i;
                    return true;
                } return false;
            })[0];
            if(findSlide) {
                firstSlide = findSlide;
                this.step = step;
            }
        }
        
        const enterEvent = new CustomEvent('slider.step.enter', {
            detail: {slide: this.steps[this.step], inst: this },
            bubbles: true,
            cancelable: true,
        })


        if(document.dispatchEvent(enterEvent)) {
            if(!firstSlide.persistent)
                this.cssScene.add(firstSlide.object)
            this.animator.animate([this.camPos, ...firstSlide.cameras], firstSlide.duration);
        }
        this.render();
    }

    render(time) {
        update(time);
      
        this.animator.render(this.step);
        this.controls.update();
        this.cssRenderer.render(this.cssScene, this.camera);
        this.renderer.render(this.scene, this.camera);
        this.console.render(this);
        requestAnimationFrame(this.render.bind(this));
    }


    loadSkyBox() {
        const skyboxElem = document.getElementsByTagName('skybox')[0];
        const path = skyboxElem.attributes.path.value.replace(/\/?(\?|#|$)/, '/$1');
        const format = `.${skyboxElem.attributes.format.value}`;
        const urls = [
            path + 'right' + format,
            path + 'left' + format,
            path + 'top' + format,
            path + 'bottom' + format,
            path + 'back' + format,
            path + 'front' + format
        ];

        const reflectionCube = THREE.ImageUtils.loadTextureCube(urls);
        reflectionCube.format = THREE.RGBFormat;

        const shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = reflectionCube;

        const material = new THREE.ShaderMaterial( {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
        mesh.scale.multiply(parseScale(skyboxElem.attributes.scale.value))
        this.scene.add(mesh);
    }

    nextSlide(skipAnimation) {
        const curr = this.steps[this.step];
        const substepLeaveEvent = new CustomEvent('slider.substep.leave', {
            detail: {
                inst: this,
                slide: curr,
                substep: curr.step !== -1 && curr.substeps[curr.step]
            },
            bubbles: true,
            cancelable: false
        })

        if(curr.hasNextSubstep()) {
            const next = curr.nextSubstep()
            const substepEnterEvent = new CustomEvent('slider.substep.enter', {
                detail: {
                    inst: this,
                    slide: curr,
                    substep: next
                },
                bubbles: true,
                cancelable: true
            })

            if(curr.step !== -1)
                document.dispatchEvent(substepLeaveEvent)

            if(document.dispatchEvent(substepEnterEvent)) {
                curr.step++;
                next.showStep(undefined, skipAnimation);
            }
        } else {
            const oldStep = this.step++;
            if(this.step == this.steps.length)
                this.step = 0;

            const enterEvent = new CustomEvent('slider.step.enter', {
                detail: {slide: this.steps[this.step], inst: this },
                bubbles: true,
                cancelable: true,
            })

            if(document.dispatchEvent(enterEvent)) {
                const { cameras, duration, fallback, name, object } = this.steps[this.step];
                window.location.hash = `#${name}`;
                this.forceHash = true;
                this.cssScene.add(object)
                this.animator.animate([this.camPos, ...cameras], duration, skipAnimation)

                const leaveEvent = new CustomEvent('slider.step.leave', {
                    detail: { slide: curr },
                    bubbles: true,
                    cancelable: false,
                })

                document.dispatchEvent(leaveEvent);
                if(!curr.persistent) {
                    document.dispatchEvent(substepLeaveEvent)
                    curr.clear(skipAnimation).then(() => this.cssScene.remove(curr.object));
                }
                
            } else this.step = oldStep;
        }
    }

    prevSlide(skipAnimation) {
        const curr = this.steps[this.step];
        
        const oldStep = this.step--;
        if(this.step == -1)
            this.step = this.steps.length - 1;

        const enterEvent = new CustomEvent('slider.step.enter', {
            detail: {
                inst: this,
                slide: this.steps[this.step]
            },
            bubbles: true,
            cancelable: true,
        })

        if(document.dispatchEvent(enterEvent)) {        
            const { cameras, duration, fallback, name, object } = this.steps[this.step];
            window.location.hash = `#${name}`;
            this.forceHash = true;
            this.cssScene.add(object)
            cameras.reverse();
            this.animator.animate([this.camPos, ...cameras], duration, skipAnimation)

            const leaveEvent = new CustomEvent('slider.step.leave', {
                detail: { slide: curr, inst: this },
                bubbles: true,
                cancelable: false,
            })

            document.dispatchEvent(leaveEvent);
            if(!curr.persistent)
                curr.clear().then(() => this.cssScene.remove(curr.object));
            
        } else this.step = oldStep;
    }
    
    onHashChange() {
        if(this.forceHash) {
            this.forceHash = false
            return;
        }

        const hash = window.location.hash;
        if(hash && hash.length > 0) {
            let step;
            const findSlide = this.steps.filter(({ name }, i) => {
                const f = name === hash.substring(1, hash.length);
                if(f) {
                    step = i;
                    return true;
                } return false;
            })[0];
            if(findSlide) {
                const enterEvent = new CustomEvent('slider.step.enter', {
                    detail: {
                        inst: this,
                        slide: this.steps[this.step]
                    },
                    bubbles: true,
                    cancelable: true,
                })

                if(document.dispatchEvent(enterEvent)) {
                    const curr = this.steps[this.step];

                    if(!this.cssScene.getObjectById(findSlide.object.id))
                        this.cssScene.add(findSlide.object)
                    this.step = step;
                    this.animator.animate([this.camPos, ...findSlide.cameras], findSlide.duration);

                    const leaveEvent = new CustomEvent('slider.step.leave', {
                        detail: { slide: curr, inst: this },
                        bubbles: true,
                        cancelable: false,
                    })
        
                    document.dispatchEvent(leaveEvent);
                    if(curr != this.steps[step] && !curr.persistent) {
                        curr.clear();
                        this.cssScene.remove(curr.object);
                    }
                }
            }
        }
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeydown({ key, ctrlKey }) {
        switch(key) {
            case ' ': {
                if(!this.controls.enabled)
                    this.nextSlide(ctrlKey);
                break;
            } 
            case 'Enter': {
                if(!this.controls.enabled)
                    this.nextSlide(ctrlKey);
                break;
            } 
            case 'ArrowLeft': {
               if(!this.controls.enabled)
                    this.prevSlide(ctrlKey);
                break;
            } 
            case 'ArrowRight': {
                if(!this.controls.enabled)
                    this.nextSlide(ctrlKey);
                break;
            }
            case 'c': {
                this.console.toggleDisplay();
                break;
            }
            case 'p': {
                this.controls.enabled = !this.controls.enabled;
                if(!this.controls.enabled) {
                    const { cameras, duration } = this.steps[this.step];
                    this.animator.animate([this.camPos, cameras[cameras.length-1]], duration)
                }
                break;
            }
        }
    }

    onMousedown({ buttons }) {
        switch(buttons) {
            /*case 1: {
                this.nextSlide();
                break;
            }*/
        }
    }
}

export default Slider;