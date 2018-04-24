import * as THREE from 'three'

var ColladaLoader = require('three-collada-loader');

var camera, scene, renderer;
var geometry, material, mesh;


init();
animate();

const loader = new ColladaLoader();
		// load a resource
	loader.load(
		// resource URL
		'models/theroom.dae',
		// called when resource is loaded
		function ( collada ) {

			scene.add( collada.scene );

		},
	);



function init() {

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 5;
	camera.position.x = 0;
	camera.position.y = -2
	camera.rotation.x = 0.45;
	

	scene = new THREE.Scene();
	

	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );
	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( pointLight );
	scene.add( camera );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}

function animate() {

	requestAnimationFrame( animate );

	renderer.render( scene, camera );

}