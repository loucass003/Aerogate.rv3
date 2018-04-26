import * as THREE from 'three'
import 'impress.js';
import Position from './Position.js';

var ColladaLoader = require('three-collada-loader');

let camera, scene, renderer;
let model;
let theta;
const p0 = new Position(
	3.5 * Math.sin(THREE.Math.degToRad(45)),
	0.8,
	3.5 * Math.sin(THREE.Math.degToRad(45)),
	0, THREE.Math.degToRad(45), 0);

const p1 = new Position(
	20.5 * Math.sin(THREE.Math.degToRad(45)),
	2.8,
	9.5 * Math.sin(THREE.Math.degToRad(45)),
	THREE.Math.degToRad(90), THREE.Math.degToRad(45),  0);

const m = new THREE.Matrix4();

init();
animate();

const loader = new ColladaLoader();

loader.load(
	'models/theroom.dae',
	(model) => {
		scene.add(model = model.scene);
		model.rotation.x = THREE.Math.degToRad(-90);
	},
);

window.addEventListener( 'resize', onWindowResize, false );


function init() {

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000 );
	
	//camera.position.set(2,0,10);
	//camera.updateProjectionMatrix();
	theta = 0.0;

	scene = new THREE.Scene();
	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );
	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add(pointLight);
	scene.add( camera );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}


function animate() {
	let t = (Math.sin(theta) + 1) / 2;

	var a = new THREE.Euler(
		p0.dirX *(1 - t) + p1.dirX * t, 
		p0.dirY *(1 - t) + p1.dirY * t,
		p0.dirZ *(1 - t) + p1.dirZ * t, 
		'XYZ' 
	);

	let m0 = m.clone().makeRotationFromEuler(a);

	let v4 = new THREE.Vector3(0,0,0).normalize().applyMatrix4(m0)

	console.log(v4);
	let p = new Position(
		p0.posX *(1 - t) + p1.posX * t,
		p0.posY *(1 - t) + p1.posY * t,
		p0.posZ *(1 - t) + p1.posZ * t,
		v4.x,
		v4.y,
		v4.z
	);


	camera.rotation.x = 0;
	camera.rotation.y = 0;
	camera.rotation.z = 0;
	//camera.updateProjectionMatrix();

	camera.position.x = 0.3  + p.posX;
	camera.position.y = 0.0  + p.posY;
	camera.position.z = -0.7 + p.posZ;
	camera.updateProjectionMatrix();
	
	//camera.lookAt(dir);
	camera.rotation.x = p.dirX;
	camera.rotation.y = p.dirY;
	camera.rotation.z = p.dirZ;
	console.log("rot", camera.rotation);
	camera.updateProjectionMatrix();

	theta += 0.02;

	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}