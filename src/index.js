import './styles/main.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {menu1} from './js/menu.js';
/* import Image1 from '../src/assets/images1.jpg'; */
/* import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl'; */
/* import { menu, menu1, triangle } from './js/menu.js'; */
const scrollAction = () => {
  window.addEventListener('scroll', (e)=> {
   /*  console.log(window.scrollY) */
   /*  menu1() */
    if (window.scrollY > 200) {
      setTimeout(()=>{
        const img1Top = document.querySelector('.imageTop');
      img1Top.style.display = 'flex';
      const imageBottom = document.querySelector('.imageBottom');
      imageBottom.style.display = 'none';
    }, 500)
      
      
    }
    if (window.scrollY > 500) {
      setTimeout(()=> {
        const img2 = document.querySelector('.image3');
        img2.style.display = 'flex';
      }, 500)
   
    }
  })
}
/* const animationThree = () => {
  const container = document.querySelector('#root');
  const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(render);
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 0, 1);
  const clock = new THREE.Clock();
  const geometry = new THREE.PlaneGeometry(0.4, 0.6, 16, 16);
  let Image1 = document.querySelectorAll('img');
  console.log(Image1)
  Image1.forEach((image)=> {
    const srcImage = image.src
     
  })
  const material = new THREE.ShaderMaterial({
    vertexShader: `precision mediump float;

    varying vec2 vUv;
    uniform float uTime;
    
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
      // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
               
      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      vUv = uv;
    
      vec3 pos = position;
      float noiseFreq = 3.5;
      float noiseAmp = 0.15; 
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise(noisePos) * noiseAmp;
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }`,
    fragmentShader: `precision mediump float;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main() {
      vec3 texture = texture2D(uTexture, vUv).rgb;
      gl_FragColor = vec4(texture, 1.);
    }`,
    uniforms: {
      uTime: {
        value: 0.0
      },
      uTexture: { value: new THREE.TextureLoader().load(Image1)},
      wireframe: true,
      side: THREE.DoubleSide
    }
  });
  
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  

  
  animate()
  function animate() {
		requestAnimationFrame( animate );
		
		render();
	}
  function render() {
    material.uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  }
} */
const animationThree = () => {
  let scrollable = document.querySelector('.image');
  let current = 0;
  let target = 0;
  let ease = 0.075;
  function lerp(start, end, t){
    return start * (1 - t ) + end * t;
}

// init function triggered on page load to set the body height to enable scrolling and EffectCanvas initialised
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
  const container = document.querySelector('#root');
  const renderer = new THREE.WebGL1Renderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(viewport.width, viewport.height);
  renderer.setAnimationLoop(render);
  container.appendChild(renderer.domElement);
  let meshItems = [];
  const scene = new THREE.Scene();
  let perspective = 1000;
  const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 0, perspective);
  const clock = new THREE.Clock();
  const geometry = new THREE.PlaneGeometry(0.4, 0.6, 16, 16);
  let Image1 =[...document.querySelectorAll('img')]
  createMeshItems()
 /*  console.log(Image1)
  Image1.forEach((image)=> {
    const srcImage = image.src
     
  }) */
  function onWindowResize(){
    init();
    this.camera.aspect = this.viewport.aspectRatio; // readjust the aspect ratio.
    this.camera.updateProjectionMatrix(); // Used to recalulate projectin dimensions.
    this.renderer.setSize(this.viewport.width, this.viewport.height); 
}
function createMeshItems(){
  // Loop thorugh all images and create new MeshItem instances. Push these instances to the meshItems array.
  this.images.forEach(image => {
      let meshItem = new MeshItem(image, this.scene);
      this.meshItems.push(meshItem);
  })
}
  const material = new THREE.ShaderMaterial({
    vertexShader: `precision mediump float;

    varying vec2 vUv;
    uniform float uTime;
    
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
      // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
               
      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      vUv = uv;
    
      vec3 pos = position;
      float noiseFreq = 3.5;
      float noiseAmp = 0.15; 
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise(noisePos) * noiseAmp;
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }`,
    fragmentShader: `precision mediump float;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main() {
      vec3 texture = texture2D(uTexture, vUv).rgb;
      gl_FragColor = vec4(texture, 1.);
    }`,
    uniforms: {
      uTime: {
        value: 0.0
      },
      uTexture: { value: new THREE.TextureLoader().load(Image1)},
      wireframe: true,
      side: THREE.DoubleSide
    }
  });
  
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  

  
  animate()
  function animate() {
		requestAnimationFrame( animate );
		
		render();
	}
  function render() {
    material.uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  }
}
// Append heading node to the DOM
const app = document.querySelector('#root')
app.append(/* scrollAction(),animationThree() */)
