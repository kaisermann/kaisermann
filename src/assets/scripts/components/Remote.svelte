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

<style lang="postcss">
  .remote {
    display: grid;
    grid-template: repeat(6, 1fr) / repeat(3, 1fr);
    gap: 0.4rem;
    position: absolute;
    bottom: 1rem;
    right: var(--gui-side);
    width: 300px;
    height: 506px;
    border: 2px solid #fff;
    border-radius: 2rem;
    padding: 1.6rem 1rem;
    background: #000;
  }

  .control {
    position: relative;
    &::after {
      content: '';
      display: block;
      padding-top: 100%;
    }
  }

  button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    border: none;
    border-radius: 50%;
    background-color: #000;
    border: 2px solid #222;
    cursor: url(../images/cursor-pointer.png) 0 0, auto;

    &:focus {
      outline: none;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .onoff {
    background: red;
    border: 2px solid #fff;
  }
</style>

<div class="remote" js-remote>
  <div class="control">
    <button class="onoff" on:click={() => toggleOnOff()}>ON/OFF</button>
  </div>

  <div class="control">
    <button on:click={() => increaseVolume()}>VOL+</button>
  </div>

  <div class="control">
    <button on:click={() => decreaseVolume()}>VOL-</button>
  </div>

  <div class="control">
    <button on:click={toggleMute}>MUTE</button>
  </div>

  <div class="control">
    <button on:click={increaseChannel}>CH +</button>
  </div>

  <div class="control">
    <button on:click={decreaseChannel}>CH -</button>
  </div>
</div>
