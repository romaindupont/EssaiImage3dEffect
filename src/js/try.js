import * as THREE from 'three';

let scrollable = document.querySelector('.image');
let grayscaleFragment = `float gray = (color.r + color.g + color.b) / 3.0;
vec3 grayscale = vec3(gray);

gl_FragColor = vec4(grayscale, 1.0);`
let normalColorFragment = `gl_FragColor = vec4(color,uAlpha);`
let changeFragment = grayscaleFragment;

let fragmentShaders = `
uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uOffset;
varying vec2 vUv;

vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
  float r = texture2D(textureImage,uv + offset).r;
  vec2 gb = texture2D(textureImage,uv).gb;
  return vec3(r,gb);
}

void main() {
  vec3 color = rgbShift(uTexture,vUv,uOffset);
  ${changeFragment}
  // gl_FragColor = vec4(color,uAlpha);
  //float gray = (color.r + color.g + color.b) / 3.0;
    //vec3 grayscale = vec3(gray);

    //gl_FragColor = vec4(grayscale, 1.0);
}`;

let current = 0;
let target = 0;
let ease = 0.075;

function lerp(start, end, t){
	return start * (1 - t ) + end * t;
}

function init(){
	document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
}

function smoothScroll(){
	target = window.scrollY;
	current = lerp(current, target, ease);
	scrollable.style.transform = `translate3d(0,${-current}px, 0)`;
}

function viewport(){
	let width = window.innerWidth;
	let height = window.innerHeight;
	let aspectRatio = width / height;
	return {
		width,
		height,
		aspectRatio
	};
}

const Test = () => {
	const container = document.querySelector('#root');
	const images = [...document.querySelectorAll('img')]; 
	let meshItems = []
	let position;
	let scene;
	let camera;

	const setupCamera = () => {
        
		window.addEventListener('resize', this.onWindowResize.bind(this), false);

		// Create new scene
		scene = new THREE.Scene();

		// Initialize perspective camera

		let perspective = 1000;
		const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI; // see fov image for a picture breakdown of this fov setting.
		camera = new THREE.PerspectiveCamera(fov, viewport.aspectRatio, 1, 1000)
		camera.position.set(0, 0, perspective); // set the camera position on the z axis.
		const raycaster = new THREE.Raycaster();

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	  renderer.setSize(viewport.width, viewport.height); // uses the getter viewport function above to set size of canvas / renderer
		renderer.setPixelRatio(window.devicePixelRatio); // Import to ensure image textures do not appear blurred.
		container.appendChild(renderer.domElement); // append the canvas to the main element
}

const onMouseClick = (event) => {
	position = new THREE.Vector2();
	console.log('je clic')
	// On conserve la position de la souris dans l'espace de coordonnées
	// NDC (Normalized device coordinates).
	let domRect = renderer.domElement.getBoundingClientRect();
	position.x = ((event.clientX - domRect.left) / domRect.width) * 2 - 1;
	position.y = - ((event.clientY - domRect.top) / domRect.height) * 2 + 1;

	var s = getSelectionneLePlusProche(position);
	console.log(s)
	if (s) {
		alert("Vous avez sélectionné l'objet " + s.name);
	} else {
		alert("Vous n'avez rien sélectionné");
	};
}
const getSelectionneLePlusProche = (position) => {
	// Mise à jour de la position du rayon à lancer.
	raycaster.setFromCamera(position, camera);
	// Obtenir la liste des intersections
	var selectionnes = raycaster.intersectObjects(selectionables.children);
	if (selectionnes.length) {
		return selectionnes[0].object;
	}
}
const onWindowResize = () => {
		init();
		camera.aspect = viewport.aspectRatio; // readjust the aspect ratio.
		camera.updateProjectionMatrix(); // Used to recalulate projectin dimensions.
		renderer.setSize(viewport.width, viewport.height); 
}
}