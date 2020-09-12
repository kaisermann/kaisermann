<script>
  import {
    currentChannelInfo,
    decrementChannel,
    incrementChannel,
  } from '../modules/tv.js';
</script>

<style lang="postcss">
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

<div class="channel-controller">
  <button
    class="previous cursor-pointer"
    aria-label="previous channel"
    on:click={decrementChannel}>◄</button>
  <div class="channel">
    CHANNEL <span>{$currentChannelInfo.displayName}</span>
  </div>
  <button
    class="next cursor-pointer"
    aria-label="next channel"
    on:click={incrementChannel}>►</button>
</div>
