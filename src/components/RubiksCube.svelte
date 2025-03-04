<script lang="ts">
  import { onMount } from 'svelte';
  import { createSolvedCube, FACES, COLORS } from '../models/cubeModel';
  import CubeFace from './CubeFace.svelte';
  
  export let cube = createSolvedCube();
  
  const faceNames = ['Top', 'Bottom', 'Left', 'Right', 'Front', 'Back'];

  function scrambleCube() {
    let scrambledCube = JSON.parse(JSON.stringify(cube));
    
    for (let face = 0; face < 6; face++) {
      let indices = [...Array(9).keys()];
      
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      
      const originalFace = [...scrambledCube[face]];
      for (let i = 0; i < 9; i++) {
        scrambledCube[face][i] = originalFace[indices[i]];
      }
    }
    
    cube = scrambledCube;
  }
  
  function resetCube() {
    cube = createSolvedCube();
  }
</script>

<div class="rubiks-cube-container">
  <div class="cube-layout">
    <div class="cube-row empty-cell"></div>
    <div class="cube-row top-face">
      <CubeFace face={cube[FACES.TOP]} faceName={faceNames[FACES.TOP]} />
    </div>
    <div class="cube-row empty-cell"></div>
    
    <div class="cube-row middle-faces">
      <CubeFace face={cube[FACES.LEFT]} faceName={faceNames[FACES.LEFT]} />
      <CubeFace face={cube[FACES.FRONT]} faceName={faceNames[FACES.FRONT]} />
      <CubeFace face={cube[FACES.RIGHT]} faceName={faceNames[FACES.RIGHT]} />
      <CubeFace face={cube[FACES.BACK]} faceName={faceNames[FACES.BACK]} />
    </div>
    
    <div class="cube-row empty-cell"></div>
    <div class="cube-row bottom-face">
      <CubeFace face={cube[FACES.BOTTOM]} faceName={faceNames[FACES.BOTTOM]} />
    </div>
    <div class="cube-row empty-cell"></div>
  </div>
  
  <div class="controls">
    <button on:click={scrambleCube}>Scramble</button>
    <button on:click={resetCube}>Reset</button>
  </div>
  
  <div class="legend">
    <h3>Color Legend</h3>
    <div class="legend-items">
      {#each Object.entries(COLORS) as [colorName, colorValue]}
        <div class="legend-item">
          <div class="color-square" style="background-color: var(--color-{colorValue})"></div>
          <span>{colorName.charAt(0) + colorName.slice(1).toLowerCase()}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .rubiks-cube-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    max-width: 100%;
    overflow-x: auto;
  }
  
  .cube-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .cube-row {
    display: flex;
    justify-content: center;
  }
  
  .middle-faces {
    display: flex;
    flex-wrap: nowrap;
  }
  
  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  button {
    cursor: pointer;
    border: none;
    background: var(--color-black);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #555;
  }

  button:active {
    transform: translateY(1px);
  }
  
  .legend {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .legend h3 {
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .legend-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .color-square {
    width: 20px;
    height: 20px;
    border: 1px solid var(--color-border);
  }
  
  @media (max-width: 768px) {
    .middle-faces {
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .legend-items {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 
