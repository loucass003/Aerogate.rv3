import Slider from './Slider';

const slider = new Slider();

slider.init();

//import * as THREE from 'three'
/*import Position from './Position.js';

var ColladaLoader = require('three-collada-loader');

let camera, scene, renderer;
let model;
let theta;

const worldAxis = new THREE.AxesHelper(20);

const p0 = Position.create(
	3.5 * Math.sin(THREE.Math.degToRad(45)),
	0.8,
	3.5 * Math.sin(THREE.Math.degToRad(45)),
	0.3, 0.0, -0.7);

const p1 = Position.create(
	2,
    0.8,
    3.5,
	1.5, 2, -0.7);
*/
/*init();
animate();

const loader = new ColladaLoader();

loader.load(
	'models/theroom.dae',
	(model) => {
		scene.add(model = model.scene);
		model.rotation.x = THREE.Math.degToRad(-90);
		model.position.set(-0.315, 0.014, 0.72);
	},
);

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('keydown', keydown)
document.addEventListener('mousedown', mousedown);

function init() {
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
	scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
	const pointLight = new THREE.PointLight(0xffffff, 0.8);

	theta = 0.0;

	camera.add(pointLight);
	scene.add(ambientLight);
	scene.add(camera);
	scene.add(worldAxis);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	document.body.appendChild(renderer.domElement);
	renderer.setSize(renderer.domElement.clientWidth,  renderer.domElement.clientHeight);
}


function animate() {
	let t = (Math.sin(theta) + 1) / 2;

	let p = Position.create(
		p0.pos.x *(1 - t) + p1.pos.x * t,
		p0.pos.y *(1 - t) + p1.pos.y * t,
		p0.pos.z *(1 - t) + p1.pos.z * t,
		p0.dir.x *(1 - t) + p1.dir.x * t,
		p0.dir.y *(1 - t) + p1.dir.y * t,
		p0.dir.z *(1 - t) + p1.dir.z * t,
	);/*new Position(
		p0.pos.clone().multiply(1 - t).add(p1.pos.clone().multiply(t)),
		p0.dir.clone().multiply(1 - t).add(p1.dir.clone().multiply(t)),
	)*/

	/*p = p1;

	camera.position.set(0, 0, 0).add(p.pos)
	camera.updateProjectionMatrix();
	
	camera.lookAt(p.dir);
	camera.updateProjectionMatrix();

	theta += 0.02;

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function keydown({ key }) {
	switch(key) {
		case ' ': {
			alert("space");
			break;
		}
	}
}

function mousedown({ buttons }) {
	switch(buttons) {
		case 1: {
			alert('left');
			break;
		}
		case 2: {
			alert('right');
			break;
		}
	}
}

*/