import * as THREE from 'three'
import { Tween, Easing, Interpolation } from 'es6-tween';
import 'es6tween-plugin-render';
import { parseCameras } from './Utils.js';
import { CSS3DObject } from 'three-renderer-css3d';

class Step {

    constructor(elem, name, pos, cameras, duration, persistent) {
        this.elem = elem;
        this.name = name;
        this.pos = pos;
        this.cameras = cameras;
        this.duration = duration;
        this.persistent = persistent;

        const content = Array.from(elem.children).filter(({ localName }) => localName === 'content');
        if(content && content[0]) {
            this.object = new CSS3DObject(content[0]);
            this.object.position.set(0,0,0).add(this.pos.pos)
            this.object.rotation.setFromVector3(this.pos.dir)

            this.step = -1;

            this.substeps = Array.from(content[0].children)
                .filter(({ localName }) => localName === 'substep')
                .map(elem => ({ elem, showStep: this.showStep.bind(this), hideStep: this.hideStep.bind(this) }))
        }
    }

    hasNextSubstep() {
        return this.substeps && this.substeps[this.step + 1];
    }

    nextSubstep() {
        return this.hasNextSubstep() && this.substeps[this.step + 1];
    }

    clear(skip) {
        this.step = -1;
        return new Promise(resolve => 
            Promise.all(
                this.substeps.map(({ elem }) => this.hideStep(elem, skip))
            ).then(values => resolve(values))
        );
    }

    showStep(elem, skip) {
        if(!elem)
            elem = this.substeps[this.step].elem;
        return new Promise((resolve) => {
            if(skip) {
                elem.style.opacity = 1;
                resolve();
                return;
            }

            const duration = Number(elem.attributes.duration.value);
            const tween = new Tween(elem, { opacity: 0 })
                .to({ opacity: 1 }, duration)
                .on('complete', resolve)
                .start();
        })
    }

    hideStep(elem, skip) {
        if(!elem)
            elem = this.substeps[this.step].elem;
        return new Promise((resolve) => {
            if(skip) {
                elem.style.opacity = 0;
                resolve();
                return;
            }

            const duration = Number(elem.attributes.duration.value);
            const tween = new Tween(elem, { opacity: 1 })
                .to({ opacity: 0 }, duration)
                .on('complete', resolve)
                .start();
        })
        
    }
}

export default Step;