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

  .wrapper {
    transform: rotateX(0) translateY(-8px);
    padding: 50px 0 100px;
    transition: 0.25s 0.3s ease-out;

    &,
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
    --remote-font: Andale Mono, Trebuchet MS, sans-serif;
    position: relative;
    width: 310px;
    height: 760px;
    padding: 80px 12px 110px;
    border-radius: 16px 16px 12px 12px / 8px 8px 24px 24px;
    background-color: #f1f2f6;
    background-image: url(../images/plastic-texture-noise.png),
      linear-gradient(to bottom, #d8d8d8 0%, #a5a5a5 74%);
    box-shadow: inset 0 14px 6px 0px #e0e0e0, inset 0 8px 10px 0px #252424,
      inset 0px -11px 10px 0px #444;
    font-family: var(--remote-font);
    font-size: 13px;
    text-shadow: none;
  }

  .inner {
    margin: 40px 28px 50px;
    padding: 2.5em 15px 1em;
    border-radius: 10px;
    box-shadow: -20px -30px 0 0 #000, 20px 30px 0 0 #000, -20px 30px 0 0 #000,
      20px -30px 0 0 #000, -22px -32px 0px 0 #696464, -22px 32px 0px 0 #696464,
      22px -32px 0px 0 #696464, 22px 32px 0px 0 #696464,
      inset 0px 0 6px 2px #646464, inset 0px 0 0 1px #000;
    background-image: repeating-linear-gradient(
        to bottom,
        hsla(0, 0%, 100%, 0) 0%,
        hsla(0, 0%, 100%, 0) 6%,
        hsla(0, 0%, 100%, 0.08) 6.5%,
        hsla(0, 0%, 100%, 0) 7%
      ),
      repeating-linear-gradient(
        to bottom,
        hsla(0, 0%, 0%, 0) 0%,
        hsla(0, 0%, 0%, 0) 4%,
        hsla(0, 0%, 0%, 0.03) 4.5%,
        hsla(0, 0%, 0%, 0) 5%
      ),
      repeating-linear-gradient(
        to bottom,
        hsla(0, 0%, 100%, 0) 0%,
        hsla(0, 0%, 100%, 0) 1.2%,
        hsla(0, 0%, 100%, 0.15) 2.2%,
        hsla(0, 0%, 100%, 0) 3%
      ),
      linear-gradient(
        to bottom right,
        hsl(0, 0%, 78%) 0%,
        hsl(0, 0%, 90%) 47%,
        hsl(0, 0%, 78%) 53%,
        hsl(0, 0%, 90%) 100%
      );
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(3, 32px);
    justify-content: space-around;
    row-gap: 36px;
  }

  .numbers {
    margin: -23px -25px 16px;
    padding: 22px;
    display: grid;
    grid-column: 1 / -1;
    grid-template: inherit;
    gap: inherit;
    justify-content: space-between;
    border: 3px solid #000;
    border-radius: 10px;
  }

  .control {
    position: relative;
    text-align: center;

    & span {
      position: absolute;
      bottom: 100%;
      left: 50%;
      width: max-content;
      transform: translateX(-50%);
      color: #000;
      margin-bottom: 0.4em;
    }
  }

  .hide-text {
    font-size: 0;
    text-indent: -999px;
    color: transparent;
  }

  button {
    cursor: url(../images/cursor-pointer.png) 14 8, auto;
    width: 100%;
    height: 25px;
    border: 0px solid #222;
    border-radius: 3px;
    box-shadow: 1px 3px 0 0 #222, -1px 3px 0 0 #222;
    font-size: 1.4em;
    font-family: var(--remote-font);
    color: #fff;
    background-color: #000000;
    background-image: url(../images/plastic-texture-noise.png),
      linear-gradient(315deg, #000000 0%, #414141 74%);
    background-size: contain, auto;

    &:focus {
      outline: none;
    }

    &:active {
      border-width: 1px;
      transform: translateY(2px);
      box-shadow: 1px 1px 0 0 #222, -1px 1px 0 0 #222;
    }
  }

  .onoff {
    grid-area: 1/2;

    & button {
      background-image: url(../images/plastic-texture-noise.png),
        linear-gradient(315deg, #631111 0%, #dc2525 74%);
    }
  }

  .vol.up {
    grid-area: 1/1;
  }
  .vol.down {
    grid-area: 2/1;
  }
  .mute {
    grid-area: 2/2;
  }
  .ch.up {
    grid-area: 1/3;
  }
  .ch.down {
    grid-area: 2/3;
  }
  .showhide {
    grid-area: 4/2/4/4;

    & button {
      font-size: 1em;
      font-weight: bold;
      width: 100%;
      background-image: url(../images/plastic-texture-noise.png),
        linear-gradient(315deg, #a71111 0%, #c32b2b 34%);
      color: #fbcfcf;
    }
  }

  .brand {
    font-weight: bold;
    grid-area: -1/1/-1 / -1;
    text-align: center;
    color: #000;
  }

  img {
    display: inline-block;
  }
</style>

<div class="perspective">
  <div class="wrapper">
    <div class="remote">
      <div class="inner">
        <div class="buttons">
          <div class="control onoff">
            <button class="hide-text" on:click={toggleOnOff}>ON/OFF</button>
            <span>OFF/ON</span>
          </div>

          <div class="control vol up">
            <button on:click={increaseVolume}>▲</button>
          </div>

          <div class="control vol down">
            <button on:click={decreaseVolume}>▼</button>
            <span>VOLUME</span>
          </div>

          <div class="control mute">
            <button class="hide-text" on:click={toggleMute}>MUTE</button>
            <span>MUTE</span>
          </div>

          <div class="control ch up">
            <button on:click={increaseChannel}>▲</button>
          </div>

          <div class="control ch down">
            <button on:click={decreaseChannel}>▼</button>
            <span>CHANNEL</span>
          </div>

          <div class="numbers">
            {#each { length: 9 } as _, i}
              <div class="control number">
                <button on:click={() => gotoChannel(i + 1)}>{i + 1}</button>
              </div>
            {/each}
            <div class="control number">
              <button on:click={() => gotoChannel(0)}>0</button>
            </div>
            <div class="control showhide">
              <button class="showhide" on:click={toggleContent}>
                SHOW / HIDE
              </button>
            </div>
          </div>
        </div>

        <div class="brand">
          <!-- <img
            src="/assets/images/kiwi.svg"
            alt="kiwi bird"
            width="30"
            height="30" /> -->
          <img
            src="/assets/images/kiwivision.svg"
            alt="kiwivision"
            width="103"
            height="10" />
          <br />
          <span>COMPUTER SPACE COMMAND</span>
        </div>
      </div>
    </div>
  </div>
</div>
