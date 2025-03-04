<script lang="ts">
  export let face: string[];
  export let faceName: string;
</script>

<div class="cube-face">
  <div class="face-name">{faceName}</div>
  <div class="face-grid">
    {#each face as color, index}
      <div class="cube-square" style="background-color: var(--color-{color})"></div>
    {/each}
  </div>
</div>

<style>
  .cube-face {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .face-name {
    text-align: center;
    margin-bottom: 5px;
    font-weight: bold;
    color: var(--color-text-secondary);
  }
  
  .face-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  /* 3 columns */
    grid-template-rows: repeat(3, 1fr);     /* 3 rows */
    gap: 3px;
    background-color: var(--color-bg-tertiary);
    padding: 5px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 120px;
  }
  
  .cube-square {
    aspect-ratio: 1 / 1;
    border: 1px solid var(--color-border);
    border-radius: 3px;
  }
</style> 