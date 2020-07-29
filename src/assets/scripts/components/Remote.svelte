<script>
  import {
    volume,
    decreaseVolume,
    increaseVolume,
    increaseChannel,
    decreaseChannel,
    toggleMute,
    gotoChannel,
    toggleOnOff,
  } from '../tv';
</script>

<style>
  .remote {
    display: grid;
    grid-template: repeat(6, 1fr) / repeat(3, 1fr);
    gap: .25rem;
  }
</style>

<div class="remote" js-remote>
  <button on:click={() => toggleOnOff()}>ON/OFF</button>
  <button on:click={() => increaseVolume()}>VOL+</button>
  <button on:click={() => decreaseVolume()}>VOL-</button>
  <button on:click={toggleMute}>MUTE-</button>
  <button on:click={increaseChannel}>CH +</button>
  <button on:click={decreaseChannel}>CH -</button>
</div>
