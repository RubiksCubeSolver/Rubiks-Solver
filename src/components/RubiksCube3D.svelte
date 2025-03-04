<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { createSolvedCube, FACES, COLORS } from '../models/cubeModel';
  import { cubeColors, applyColorsToCSS } from '../config/cubeColors';
  import ColorPalette from './ColorPalette.svelte';
  
  export let cube = createSolvedCube();
  
  const dispatch = createEventDispatcher();
  
  let container;
  let camera, scene, renderer, controls;
  let cubeGroup;
  let isInitialized = false;
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let selectedColor = { name: 'white', value: cubeColors.white };
  let isDragging = false;
  let mouseDownTime = 0;
  
  const faceIndicesMap = {
    0: FACES.RIGHT,
    1: FACES.LEFT,
    2: FACES.TOP,
    3: FACES.BOTTOM,
    4: FACES.FRONT,
    5: FACES.BACK
  };
  
  function scrambleCube() {
    dispatch('scramble');
  }
  
  function resetCube() {
    dispatch('reset');
  }
  
  onMount(() => {
    applyColorsToCSS();
  });
  
  function init() {
    if (!container) return;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(4.5, 5.5, 5);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      shadowMap: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -7);
    scene.add(fillLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -10, 0);
    scene.add(rimLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 0.3);
    pointLight1.position.set(3, -3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
    pointLight2.position.set(-3, 3, -3);
    scene.add(pointLight2);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    
    createCubeGroup();
    
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchmove', onTouchMove);
    
    window.addEventListener('resize', onWindowResize);
    
    animate();
    
    isInitialized = true;
  }
  
  function createCubeGroup() {
    if (cubeGroup) {
      scene.remove(cubeGroup);
    }
    
    cubeGroup = new THREE.Group();
    
    const cubeSize = 0.9;
    const spacing = 0.03;
    
    const materials = {};
    Object.entries(COLORS).forEach(([name, colorKey]) => {
      const colorValue = cubeColors[colorKey];
      materials[colorKey] = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorValue),
        roughness: 0.3,
        metalness: 0.1,
        envMapIntensity: 1.0,
        flatShading: false
      });
    });
    
    const blackMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cubeColors.border),
      roughness: 0.7,
      metalness: 0.1
    });
    
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          if (x === 1 && y === 1 && z === 1) continue;
          
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          
          const cubeMaterials = [
            x === 2 ? materials[cube[FACES.RIGHT][y * 3 + (2 - z)]] : blackMaterial,
            x === 0 ? materials[cube[FACES.LEFT][y * 3 + z]] : blackMaterial,
            y === 2 ? materials[cube[FACES.TOP][z * 3 + x]] : blackMaterial,
            y === 0 ? materials[cube[FACES.BOTTOM][(2-z) * 3 + x]] : blackMaterial,
            z === 2 ? materials[cube[FACES.FRONT][y * 3 + (2 - x)]] : blackMaterial,
            z === 0 ? materials[cube[FACES.BACK][y * 3 + x]] : blackMaterial
          ];
          
          const cubieMesh = new THREE.Mesh(geometry, cubeMaterials);
          cubieMesh.castShadow = true;
          cubieMesh.receiveShadow = true;
          
          cubieMesh.position.x = (x - 1) * (cubeSize + spacing);
          cubieMesh.position.y = (y - 1) * (cubeSize + spacing);
          cubieMesh.position.z = (z - 1) * (cubeSize + spacing);
          
          cubieMesh.userData = { x, y, z };
          
          cubeGroup.add(cubieMesh);
        }
      }
    }
    
    scene.add(cubeGroup);
  }
  
  function onMouseDown(event) {
    mouseDownTime = Date.now();
    isDragging = false;
  }
  
  function onMouseMove() {
    isDragging = true;
  }
  
  function onMouseUp(event) {
    if (isDragging || Date.now() - mouseDownTime > 200) return;
    
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    
    checkIntersection();
  }
  
  function onTouchStart(event) {
    mouseDownTime = Date.now();
    isDragging = false;
  }
  
  function onTouchMove() {
    isDragging = true;
  }
  
  function onTouchEnd(event) {
    if (isDragging || Date.now() - mouseDownTime > 200) return;
    
    const touch = event.changedTouches[0];
    const rect = container.getBoundingClientRect();
    mouse.x = ((touch.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((touch.clientY - rect.top) / container.clientHeight) * 2 + 1;
    
    checkIntersection();
  }
  
  function checkIntersection() {
    if (!camera || !scene) return;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubeGroup.children);
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const cubieObject = intersection.object;
      const faceIndex = intersection.faceIndex;
      const { x, y, z } = cubieObject.userData;
      
      const hitFaceIndex = Math.floor(faceIndex / 2);
      
      let targetFace;
      let squareIndex;
      
      switch(hitFaceIndex) {
        case 0:
          if (x === 2) {
            targetFace = FACES.RIGHT;
            squareIndex = y * 3 + (2 - z);
          }
          break;
        case 1:
          if (x === 0) {
            targetFace = FACES.LEFT;
            squareIndex = y * 3 + z;
          }
          break;
        case 2:
          if (y === 2) {
            targetFace = FACES.TOP;
            squareIndex = z * 3 + x;
          }
          break;
        case 3:
          if (y === 0) {
            targetFace = FACES.BOTTOM;
            squareIndex = (2-z) * 3 + x;
          }
          break;
        case 4:
          if (z === 2) {
            targetFace = FACES.FRONT;
            squareIndex = y * 3 + (2 - x);
          }
          break;
        case 5:
          if (z === 0) {
            targetFace = FACES.BACK;
            squareIndex = y * 3 + x;
          }
          break;
      }
      
      if (targetFace !== undefined && squareIndex !== undefined) {
        updateCubeFaceColor(targetFace, squareIndex, selectedColor.name);
      }
    }
  }
  
  function updateCubeFaceColor(faceIndex, squareIndex, colorName) {
    cube[faceIndex][squareIndex] = colorName;
    createCubeGroup();
  }
  
  function handleColorSelected(event) {
    selectedColor = event.detail;
  }
  
  function onWindowResize() {
    if (!camera || !renderer || !container) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  
  function animate() {
    if (!renderer || !scene || !camera || !controls) return;
    
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  $: {
    if (cube && scene && isInitialized) {
      createCubeGroup();
    }
  }
  
  onMount(() => {
    if (document.readyState === 'complete') {
      setTimeout(() => {
        if (container) init();
      }, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          if (container) init();
        }, 100);
      });
    }
  });
  
  onDestroy(() => {
    if (renderer) {
      window.removeEventListener('resize', onWindowResize);
      container?.removeEventListener('mousedown', onMouseDown);
      container?.removeEventListener('mouseup', onMouseUp);
      container?.removeEventListener('mousemove', onMouseMove);
      container?.removeEventListener('touchstart', onTouchStart);
      container?.removeEventListener('touchend', onTouchEnd);
      container?.removeEventListener('touchmove', onTouchMove);
      renderer.dispose();
      if (controls) controls.dispose();
    }
  });
</script>

<div class="cube-3d-layout">
  <div class="cube-side">
    <div class="cube-3d-container" bind:this={container}></div>
    
    <div class="controls-info">
      <div class="info-text">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z"/>
        </svg>
        <span>Drag to rotate, scroll to zoom, click to color</span>
      </div>
    </div>
  </div>
  
  <div class="palette-side">
    <ColorPalette on:colorSelected={handleColorSelected} />
    
    <div class="cube-controls">
      <button on:click={scrambleCube}>Scramble</button>
      <button on:click={resetCube}>Reset</button>
    </div>
  </div>
</div>

<style>
  .cube-3d-layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    width: 80%;
    max-width: 900px;
    margin: 20px auto;
  }
  
  .cube-side {
    flex: 2;
    display: flex;
    flex-direction: column;
  }
  
  .palette-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 200px;
  }
  
  .cube-3d-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    background: linear-gradient(145deg, #f0f0f0, #e6e6e6);
    box-shadow: 
      8px 8px 16px rgba(0, 0, 0, 0.1),
      -8px -8px 16px rgba(255, 255, 255, 0.8),
      inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .controls-info {
    margin-top: 15px;
  }
  
  .info-text {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 6px 12px;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .info-text svg {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
  
  .cube-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cube-controls button {
    background-color: var(--color-black);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;
  }
  
  .cube-controls button:hover {
    background-color: #555;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .cube-controls button:active {
    transform: translateY(0);
  }
  
  @media (max-width: 900px) {
    .cube-3d-layout {
      flex-direction: column;
      width: 95%;
    }
    
    .cube-side, .palette-side {
      width: 100%;
    }
    
    .palette-side {
      flex-direction: row;
      align-items: flex-start;
      gap: 20px;
    }
    
    .cube-controls {
      flex-direction: row;
      margin-top: 0;
    }
  }
  
  @media (max-width: 600px) {
    .palette-side {
      flex-direction: column;
    }
    
    .cube-controls {
      flex-direction: row;
      margin-top: 20px;
    }
    
    .info-text {
      font-size: 12px;
      padding: 5px 10px;
    }
    
    .info-text svg {
      width: 18px;
      height: 18px;
    }
  }
</style> 