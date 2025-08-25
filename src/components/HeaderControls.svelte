<script>
  import {
    currentChannelInfo,
    decrementChannel,
    incrementChannel,
  } from '../modules/tv.js'
</script>

<div class="channel-controller">
  <button
    class="previous"
    aria-label="previous channel"
    onclick={decrementChannel}
  >
    ◄
  </button>
  <div class="channel">
    CHANNEL <span>{$currentChannelInfo.displayName}</span>
  </div>
  <button class="next" aria-label="next channel" onclick={incrementChannel}>
    ►
  </button>
</div>

<style>
  .channel-controller {
    display: flex;
    width: 15ch;
    align-items: center;
    justify-content: space-between;
  }

  button {
    position: relative;
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    text-shadow: inherit;
    font-family: inherit;
    font-size: 0.9rem;
    cursor: var(--cursor-pointer);

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
    }
  }
</style>
