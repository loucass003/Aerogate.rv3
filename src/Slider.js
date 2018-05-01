import * as THREE from 'three'
import Loader from './Loader.js'
import Step from './Step.js'
import Position from './Position.js'
import Animator from './Animator.js'
import { parsePos, parseCamera, parseCameras } from './Utils.js';

class Slider {

    async init() {
        window.addEventListener('resize', () => { this.onResize(); });
        document.addEventListener('keydown', (event) => { this.onKeydown(event) })
        document.addEventListener('mousedown', (event) => { this.onMousedown(event) });

        this.loader = new Loader();
        await this.loader.init();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight);

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        this.scene = new THREE.Scene();

        this.ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        this.pointLight = new THREE.PointLight(0xffffff, 0.8);
        this.worldAxis = new THREE.AxesHelper(20);

        this.camera.add(this.pointLight);
        this.scene.add(this.ambientLight);
        this.scene.add(this.camera);
        this.scene.add(this.worldAxis);

        const slider = document.getElementById('slider')
        const modelsElems = slider.getElementsByTagName('model');
        console.log(modelsElems, this.loader.model('theroom'));
        this.globalModels = Array.from(modelsElems).map(({
            attributes: {
                'data-name': { value: name },
                'data-pos': { value: pos }
            }
        }) => ({ pos: parsePos(pos), model: this.loader.model(name) }));

        this.globalModels.forEach(({ pos, model : { model : { scene } } }) => {
            const s = scene.clone()
            this.scene.add(s);
            s.rotation.setFromVector3(pos.dir);
            s.position.set(pos.pos.x,pos.pos.y,pos.pos.z);
        });

        this.camPos = parseCamera(slider.attributes.camera.value);
        this.camera.position.set(0, 0, 0).add(this.camPos.pos);
        this.camera.lookAt(this.camPos.dir);

        const steps = slider.getElementsByClassName("step");

        this.step = 0;
        this.steps = Array.from(steps).map(({
            attributes: {
                camera: { value: camera } = { camera: { value: null } },
                duration: { value: duration } = { duration: { value: null } },
                'data-name': { value: name },
                'data-pos': { value: pos },
            }
        }) => new Step(name, pos, parseCameras(camera), duration));
        
        this.animator = new Animator(this);

        const firstSlide = this.steps[0];
        this.animator.animate([this.camPos, ...firstSlide.cameras], firstSlide.duration);
        this.render();
    }

    render() {
        this.animator.render(this.step);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    nextSlide() {
        this.step++;
        if(this.step == this.steps.length)
            this.step = 0;
        const { cameras, duration, fallback } = this.steps[this.step];
        this.animator.animate([this.camPos, ...cameras], duration);
    }
    
   
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeydown({ key }) {
        switch(key) {
            case ' ': {
                //alert("space");
                break;
            }
        }
    }

    onMousedown({ buttons }) {
        switch(buttons) {
            case 1: {
                this.nextSlide();
                break;
            }
            case 2: {
                //alert('right');
                break;
            }
        }
    }
}

export default Slider;