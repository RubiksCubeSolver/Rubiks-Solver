<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function rotate(face: string, direction: string = "") {
    console.log(`Rotate ${face}${direction}`);
  }
</script>

<div class="rotation-controls">
  <div class="rotation-group">
    <h3>Face Rotations</h3>
    <div class="buttons-grid">
      <!-- Right face -->
      <div class="rotation-set">
        <button on:click={() => rotate('R')}>R</button>
        <button on:click={() => rotate('R', "'")}>R'</button>
        <button on:click={() => rotate('R', '2')}>R2</button>
      </div>
      
      <!-- Left face -->
      <div class="rotation-set">
        <button on:click={() => rotate('L')}>L</button>
        <button on:click={() => rotate('L', "'")}>L'</button>
        <button on:click={() => rotate('L', '2')}>L2</button>
      </div>
      
      <!-- Up face -->
      <div class="rotation-set">
        <button on:click={() => rotate('U')}>U</button>
        <button on:click={() => rotate('U', "'")}>U'</button>
        <button on:click={() => rotate('U', '2')}>U2</button>
      </div>
      
      <!-- Down face -->
      <div class="rotation-set">
        <button on:click={() => rotate('D')}>D</button>
        <button on:click={() => rotate('D', "'")}>D'</button>
        <button on:click={() => rotate('D', '2')}>D2</button>
      </div>
      
      <!-- Front face -->
      <div class="rotation-set">
        <button on:click={() => rotate('F')}>F</button>
        <button on:click={() => rotate('F', "'")}>F'</button>
        <button on:click={() => rotate('F', '2')}>F2</button>
      </div>
      
      <!-- Back face -->
      <div class="rotation-set">
        <button on:click={() => rotate('B')}>B</button>
        <button on:click={() => rotate('B', "'")}>B'</button>
        <button on:click={() => rotate('B', '2')}>B2</button>
      </div>
    </div>
  </div>
</div>

<style>
  .rotation-controls {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    background: var(--color-bg-tertiary);
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    color: var(--color-text-primary);
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    text-align: center;
    text-shadow: var(--glow-sm);
  }
  
  .buttons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .rotation-set {
    display: flex;
    gap: 5px;
  }
  
  button {
    flex: 1;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-family: 'monospace', 'Courier New';
    min-width: 40px;
    transition: all 0.2s ease;
  }
  
  button:hover {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 0 15px var(--color-accent-glow);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    .buttons-grid {
      grid-template-columns: 1fr;
    }
    
    .rotation-set {
      justify-content: center;
    }
  }
</style> 