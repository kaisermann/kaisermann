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

  @media (hover: none) {
    .perspective {
      display: none;
    }
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
    position: relative;
    font-family: Arial, sans-serif;
    font-size: 13px;
    text-shadow: none;
    padding: 50px 8px 80px;
    background-color: #2d3436;
    background-image: linear-gradient(315deg, #2d3436 0%, #d3d3d3 70%);

    &,
    &::before {
      width: 320px;
      height: 800px;
      /* border-radius: 238px 238px 98px 98px / 58px 58px 188px 188px; */
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

  .inner {
    margin: 30px 8px 50px;
    background-color: #ddd;
    border-radius: 10px;
    border: 20px solid #000;
    padding: 2.5em 15px 1em;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 45px 16px;
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
    }

    & button {
      cursor: url(../images/cursor-pointer.png) 0 0, auto;
      width: 35px;
      height: 25px;
      background-color: #807a72;
      border: none;
    }

    &:not(.number) button {
      font-size: 0;
      text-indent: -999px;
      color: transparent;
    }
  }

  .numbers {
    margin: -23px 0 23px;
    grid-column: 1 / -1;
    display: grid;
    grid-template: inherit;
    gap: inherit;
    border: 3px solid #000;
    border-radius: 10px;
    padding: 22px 0;
  }

  .number button {
    background-color: #000;
    color: #fff;
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
            <button on:click={toggleOnOff}>ON / OFF</button>
            <span>ON / OFF</span>
          </div>
          <div class="control showhide">
            <button class="showhide" on:click={toggleContent}>
              SHOW / HIDE
            </button>
            <span>SHOW / HIDE</span>
          </div>

          <div class="control vol up">
            <button on:click={increaseVolume}>VOL+</button>
            <span>VOL+</span>
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
            <span>CH-</span>
          </div>

          <div class="control ch down">
            <button on:click={decreaseChannel}>CH -</button>
            <span>CH</span>
          </div>

          <div class="numbers">
            {#each { length: 9 } as _, i}
              <div class="control number">
                <button on:click={decreaseChannel}>{i + 1}</button>
              </div>
            {/each}
            <div class="control number">
              <button on:click={decreaseChannel}>0</button>
            </div>
          </div>
        </div>

        <div class="brand">
          <img
            src="/assets/images/kiwi.svg"
            alt="kiwi bird"
            width="30"
            height="30" />
          <img
            src="/assets/images/kiwivision.svg"
            alt="kiwivision"
            width="103"
            height="10" />
          <br />
          <span>COMPUTER SPACE COMMANDER</span>
        </div>
      </div>
    </div>
  </div>
</div>
