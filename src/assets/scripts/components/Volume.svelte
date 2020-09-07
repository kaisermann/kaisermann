<script>
  import { volume } from '../tv.js';
  import { timeout } from '../modules/utils.js';

  let hidden = true;
  let timer = null;
  let firstRender = true;

  $: transformed = Math.floor(15 * $volume);
  $: show($volume);

  function show() {
    if (firstRender) {
      return (firstRender = false);
    }

    hidden = false;
    clearTimeout(timer);
    timer = timeout(() => (hidden = true), 2000);
  }
</script>

<style>
  .volume {
    position: absolute;
    z-index: calc(var(--layer-tv-effects) + 1);
    left: var(--gui-side);
    bottom: var(--gui-bottom);
    font-size: var(--font-size-secondary);
    filter: blur(1px);
  }

  .hidden {
    display: none;
  }

  .track {
    display: flex;
  }
</style>

<div class="volume glitchy-text" class:hidden>
  VOLUME
  <div class="track">
    {#each { length: 15 } as _, i}
      <div class="step">{i <= transformed ? '|' : '-'}</div>
    {/each}
  </div>
</div>
