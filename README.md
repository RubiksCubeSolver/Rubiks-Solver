# Rubik's Cube Solver

A JavaScript implementation for modeling, visualizing, and solving the 3x3x3 Rubik's Cube, based on [cubejs](https://github.com/ldez/cubejs).

## Features

- Interactive 3D visualization of a Rubik's Cube using Three.js
- Apply moves to the cube (face rotations)
- Scramble the cube randomly
- Automatically solve any scrambled cube using Herbert Kociemba's two-phase algorithm
- Step-by-step solution animation
- Keyboard shortcuts for common moves

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Rubiks-Solver.git
   cd Rubiks-Solver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

## Usage

### Basic Controls

- **Mouse**: Click and drag to rotate the cube view
- **Mouse wheel**: Zoom in and out
- **Reset**: Return the cube to its solved state
- **Scramble**: Apply a random scramble to the cube
- **Solve**: Find and display the solution for the current cube state

### Move Notation

The application follows standard Rubik's Cube notation:

- **U**: Up face clockwise
- **U'**: Up face counter-clockwise
- **R**: Right face clockwise
- **R'**: Right face counter-clockwise
- **F**: Front face clockwise
- **F'**: Front face counter-clockwise
- **D**: Down face clockwise
- **D'**: Down face counter-clockwise
- **L**: Left face clockwise
- **L'**: Left face counter-clockwise
- **B**: Back face clockwise
- **B'**: Back face counter-clockwise

### Keyboard Shortcuts

- **u**: U move
- **U**: U' move (hold Shift + u)
- **r**: R move
- **R**: R' move (hold Shift + r)
- **f**: F move
- **F**: F' move (hold Shift + f)
- **d**: D move
- **D**: D' move (hold Shift + d)
- **l**: L move
- **L**: L' move (hold Shift + l)
- **b**: B move
- **B**: B' move (hold Shift + b)

## How It Works

The application uses several key technologies:

1. **cubejs**: Provides the core cube model and solving algorithm (Kociemba's two-phase algorithm)
2. **Three.js**: Powers the 3D visualization of the cube
3. **Express.js**: Serves the web application

The solver can find a solution for any valid cube state in 22 moves or less. The initialization of the solver may take a few seconds when the application first loads.

## License

MIT License 