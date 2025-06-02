/**
 * Main application logic for the Rubik's Cube Solver
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app immediately without waiting for script load
    try {
        initApp();
    } catch (error) {
        console.error("Error initializing application:", error);
        document.getElementById('canvas-container').innerHTML = 
            `<div class="error-message">
                <h3>Error Loading Cube Renderer</h3>
                <p>${error.message}</p>
                <p>Please check the console for more details.</p>
             </div>`;
    }
    
    function initApp() {
        // Initialize Kociemba's solver
        console.log('Initializing solver...');
        
        try {
            Cube.initSolver();
            console.log('Solver initialized!');
        } catch (e) {
            console.error('Failed to initialize solver:', e);
            alert('Failed to initialize cube solver. The app might not work correctly.');
        }
        
        // Create cube instance
        const cube = new Cube();
        
        // Initialize the 3D renderer
        const renderer = new CubeRenderer('#canvas-container');
        renderer.updateCubeFromState(cube);
        
        // Reference to interface elements
        const resetBtn = document.getElementById('reset-btn');
        const scrambleBtn = document.getElementById('scramble-btn');
        const solveBtn = document.getElementById('solve-btn');
        const solutionSection = document.getElementById('solution-section');
        const solutionText = document.getElementById('solution-text');
        const applySolutionBtn = document.getElementById('apply-solution-btn');
        const copySolutionBtn = document.getElementById('copy-solution-btn');
        const moveButtons = document.querySelectorAll('.move-btn');
        
        // Manual input elements
        const cubeInputContainer = document.getElementById('cube-input');
        const colorButtons = document.querySelectorAll('.color-button');
        const applyInputBtn = document.getElementById('apply-input-btn');
        const resetInputBtn = document.getElementById('reset-input-btn');
        
        // Initialize cube input UI
        initCubeInput();
        
        // Track the current solution
        let currentSolution = '';
        let selectedColor = 'U'; // Default selected color
        
        // Event handlers for basic controls
        resetBtn.addEventListener('click', () => {
            cube.identity();
            renderer.updateCubeFromState(cube);
            solutionSection.style.display = 'none';
        });
        
        scrambleBtn.addEventListener('click', () => {
            const scramble = Cube.random().solve();
            cube.move(Cube.inverse(scramble));
            renderer.updateCubeFromState(cube);
            solutionSection.style.display = 'none';
            updateCubeInput(cube.asString());
        });
        
        solveBtn.addEventListener('click', () => {
            if (cube.isSolved()) {
                solutionText.textContent = 'Cube is already solved!';
            } else {
                // Solve the cube
                try {
                    currentSolution = cube.solve();
                    solutionText.textContent = currentSolution || 'No solution found!';
                } catch (e) {
                    solutionText.textContent = 'Error: ' + e.message;
                    console.error(e);
                }
            }
            
            solutionSection.style.display = 'block';
        });
        
        applySolutionBtn.addEventListener('click', () => {
            if (currentSolution) {
                // Apply each move with a small delay to animate
                const moves = currentSolution.split(' ');
                let i = 0;
                
                function applyNextMove() {
                    if (i < moves.length) {
                        cube.move(moves[i]);
                        renderer.updateCubeFromState(cube);
                        updateCubeInput(cube.asString());
                        i++;
                        setTimeout(applyNextMove, 300);
                    }
                }
                
                applyNextMove();
                solutionSection.style.display = 'none';
            }
        });
        
        copySolutionBtn.addEventListener('click', () => {
            if (currentSolution) {
                navigator.clipboard.writeText(currentSolution)
                    .then(() => {
                        // Temporarily change the button text to indicate success
                        const originalText = copySolutionBtn.textContent;
                        copySolutionBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copySolutionBtn.textContent = originalText;
                        }, 1500);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                    });
            }
        });
        
        // Add event listeners for move buttons
        moveButtons.forEach(button => {
            button.addEventListener('click', () => {
                const move = button.getAttribute('data-move');
                cube.move(move);
                renderer.updateCubeFromState(cube);
                updateCubeInput(cube.asString());
                solutionSection.style.display = 'none';
            });
        });
        
        // Add event listeners for color buttons
        colorButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove selected class from all buttons
                colorButtons.forEach(btn => btn.classList.remove('color-selected'));
                
                // Add selected class to clicked button
                button.classList.add('color-selected');
                
                // Update selected color
                selectedColor = button.getAttribute('data-color');
            });
        });
        
        // Make the first color button selected by default
        colorButtons[0].classList.add('color-selected');
        
        // Apply input to the cube
        applyInputBtn.addEventListener('click', () => {
            const inputState = getCubeInputState();
            
            try {
                // Create a new cube with the input state
                const newCube = Cube.fromString(inputState);
                
                // Update the current cube with the new state
                cube.init(newCube);
                
                // Update renderer
                renderer.updateCubeFromState(cube);
                
                solutionSection.style.display = 'none';
            } catch (e) {
                alert('Invalid cube state. Please check your input.');
                console.error(e);
            }
        });
        
        // Reset input to match the current cube state
        resetInputBtn.addEventListener('click', () => {
            updateCubeInput(cube.asString());
        });
        
        // Enable keyboard shortcuts for moves
        document.addEventListener('keydown', (e) => {
            const keyToMove = {
                'u': 'U', 'U': 'U\'',
                'r': 'R', 'R': 'R\'',
                'f': 'F', 'F': 'F\'',
                'd': 'D', 'D': 'D\'',
                'l': 'L', 'L': 'L\'',
                'b': 'B', 'B': 'B\'',
            };
            
            if (keyToMove.hasOwnProperty(e.key)) {
                cube.move(keyToMove[e.key]);
                renderer.updateCubeFromState(cube);
                updateCubeInput(cube.asString());
                solutionSection.style.display = 'none';
            }
        });
        
        // Initialize the cube input UI
        function initCubeInput() {
            // Create the cube unfolded layout template
            const layout = [
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4],
                [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4],
                [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4],
                [0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0]
            ];
            
            // Clear the container
            cubeInputContainer.innerHTML = '';
            
            // Face to index mapping
            const faceToIndex = {
                'U': 1,
                'L': 1,
                'F': 2,
                'R': 3,
                'B': 4,
                'D': 5
            };
            
            // Create the facelet elements
            for (let row = 0; row < layout.length; row++) {
                for (let col = 0; col < layout[row].length; col++) {
                    const cellValue = layout[row][col];
                    
                    if (cellValue > 0) {
                        // Create a facelet element
                        const facelet = document.createElement('div');
                        facelet.className = 'facelet';
                        facelet.setAttribute('data-row', row);
                        facelet.setAttribute('data-col', col);
                        facelet.style.gridRow = `${row + 1}`;
                        facelet.style.gridColumn = `${col + 1}`;
                        
                        // Add click event to change color
                        facelet.addEventListener('click', () => {
                            // Remove previous color class
                            facelet.className = 'facelet';
                            
                            // Add new color class
                            facelet.classList.add(`facelet-${selectedColor}`);
                            facelet.setAttribute('data-color', selectedColor);
                        });
                        
                        cubeInputContainer.appendChild(facelet);
                    }
                }
            }
            
            // Initialize with solved state
            updateCubeInput(cube.asString());
        }
        
        // Update the cube input UI based on the cube state
        function updateCubeInput(stateString) {
            // State string is a 54-character string representing the colors of each facelet
            // The order is: 
            // U (9), R (9), F (9), D (9), L (9), B (9)
            
            // Get all facelets in the input container
            const facelets = cubeInputContainer.querySelectorAll('.facelet');
            
            // Face order in the cube state string
            const faces = ['U', 'R', 'F', 'D', 'L', 'B'];
            
            // Helper function to determine facelet coordinates
            function getFaceletCoordinates(face, index) {
                const row = Math.floor(index / 3);
                const col = index % 3;
                
                // Map cube faces to grid positions in the unfolded cube layout
                switch (face) {
                    case 'U': // Up face
                        return { row: row, col: col + 3 };
                    case 'L': // Left face
                        return { row: row + 3, col: col };
                    case 'F': // Front face
                        return { row: row + 3, col: col + 3 };
                    case 'R': // Right face
                        return { row: row + 3, col: col + 6 };
                    case 'B': // Back face
                        return { row: row + 3, col: col + 9 };
                    case 'D': // Down face
                        return { row: row + 6, col: col + 3 };
                }
            }
            
            // Clear all facelets
            facelets.forEach(facelet => {
                facelet.className = 'facelet';
                facelet.removeAttribute('data-color');
            });
            
            // Set colors for each facelet
            for (let i = 0; i < faces.length; i++) {
                const face = faces[i];
                const offset = i * 9;
                
                for (let j = 0; j < 9; j++) {
                    const color = stateString[offset + j];
                    const coords = getFaceletCoordinates(face, j);
                    
                    // Find the facelet at these coordinates
                    const facelet = findFaceletAtPosition(coords.row, coords.col);
                    
                    if (facelet) {
                        facelet.className = 'facelet';
                        facelet.classList.add(`facelet-${color}`);
                        facelet.setAttribute('data-color', color);
                    }
                }
            }
        }
        
        // Helper function to find a facelet element at a specific position in the grid
        function findFaceletAtPosition(row, col) {
            const facelets = cubeInputContainer.querySelectorAll('.facelet');
            
            for (const facelet of facelets) {
                const faceletRow = parseInt(facelet.getAttribute('data-row'));
                const faceletCol = parseInt(facelet.getAttribute('data-col'));
                
                if (faceletRow === row && faceletCol === col) {
                    return facelet;
                }
            }
            
            return null;
        }
        
        // Get the cube state from the input UI
        function getCubeInputState() {
            const facelets = cubeInputContainer.querySelectorAll('.facelet');
            
            // Initialize state string with placeholder characters
            let stateArr = Array(54).fill('?');
            
            // Helper function to determine state string index from facelet coordinates
            function getStateIndex(row, col) {
                // Map grid positions in the unfolded cube layout to state string indices
                
                // Up face
                if (row < 3 && col >= 3 && col < 6) {
                    const index = (row * 3) + (col - 3);
                    return index; // 0-8
                }
                
                // Left face
                if (row >= 3 && row < 6 && col < 3) {
                    const index = 36 + ((row - 3) * 3) + col;
                    return index; // 36-44
                }
                
                // Front face
                if (row >= 3 && row < 6 && col >= 3 && col < 6) {
                    const index = 18 + ((row - 3) * 3) + (col - 3);
                    return index; // 18-26
                }
                
                // Right face
                if (row >= 3 && row < 6 && col >= 6 && col < 9) {
                    const index = 9 + ((row - 3) * 3) + (col - 6);
                    return index; // 9-17
                }
                
                // Back face
                if (row >= 3 && row < 6 && col >= 9 && col < 12) {
                    const index = 45 + ((row - 3) * 3) + (col - 9);
                    return index; // 45-53
                }
                
                // Down face
                if (row >= 6 && row < 9 && col >= 3 && col < 6) {
                    const index = 27 + ((row - 6) * 3) + (col - 3);
                    return index; // 27-35
                }
                
                return -1; // Invalid position
            }
            
            // Collect color data from each facelet
            for (const facelet of facelets) {
                const row = parseInt(facelet.getAttribute('data-row'));
                const col = parseInt(facelet.getAttribute('data-col'));
                const color = facelet.getAttribute('data-color');
                
                if (color) {
                    const stateIndex = getStateIndex(row, col);
                    if (stateIndex >= 0) {
                        stateArr[stateIndex] = color;
                    }
                }
            }
            
            // Check if there are any unfilled positions
            if (stateArr.includes('?')) {
                throw new Error('Incomplete cube state');
            }
            
            return stateArr.join('');
        }
    }
}); 