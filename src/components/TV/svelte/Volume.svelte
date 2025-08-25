<script>
  import { volume } from '../../../modules/tv.js'

  let hidden = $state(true)
  let timer = null

  const scaledVolume = $derived(Math.floor(15 * $volume))

  function show() {
    hidden = false
    clearTimeout(timer)
    timer = setTimeout(() => {
      hidden = true
    }, 2000)
  }

  let firstRun = true
  $effect(() => {
    void $volume
    if (!firstRun) show()
    firstRun = false
  })
</script>

{#if !hidden}
  <div class="volume glitchy-text">
    VOLUME
    <div class="track">
      {#each { length: 15 } as _, i}
        <div class="step">{i < scaledVolume ? '|' : '-'}</div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .volume {
    position: absolute;
    z-index: calc(var(--layer-tv-effects) + 1);
    left: var(--gui-side);
    bottom: var(--gui-bottom);
    font-size: var(--font-size-secondary);
    filter: blur(1px);
  }

  .track {
    display: flex;
  }
</style>
