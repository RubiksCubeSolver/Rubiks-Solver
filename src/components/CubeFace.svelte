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
    margin: 0.5rem;
  }
  
  .face-name {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }
  
  .face-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 2px;
    border: 2px solid var(--color-border);
    padding: 2px;
    background-color: var(--color-border);
  }
  
  .cube-square {
    width: 30px;
    height: 30px;
    border: 1px solid var(--color-border);
  }
  
  @media (max-width: 768px) {
    .cube-square {
      width: 25px;
      height: 25px;
    }
  }
</style> 