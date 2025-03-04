<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createSolvedCube, FACES, COLORS } from '../models/cubeModel';
  import CubeFace from './CubeFace.svelte';
  
  export let cube = createSolvedCube();
  export let hideButtons = false;
  
  const dispatch = createEventDispatcher();
  
  const faceNames = {
    [FACES.TOP]: "Top",
    [FACES.BOTTOM]: "Bottom",
    [FACES.LEFT]: "Left",
    [FACES.RIGHT]: "Right",
    [FACES.FRONT]: "Front",
    [FACES.BACK]: "Back"
  };

  function scrambleCube() {
    dispatch('scramble');
  }
  
  function resetCube() {
    dispatch('reset');
  }
</script>

<div class="cube-container">
  <div class="cube-grid">
    <div class="face-spacer"></div>
    <CubeFace face={cube[FACES.TOP]} faceName={faceNames[FACES.TOP]} />
    <div class="face-spacer"></div>
    <div class="face-spacer"></div>
    
    <CubeFace face={cube[FACES.LEFT]} faceName={faceNames[FACES.LEFT]} />
    <CubeFace face={cube[FACES.FRONT]} faceName={faceNames[FACES.FRONT]} />
    <CubeFace face={cube[FACES.RIGHT]} faceName={faceNames[FACES.RIGHT]} />
    <CubeFace face={cube[FACES.BACK]} faceName={faceNames[FACES.BACK]} />
    
    <div class="face-spacer"></div>
    <CubeFace face={cube[FACES.BOTTOM]} faceName={faceNames[FACES.BOTTOM]} />
    <div class="face-spacer"></div>
    <div class="face-spacer"></div>
  </div>
  
  {#if !hideButtons}
    <div class="controls">
      <button on:click={scrambleCube}>Scramble</button>
      <button on:click={resetCube}>Reset</button>
    </div>
  {/if}
  
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
  .cube-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    max-width: 600px;
  }
  
  .cube-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 5px;
    margin-bottom: 20px;
  }
  
  .face-spacer {
    visibility: hidden;
  }
  
  .controls {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  button {
    background-color: var(--color-black);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:hover {
    background-color: #555;
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
    .legend-items {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 
