import * as THREE from 'three'
import Position from './Position.js'

class Animator {
    
    constructor(slider) {
        this.clock = new THREE.Clock();
        this.slider = slider
        this.steps = slider.steps;
        this.camera = slider.camera;
        this.point = 0;
        this.points = [];
    }

    render(step) {
        if(this.clock.running) {
            const slide = this.steps[step];
            let t = (this.clock.getElapsedTime() * 1000) / (this.duration / this.points.length) ;
            
            const p0 = this.points[this.point];
            const p1 = this.points[this.point + 1];

            const p = Position.create(
                p0.pos.x * (1 - t) + p1.pos.x * t,
                p0.pos.y * (1 - t) + p1.pos.y * t,
                p0.pos.z * (1 - t) + p1.pos.z * t,

                p0.dir.x * (1 - t) + p1.dir.x * t,
                p0.dir.y * (1 - t) + p1.dir.y * t,
                p0.dir.z * (1 - t) + p1.dir.z * t
            );

            this.camera.position.set(0, 0, 0).add(p.pos)
            this.camera.lookAt(p.dir);
            this.camera.updateProjectionMatrix();

            this.slider.camPos = p;

            if(t >= 1) {
                this.clock.stop();
                if(this.point + 1 != this.points.length - 1) {
                    this.point++;
                    this.clock.start();
                }
            }
        }
    }

    animate(points, duration) {
        this.point = 0;
        this.points = points;
        this.duration = duration;
        this.clock.start();
    }
}

export default Animator;


/*
	let t = (Math.sin(theta) + 1) / 2;

	let p = Position.create(
		p0.pos.x *(1 - t) + p1.pos.x * t,
		p0.pos.y *(1 - t) + p1.pos.y * t,
		p0.pos.z *(1 - t) + p1.pos.z * t,
		p0.dir.x *(1 - t) + p1.dir.x * t,
		p0.dir.y *(1 - t) + p1.dir.y * t,
		p0.dir.z *(1 - t) + p1.dir.z * t,
	);

	camera.position.set(0, 0, 0).add(p.pos)
	camera.updateProjectionMatrix();
	
	camera.lookAt(p.dir);
	camera.updateProjectionMatrix();
*/