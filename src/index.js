import * as THREE from 'three'
import 'impress.js';
import Position from './Position.js';

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
	-1.5 * Math.sin(THREE.Math.degToRad(45)),
    2.8,
    20.5 * Math.sin(THREE.Math.degToRad(45)),
	6, 0.7, -0.3);

init();
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
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
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

	camera.position.set(0.3, 0, -0.7).add(p.pos)
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