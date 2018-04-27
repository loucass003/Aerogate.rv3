import * as THREE from 'three'
import Loader from './Loader.js'
import { parsePos, parseCamera } from './Utils.js';

class Slider {

    async init() {
        window.addEventListener('resize', this.onResize, false);
        document.addEventListener('keydown', this.onKeydown)
        document.addEventListener('mousedown', this.onMousedown);

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
            let s;
            this.scene.add(s = scene.clone())
            console.log(pos.pos, pos.dir)
            s.rotation.setFromVector3(pos.dir);
            s.position.set(pos.pos.x,pos.pos.y,pos.pos.z);
        });

        const camPos = parseCamera(slider.attributes.camera.value);

        this.camera.position.set(0, 0, 0).add(camPos.pos);
        this.camera.lookAt(camPos.dir);
        this.render();
    }


    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    onResize() {

    }

    onKeydown({ key }) {
        switch(key) {
            case ' ': {
               // alert("space");
                break;
            }
        }
    }

    onMousedown({ buttons }) {
        switch(buttons) {
            case 1: {
              //  alert('left');
                break;
            }
            case 2: {
               // alert('right');
                break;
            }
        }
    }
}

export default Slider;