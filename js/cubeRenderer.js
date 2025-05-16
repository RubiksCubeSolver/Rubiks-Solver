/**
 * CubeRenderer - A class for rendering a 3D Rubik's Cube using Three.js
 */
class CubeRenderer {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.cube = null;

        // Define cube colors
        this.colors = {
            U: 0xFFFFFF, // White
            R: 0xFF0000, // Red
            F: 0x00FF00, // Green
            D: 0xFFFF00, // Yellow
            L: 0xFFA500, // Orange
            B: 0x0000FF  // Blue
        };
        
        this.cubelets = [];
        this.cubeGroup = new THREE.Group();
        
        this.init();
    }
    
    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLights();
        this.initControls();
        this.createCube();
        this.animate();
        
        // Make renderer responsive
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xEEEEEE);
        
        // Add a ground plane for better visual reference
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xDDDDDD, 
            roughness: 0.8,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = Math.PI / 2;
        plane.position.y = -3;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }
    
    initCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(5, 5, 7);
        this.camera.lookAt(0, 0, 0);
    }
    
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
    }
    
    initLights() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
        this.scene.add(ambientLight);
        
        // Add directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        
        // Improve shadow quality
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        
        this.scene.add(directionalLight);
        
        // Add another directional light from below to improve visibility
        const fillLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
        fillLight.position.set(-5, -10, -7);
        this.scene.add(fillLight);
    }
    
    initControls() {
        // Add orbit controls to rotate the cube
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 15;
    }
    
    createCube() {
        // We need to position 27 small cubes (cubelets)
        this.cubeGroup = new THREE.Group();
        
        // Clear cubelets array if it exists
        this.cubelets = [];
        
        // Create 3x3x3 cube
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    // Skip the interior cubelet
                    if (x === 0 && y === 0 && z === 0) continue;
                    
                    const cubelet = this.createCubelet(x, y, z);
                    this.cubelets.push(cubelet);
                    this.cubeGroup.add(cubelet);
                }
            }
        }
        
        this.scene.add(this.cubeGroup);
    }
    
    createCubelet(x, y, z) {
        const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        const materials = [];
        
        // Create materials for each face with more visible colors
        for (let i = 0; i < 6; i++) {
            materials.push(new THREE.MeshPhongMaterial({ 
                color: 0x333333,  // Default dark gray
                shininess: 30,
                specular: 0x222222
            }));
        }
        
        // Assign colors to the faces that are on the outside of the cube
        // Order: right, left, top, bottom, front, back
        
        // Right face (x = 1) gets R color
        if (x === 1) materials[0].color.setHex(this.colors.R);
        
        // Left face (x = -1) gets L color
        if (x === -1) materials[1].color.setHex(this.colors.L);
        
        // Top face (y = 1) gets U color
        if (y === 1) materials[2].color.setHex(this.colors.U);
        
        // Bottom face (y = -1) gets D color
        if (y === -1) materials[3].color.setHex(this.colors.D);
        
        // Front face (z = 1) gets F color
        if (z === 1) materials[4].color.setHex(this.colors.F);
        
        // Back face (z = -1) gets B color
        if (z === -1) materials[5].color.setHex(this.colors.B);
        
        const cubelet = new THREE.Mesh(geometry, materials);
        cubelet.position.set(x, y, z);
        cubelet.castShadow = true;
        cubelet.receiveShadow = true;
        
        // Add black edges to cubelets
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        cubelet.add(edges);
        
        // Store the original position
        cubelet.userData = {
            originalPosition: {x, y, z}
        };
        
        return cubelet;
    }
    
    updateCubeFromState(cube) {
        // Store the cube reference
        this.cube = cube;
        
        // Get the current state from the Cube.js library
        const state = cube.asString();
        
        // Update the cubelet colors based on the state
        this.updateColors(state);
    }
    
    updateColors(state) {
        // state is a 54-character string representing the colors of each facelet
        // The order is: 
        // U (9), R (9), F (9), D (9), L (9), B (9)
        
        const faces = {
            U: state.substring(0, 9),
            R: state.substring(9, 18),
            F: state.substring(18, 27),
            D: state.substring(27, 36),
            L: state.substring(36, 45),
            B: state.substring(45, 54)
        };
        
        // Map from face letter to position
        const faceToPos = {
            'U': { y: 1 },   // Top face
            'D': { y: -1 },  // Bottom face
            'R': { x: 1 },   // Right face
            'L': { x: -1 },  // Left face
            'F': { z: 1 },   // Front face
            'B': { z: -1 }   // Back face
        };
        
        // Map from face letter to material index
        const faceToMaterialIndex = {
            'R': 0, // Right
            'L': 1, // Left
            'U': 2, // Top
            'D': 3, // Bottom
            'F': 4, // Front
            'B': 5  // Back
        };
        
        // For each face
        for (const face in faces) {
            const faceStr = faces[face];
            const posProperty = Object.keys(faceToPos[face])[0]; // x, y, or z
            const posValue = faceToPos[face][posProperty];
            const materialIndex = faceToMaterialIndex[face];
            
            // For each facelet on this face
            for (let i = 0; i < 9; i++) {
                const colorFace = faceStr[i];
                const color = this.colors[colorFace];
                
                // Calculate position based on the standardized layout in the diagram
                // The layout numbering follows this pattern for each face:
                // 1 2 3
                // 4 5 6
                // 7 8 9
                
                // Calculate row and column (0-2) from index (0-8)
                const row = Math.floor(i / 3);
                const col = i % 3;
                
                // Find the cubelet at this position
                let cubeletPos = {};
                
                // Set the position based on the face
                if (face === 'U') {
                    // Top face (white): x goes right, z goes down in the diagram
                    cubeletPos = {
                        x: col - 1,        // -1, 0, 1
                        y: posValue,        // 1 (fixed)
                        z: row - 1         // -1, 0, 1 (inverted to match notation)
                    };
                } else if (face === 'D') {
                    // Bottom face (yellow): x goes right, z goes up in the diagram
                    cubeletPos = {
                        x: col - 1,        // -1, 0, 1
                        y: posValue,        // -1 (fixed)
                        z: 1 - row         // 1, 0, -1 (inverted to match notation)
                    };
                } else if (face === 'F') {
                    // Front face (green): x goes right, y goes down in the diagram
                    cubeletPos = {
                        x: col - 1,        // -1, 0, 1
                        y: 1 - row,        // 1, 0, -1
                        z: posValue        // 1 (fixed)
                    };
                } else if (face === 'B') {
                    // Back face (blue): x goes left, y goes down in the diagram
                    cubeletPos = {
                        x: 1 - col,        // 1, 0, -1
                        y: 1 - row,        // 1, 0, -1
                        z: posValue        // -1 (fixed)
                    };
                } else if (face === 'R') {
                    // Right face (red): z goes left, y goes down in the diagram
                    cubeletPos = {
                        x: posValue,        // 1 (fixed)
                        y: 1 - row,        // 1, 0, -1
                        z: 1 - col         // 1, 0, -1
                    };
                } else if (face === 'L') {
                    // Left face (orange): z goes right, y goes down in the diagram
                    cubeletPos = {
                        x: posValue,        // -1 (fixed)
                        y: 1 - row,        // 1, 0, -1
                        z: col - 1         // -1, 0, 1
                    };
                }
                
                // Find the cubelet at this position
                const cubelet = this.findCubeletAtPosition(cubeletPos.x, cubeletPos.y, cubeletPos.z);
                
                if (cubelet) {
                    // Update the color on the correct material
                    cubelet.material[materialIndex].color.setHex(color);
                } else {
                    console.warn(`No cubelet found at position: (${cubeletPos.x}, ${cubeletPos.y}, ${cubeletPos.z}) for face ${face} index ${i}`);
                }
            }
        }
    }
    
    findCubeletAtPosition(x, y, z) {
        // Tolerance for floating point comparison
        const tolerance = 0.1;
        
        for (const cubelet of this.cubelets) {
            const pos = cubelet.position;
            if (
                Math.abs(pos.x - x) < tolerance &&
                Math.abs(pos.y - y) < tolerance &&
                Math.abs(pos.z - z) < tolerance
            ) {
                return cubelet;
            }
        }
        
        return null;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
} 