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

<div class="remote" js-remote>
  <button on:click={() => toggleOnOff()}>ON/OFF</button>
  <button on:click={() => increaseVolume(0.5)}>VOL+</button>
  <button on:click={() => decreaseVolume(0.5)}>VOL-</button>
  <button on:click={toggleMute}>MUTE-</button>
  <button on:click={increaseChannel}>CH +</button>
  <button on:click={decreaseChannel}>CH -</button>
</div>
