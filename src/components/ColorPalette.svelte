<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cubeColors } from '../config/cubeColors';
  
  const dispatch = createEventDispatcher();
  
  const colorEntries = Object.entries(cubeColors).filter(([key]) => 
    key !== 'border' && key !== 'black'
  );
  
  let selectedColorName = 'white';
  
  function selectColor(colorName, colorValue) {
    selectedColorName = colorName;
    dispatch('colorSelected', { name: colorName, value: colorValue });
  }
  
  function handleKeyDown(event, colorName, colorValue) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectColor(colorName, colorValue);
    }
  }
</script>

<div class="color-palette">
  <div class="palette-title">Select a color, then click on a cube face to apply:</div>
  <div class="color-swatches">
    {#each colorEntries as [colorName, colorValue]}
      <button 
        class="color-swatch {selectedColorName === colorName ? 'selected' : ''}" 
        style="background-color: {colorValue};"
        title={colorName}
        on:click={() => selectColor(colorName, colorValue)}
        on:keydown={(e) => handleKeyDown(e, colorName, colorValue)}
        aria-label="Select {colorName} color"
        aria-pressed={selectedColorName === colorName ? 'true' : 'false'}
      ></button>
    {/each}
  </div>
</div>

<style>
  .color-palette {
    width: 100%;
    margin-bottom: 20px;
    padding: 20px;
    background: var(--color-bg-secondary);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
  
  .palette-title {
    font-size: 14px;
    margin-bottom: 15px;
    color: var(--color-text-secondary);
    text-align: center;
  }
  
  .color-swatches {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .color-swatch {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid var(--color-border);
    padding: 0;
    appearance: none;
  }
  
  .color-swatch:hover {
    transform: scale(1.1);
    border-color: var(--color-accent);
    box-shadow: 0 0 10px var(--color-accent-glow);
  }
  
  .color-swatch:focus-visible {
    outline: 3px solid var(--color-accent);
    border-color: var(--color-accent);
    transform: scale(1.1);
    box-shadow: 0 0 15px var(--color-accent-glow);
  }
  
  .color-swatch.selected {
    border: 3px solid var(--color-accent);
    transform: scale(1.1);
    box-shadow: 0 0 15px var(--color-accent-glow);
  }
  
  @media (max-width: 768px) {
    .color-swatch {
      width: 36px;
      height: 36px;
    }
  }
  
  @media (max-width: 480px) {
    .color-swatch {
      width: 30px;
      height: 30px;
    }
  }
</style>