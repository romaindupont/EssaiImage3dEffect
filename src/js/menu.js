import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scrollable = document.querySelector('.image');
let grayscaleFragment = `float gray = (color.r + color.g + color.b) / 3.0;
vec3 grayscale = vec3(gray);

gl_FragColor = vec4(grayscale, 1.0);`
let normalColorFragment = `gl_FragColor = vec4(color,uAlpha);`
let changeFragment = grayscaleFragment;

let newShader = `
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
  gl_FragColor = vec4(color,uAlpha);
}`
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

// Linear inetepolation used for smooth scrolling and image offset uniform adjustment

function lerp(start, end, t){
    return start * (1 - t ) + end * t;
}

// init function triggered on page load to set the body height to enable scrolling and EffectCanvas initialised
function init(){
    document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
}

// translate the scrollable div using the lerp function for the smooth scrolling effect.
function smoothScroll(){
    target = window.scrollY;
    current = lerp(current, target, ease);
    scrollable.style.transform = `translate3d(0,${-current}px, 0)`;
}

class EffectCanvas{
    constructor(){
        this.container = document.querySelector('#root');
        this.images = [...document.querySelectorAll('img')]; 
        this.meshItems = []; // Used to store all meshes we will be creating.
        this.setupCamera();
        this.createMeshItems();
        this.render()
    }

    // Getter function used to get screen dimensions used for the camera and mesh materials
    get viewport(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;
        return {
          width,
          height,
          aspectRatio
        };
    }

    setupCamera(){
        
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    
        // Create new scene
        this.scene = new THREE.Scene();
				console.log(this.scene)
			
        // Initialize perspective camera
    
        let perspective = 1000;
        const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI; // see fov image for a picture breakdown of this fov setting.
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000)
        this.camera.position.set(0, 0, perspective); // set the camera position on the z axis.
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.viewport.width, this.viewport.height); // uses the getter viewport function above to set size of canvas / renderer
        this.renderer.setPixelRatio(window.devicePixelRatio); // Import to ensure image textures do not appear blurred.
        this.container.appendChild(this.renderer.domElement); // append the canvas to the main element
				const clicOnImages = document.querySelectorAll('.containerImage');
				const array = []
				array.push(clicOnImages)
				console.log(array)
				array.forEach((image)=> {
					image.forEach((img, index)=> {
						img.addEventListener('mouseenter', () => {
							console.log(index)
							this.scene.children[index].material.fragmentShader = newShader;
							const aLink = document.createElement('a');
							aLink.textContent= "Open For More";
							aLink.classList.add("link");
							
							if(index === 0) {
								aLink.style.top = '50%';
								aLink.style.left = '25%';
								aLink.style.right = '';
							}
							if(index === 3) {
								aLink.style.top = '50%';
								aLink.style.left = '25%';
								aLink.style.right = '';
							}
							if(index === 2) {
								aLink.style.top = '25%';
								aLink.style.left = '25%';
								aLink.style.right = '';
							}
							if(index === 5) {
								aLink.style.top = '25%';
								aLink.style.left = '25%';
								aLink.style.right = '';
							}
							if(index === 1) {
								aLink.style.top = `${10}px`;
								aLink.style.left = '';
								aLink.style.right = `15%`;
							}
							if(index === 4) {
								aLink.style.top = `${10}px`;
								aLink.style.left = '';
								aLink.style.right = `15%`;
							}
							image[index].appendChild(aLink);
		
							})
							img.addEventListener('mouseleave', () => {
								this.scene.children[index].material.fragmentShader = fragmentShaders;
							const aLink = document.querySelector(".link");
								aLink.remove()
								})
					})
					})
    }
				
    onWindowResize(){
        init();
        this.camera.aspect = this.viewport.aspectRatio; // readjust the aspect ratio.
        this.camera.updateProjectionMatrix(); // Used to recalulate projectin dimensions.
        this.renderer.setSize(this.viewport.width, this.viewport.height); 
    }

    createMeshItems(){
        // Loop thorugh all images and create new MeshItem instances. Push these instances to the meshItems array.
        this.images.forEach(image => {
            let meshItem = new MeshItem(image, this.scene);
            this.meshItems.push(meshItem);
        })
    }
	
    // Animate smoothscroll and meshes. Repeatedly called using requestanimationdrame
    render(){

        smoothScroll();
        for(let i = 0; i < this.meshItems.length; i++){
            this.meshItems[i].render();
        }
				
        this.renderer.render(this.scene, this.camera)/* 
				this.renderer.domElement.addEventListener('click', this.onMouseClick()); */
				requestAnimationFrame(this.render.bind(this));
    } 
}

class MeshItem{
    // Pass in the scene as we will be adding meshes to this scene.
    constructor(element, scene){
        this.element = element;
        this.scene = scene;
        this.offset = new THREE.Vector2(0,0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0,0); //Size of mesh on screen. Will be updated below.
        this.createMesh();
    }
    getDimensions(){
        const {width, height, top, left} = this.element.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2); 
    }

    createMesh(){
        this.geometry = new THREE.PlaneBufferGeometry(1,1,100,100);
        this.imageTexture = new THREE.TextureLoader().load(this.element.src);
        this.uniforms = {
            uTexture: {
                //texture data
                value: this.imageTexture
              },
              uOffset: {
                //distortion strength
                value: new THREE.Vector2(0.0, 0.0)
              },
              uAlpha: {
                //opacity
                value: 1
              },
        };
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `uniform sampler2D uTexture;
            uniform vec2 uOffset;
            varying vec2 vUv;
            
            #define M_PI 3.1415926535897932384626433832795
            
            vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
               position.x = position.x + (sin(uv.y * M_PI) * offset.x);
               position.y = position.y + (sin(uv.x * M_PI) * offset.y);
               return position;
            }
            
            void main() {
               vUv = uv;
               vec3 newPosition = deformationCurve(position, uv, uOffset);
               gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            }`,
            fragmentShader:  fragmentShaders,
            transparent: true,
            side: THREE.DoubleSide,
        })
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.getDimensions(); // set offsetand sizes for placement on the scene
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        this.scene.add( this.mesh );
    }

    render(){
        // this function is repeatidly called for each instance in the aboce 
        this.getDimensions();
        this.mesh.position.set(this.offset.x, this.offset.y, 0)
		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
        this.uniforms.uOffset.value.set(this.offset.x * 0.0, -(target- current) * 0.0003 )
    }
}
/* imageHover() */
init()
new EffectCanvas()

