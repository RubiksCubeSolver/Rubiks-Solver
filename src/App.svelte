<script lang="ts">
  import RubiksCube from './components/RubiksCube.svelte';
  import RubiksCube3D from './components/RubiksCube3D.svelte';
  import { createSolvedCube } from './models/cubeModel';
  
  import { onMount } from 'svelte';
  
  let cube = createSolvedCube();
  let activeView = '3d';
  
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

<main>
  <h1>Rubik's Cube</h1>
  
  <div class="view-toggle">
    <button class:active={activeView === '3d'} on:click={() => activeView = '3d'}>3D View</button>
    <button class:active={activeView === '2d'} on:click={() => activeView = '2d'}>2D View</button>
  </div>
  
  <!-- Only show buttons for 2D view - 3D view has its own buttons -->
  {#if activeView === '2d'}
    <div class="controls">
      <button on:click={scrambleCube}>Scramble</button>
      <button on:click={resetCube}>Reset</button>
    </div>
  {/if}
  
  {#if activeView === '3d'}
    <RubiksCube3D 
      bind:cube={cube} 
      on:scramble={scrambleCube} 
      on:reset={resetCube} 
    />
  {:else}
    <RubiksCube 
      bind:cube={cube} 
      on:scramble={scrambleCube} 
      on:reset={resetCube} 
      hideButtons={true} 
    />
  {/if}
</main>

<style>
  :global(:root) {
    --color-white: #800f80;
    --color-yellow: #FFFF00;
    --color-red: #FF0000;
    --color-orange: #FF8000;
    --color-blue: #2c2c2c;
    --color-green: #00FF00;
    --color-black: #333333;
    --color-border: #222222;
    --cube-size: 200px;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }
  
  :global(*) {
    box-sizing: border-box;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
  }

  h1 {
    color: #444;
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    text-align: center;
  }
  
  .view-toggle {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .view-toggle button {
    cursor: pointer;
    border: none;
    background: #e0e0e0;
    color: #444;
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    font-weight: bold;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .view-toggle button.active {
    background: var(--color-black);
    color: white;
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
  }
  
  .view-toggle button:hover:not(.active) {
    background: #d0d0d0;
  }
  
  .controls {
    display: flex;
    gap: 1rem;
  }
  
  .controls button {
    cursor: pointer;
    border: none;
    background: var(--color-black);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  
  .controls button:hover {
    background-color: #555;
  }
  
  .controls button:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    
    .view-toggle button {
      padding: 0.4rem 1.2rem;
      font-size: 0.9rem;
    }
  }
</style> 