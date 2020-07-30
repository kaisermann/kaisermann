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
    user-select: none;
  }

  @media (max-width: 940px) {
    .perspective {
      display: none;
    }
  }

  .wrapper {
    transform: rotateX(0) translateY(-8px);
    padding: 50px 0 100px;
    transition: 0.25s 0.3s ease-out;

    &:hover {
      transform: rotateX(20deg) translateY(-100%);
      transform-origin: 50% bottom;
      transition: 0.25s ease-out;
    }
  }
  :global([tv-animation='turn-on']) .wrapper,
  :global([tv-animation='switch-channel']) .wrapper:not(:hover) {
    display: none;
  }

  .remote {
    position: relative;
    display: grid;
    grid-template: repeat(6, 1fr) / repeat(4, 1fr);
    gap: 45px 16px;
    padding: 84px 34px 54px;
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
    border-radius: 5px;
    color: transparent;
    border: none;
    background-color: #2d3436;
    background-image: linear-gradient(315deg, #2b2a29 0%, #1c1e1f 74%);
    border: 1px solid #000;
    text-indenxt: -9999px;
    color: transparent;
    user-select: none;
    overflow: hidden;
    /* transform-origin: center bottom; */
    box-shadow: -3px 3px #000, 3px 3px #000;

    &:focus {
      outline: none;
    }

    &:active {
      /* transform: rotateX(25deg); */
      border-width: 3px;
    }
  }

  span {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    padding-bottom: 1em;
  }

  .onoff {
    grid-area: 1/1;

    & button {
      background-color: #a90000;
      background-image: linear-gradient(315deg, #190303 0%, #842c2c 90%);
    }
  }

  .showhide {
    grid-area: 1/-2;

    & button {
      background-color: #068a89;
      background-image: linear-gradient(315deg, #001919 0%, #288282 90%);
    }
  }

  :matches(.onoff, .showhide) button {
    border-radius: 50%;
  }

  .vol.up {
    grid-area: 3/1;
  }
  .vol.down {
    grid-area: 4/1;
  }

  .mute {
    grid-area: 4/2;
    display: flex;
    justify-content: center;
    align-items: center;

    & button {
      width: 30px;
      height: 30px;
    }
  }

  .ch.up {
    grid-area: 3/4;
  }

  .ch.down {
    grid-area: 4/4;
  }

  :matches(.vol.up, .ch.up) button {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
  }
  :matches(.vol.down, .ch.down) button {
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }

  .brand {
    font-weight: bold;
    grid-area: 6/2/6 / span 2;
    text-align: center;
  }

  img {
    display: inline-block;
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

      <div class="control vol up">
        <button on:click={increaseVolume}>VOL+</button>
      </div>

      <div class="control vol down">
        <button on:click={decreaseVolume}>VOL-</button>
        <span>VOL</span>
      </div>

      <div class="control mute">
        <button on:click={toggleMute}>MUTE</button>
        <span>MUTE</span>
      </div>

      <div class="control ch up">
        <button on:click={increaseChannel}>CH +</button>
      </div>

      <div class="control ch down">
        <button on:click={decreaseChannel}>CH -</button>
        <span>CH</span>
      </div>

      <div class="brand">
        <img
          src="/assets/images/kiwi.svg"
          alt="kiwi bird"
          width="30"
          height="30" />
        <br />
        <img
          src="/assets/images/kiwivision.svg"
          alt="kiwivision"
          width="103"
          height="10" />
      </div>
    </div>
  </div>
</div>
