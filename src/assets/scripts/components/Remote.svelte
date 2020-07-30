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
    toggleContent,
  } from '../tv';
</script>

<style lang="postcss">
  .perspective {
    perspective: 2300px;
    position: fixed;
    z-index: var(--layer-top);
    top: calc(100% - 50px);
    right: var(--gui-side);
  }

  :global([tv-animation='turn-on']) .wrapper {
    display: none;
  }

  .wrapper {
    transform: rotateX(0) translateY(-10px);
    padding: 50px 0 100px;
    transition: 0.25s 0.3s ease-out;

    &:hover {
      transform: rotateX(20deg) translateY(-100%);
      transform-origin: 50% bottom;
      transition: 0.25s ease-out;
    }
  }

  .remote {
    position: relative;
    display: grid;
    grid-template: repeat(6, 1fr) / repeat(4, 1fr);
    gap: 45px 16px;
    padding: 54px 34px;
    background-color: #000000;
    background-image: linear-gradient(0deg, #000000 0%, #141313 74%);
    font-family: Arial, sans-serif;
    font-size: 13px;
    text-shadow: none;
    border: 1px solid #212121;

    &,
    &::before {
      width: 320px;
      height: 600px;
      border-radius: 238px 238px 98px 98px / 58px 58px 188px 188px;
    }

    &::before {
      position: absolute;
      z-index: -1;
      content: '';
      background: #212121;
      top: 10px;
      left: 0;
      transform: scaleX(0.9);
    }
  }

  .control {
    position: relative;
  }

  .control,
  button {
    cursor: url(../images/cursor-pointer.png) 0 0, auto;
  }

  button {
    width: 50px;
    height: 50px;
    color: #fff;
    border: none;
    border-radius: 50%;
    background-color: #2d3436;
    background-image: linear-gradient(315deg, #000000 0%, #1c2024 74%);
    border: 2px solid #222;
    text-indenxt: -9999px;
    color: transparent;
    user-select: none;
    overflow: hidden;

    &:focus {
      outline: none;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  span {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    padding-top: 1em;
  }

  .onoff {
    grid-area: 1/1;

    & button {
      background-color: #a90000;
      background-image: linear-gradient(315deg, #190303 0%, #a90000 90%);
    }
  }

  .showhide {
    grid-area: 1/-2;

    & button {
      background-color: #068a89;
      background-image: linear-gradient(315deg, #011010 0%, #068a89 90%);
    }
  }

  .volup {
    grid-area: 3/1;
  }
  .voldown {
    grid-area: 4/1;
  }

  .mute {
    grid-area: 4/2;
  }

  .chup {
    grid-area: 3/4;
  }
  .chdown {
    grid-area: 4/4;
  }

  .brand {
    font-weight: bold;
    grid-area: 6/2/6 / span 2;
    text-align: center;
    font-size: 1.2em;
  }
</style>

<div class="perspective">
  <div class="wrapper">
    <div class="remote">
      <div class="control onoff">
        <button on:click={toggleOnOff}>ON / OFF</button>
        <span>ON / OFF</span>
      </div>
      <div class="control showhide">
        <button class="showhide" on:click={toggleContent}>SHOW / HIDE</button>
        <span>SHOW / HIDE</span>
      </div>

      <div class="control volup">
        <button on:click={increaseVolume}>VOL+</button>
        <span>VOL+</span>
      </div>

      <div class="control voldown">
        <button on:click={decreaseVolume}>VOL-</button>
        <span>VOL-</span>
      </div>

      <div class="control mute">
        <button on:click={toggleMute}>MUTE</button>
        <span>MUTE</span>
      </div>

      <div class="control chup">
        <button on:click={increaseChannel}>CH +</button>
        <span>CH +</span>
      </div>

      <div class="control chdown">
        <button on:click={decreaseChannel}>CH -</button>
        <span>CH -</span>
      </div>

      <div class="brand">T V</div>
    </div>
  </div>
</div>
