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
    /* Dark Theme Color Palette */
    --color-bg-primary: #1a1a1a;
    --color-bg-secondary: #2a2a2a;
    --color-bg-tertiary: #333333;
    --color-text-primary: #f0f0f0;
    --color-text-secondary: #bbbbbb;
    --color-accent: #ff3a3a;
    --color-accent-glow: rgba(255, 58, 58, 0.4);
    --color-highlight: #ff5252;
    
    /* Cube Colors */
    --color-white: #f0f0f0;
    --color-yellow: #ffeb3b;
    --color-red: #ff3a3a;
    --color-orange: #ff9800;
    --color-blue: #2196f3;
    --color-green: #4caf50;
    --color-black: #181818;
    --color-border: #444444;
    --cube-size: 200px;
    
    /* Glow Effects */
    --glow-sm: 0 0 5px var(--color-accent-glow);
    --glow-md: 0 0 10px var(--color-accent-glow);
    --glow-lg: 0 0 20px var(--color-accent-glow);
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    transition: background-color 0.3s, color 0.3s;
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
    color: var(--color-text-primary);
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    text-align: center;
    text-shadow: var(--glow-sm);
    letter-spacing: 1px;
  }
  
  .view-toggle {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .view-toggle button {
    cursor: pointer;
    border: none;
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    font-weight: bold;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .view-toggle button.active {
    background: var(--color-accent);
    color: var(--color-text-primary);
    box-shadow: 0 0 15px var(--color-accent-glow);
  }
  
  .view-toggle button:hover:not(.active) {
    background: var(--color-bg-secondary);
    box-shadow: 0 0 10px rgba(255, 58, 58, 0.2);
  }
  
  .controls {
    display: flex;
    gap: 1rem;
  }
  
  .controls button {
    cursor: pointer;
    border: none;
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: bold;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }
  
  .controls button:hover {
    background-color: var(--color-accent);
    box-shadow: var(--glow-sm);
    transform: translateY(-2px);
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