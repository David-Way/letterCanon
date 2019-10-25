import require from './vendor/require.js/require.js';
import * as THREE from 'three';
import './vendor/physijs/physi.js';
import '../fonts/helvetiker_regular.typeface.js';

// <script src='vendor/require.js/require.js'></script>
// <script src='bower_components/threejs/build/three.min.js'></script>
// <script src='vendor/three.js/examples/js/controls/OrbitControls.js'></script>
// <script src="vendor/physijs/physi.js"></script>

require([], function(){
  'use strict';

  // Physijs.scripts.worker = 'vendor/physijs/physijs_worker.js';
  // Physijs.scripts.ammo = '/bower_components/ammo.js/builds/ammo.js';

  //////////////////////////////////////////////////////////////////////////////////
  //		Variables
  //////////////////////////////////////////////////////////////////////////////////

  //var THREE = require('three');

  var letterPosition = {
    "q": 0,
    "Q": 0,
    "w": 10,
    "W": 10,
    "e": 20,
    "E": 20,
    "r": 30,
    "R": 30,
    "t": 40,
    "T": 40,
    "y": 50,
    "Y": 50,
    "u": 60,
    "U": 60,
    "i": 70,
    "I": 70,
    "o": 80,
    "O": 80,
    "p": 90,
    "P": 90,
    "a": 3,
    "A": 3,
    "s": 13,
    "S": 13,
    "d": 23,
    "D": 23,
    "f": 33,
    "F": 33,
    "g": 43,
    "G": 43,
    "h": 53,
    "H": 53,
    "j": 63,
    "J": 63,
    "k": 73,
    "K": 73,
    "l": 83,
    "L": 83,
    ";": 93,
    ":": 93,
    "'": 103,
    "@": 103,
    "z": 6,
    "Z": 6,
    "x": 16,
    "X": 16,
    "c": 26,
    "C": 26,
    "v": 36,
    "V": 36,
    "b": 46,
    "B": 46,
    "n": 56,
    "N": 56,
    "m": 66,
    "M": 66,
    ",": 76,
    "<": 76,
    ".": 86,
    ">": 86,
    "/": 96,
    "?": 96
  };
  var typeMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
  var keyWidth = 10; 			// width of keyboard key
  var pageWidth = 0.5;		// amount of screen to use
  var onRenderFcts = []; 	// array of functions for the rendering loop

  //////////////////////////////////////////////////////////////////////////////////
  //		Init
  //////////////////////////////////////////////////////////////////////////////////

  var scene	= new Physijs.Scene({reportsize: 50, fixedTimeStep: 1 / 60});
  var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.z = 2;
  var controls	= new THREE.OrbitControls(camera);

  var renderer = new THREE.WebGLRenderer({	// init renderer
    antialias	: true,
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 1)
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var floor = new Physijs.BoxMesh( new THREE.BoxGeometry( 50, 0.5, 50 ), new THREE.MeshBasicMaterial({ color: 0x888888 }), 0);
  floor.position.y = -1.1;
  scene.add(floor);

  //////////////////////////////////////////////////////////////////////////////////
  //		render
  //////////////////////////////////////////////////////////////////////////////////

  onRenderFcts.push(function(){ // render the scene
    renderer.render( scene, camera );
    scene.simulate(); 					// run physics
  })

  var lastTimeMsec = null; // run the rendering loop

  requestAnimationFrame(function animate(nowMsec){
    requestAnimationFrame(animate); 								// keep looping
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60 // measure time
    var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec	= nowMsec
    onRenderFcts.forEach(function(onRenderFct){ 		// call each update function
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    });
  });

  //////////////////////////////////////////////////////////////////////////////////
  //		Utils
  //////////////////////////////////////////////////////////////////////////////////

  function createLetter(letter) {
    var textGeom = new THREE.TextGeometry( letter, {
      font:   	"helvetiker",
      height: 	0.03,
      size:    	randomNumberBetween(0.03, 0.08),
      style:   	"normal",
      weight: 	"normal"
    });
    textGeom.computeBoundingBox();
    var textMesh = new Physijs.BoxMesh(textGeom, typeMaterial, 1);
    textMesh.position.x = computeXPosition(textMesh, letter);
    textMesh.position.y = -1;
    scene.add(textMesh);
    textMesh.applyImpulse(new THREE.Vector3(0,5,0), new THREE.Vector3(0, 0, 0));
    return  textMesh;
  }

  function computeXPosition(textMesh, letter) {
    textMesh.geometry.computeBoundingBox();
    textMesh.textWidth = textMesh.geometry.boundingBox.max.x - textMesh.geometry.boundingBox.min.x;
    return (letterPosition[letter] + (keyWidth/2)) / 100 - pageWidth - (textMesh.textWidth/2);
  }

  function randomNumberBetween(min,max) {
    return Math.random()*(max-min)+min;
  }

  //////////////////////////////////////////////////////////////////////////////////
  //		Event listeners
  //////////////////////////////////////////////////////////////////////////////////

  document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode) {
      var charString = String.fromCharCode(charCode);
      createLetter(charString);
    }
  };

  window.addEventListener('resize', function(){ // handle window resize
    renderer.setSize( window.innerWidth, window.innerHeight )
    camera.aspect	= window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }, false)
});
