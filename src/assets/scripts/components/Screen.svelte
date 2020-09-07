<script>
  import { onMount } from 'svelte';

  import Volume from './Volume.svelte';
  import Webcam from './Webcam.svelte';
  import Video from './Video.svelte';
  import { sendEvent } from '../modules/analytics.js';
  import { noise } from '../modules/noise.js';
  import { isValidHotkey } from '../modules/keyboard.js';
  import { raf, timeout, body } from '../modules/aliases.js';
  import {
    currentChannel,
    currentChannelInfo,
    decrementChannel,
    incrementChannel,
    gotoChannel,
    contentVisible,
    toggleContent,
    toggleSpace,
    animateScreen,
  } from '../tv';

  const MIN_CHANNEL_LOADING_TIME = 400;

  let mounted = false;
  let noiseInstance = null;

  const channelBtn = document.querySelector('.js-channel-btn');
  const channelNumber = channelBtn.querySelector('.js-channel-number');

  let channelLoadTimestamp;

  function handleKeyup(e) {
    if (!isValidHotkey(e)) return;
    if (e.key === 'r') return toggleSpace();
    if (e.key === '=') return incrementChannel();
    if (e.key === '-') return decrementChannel();
    if (e.key === 'h') return toggleContent();

    let channelNumber = Number(e.key);

    // ignore non-number keys
    if (Number.isNaN(channelNumber)) {
      return;
    }

    // toggle between a X channel and channel 0
    if (channelNumber === $currentChannel) {
      gotoChannel(0);
    } else {
      gotoChannel(channelNumber);
    }
  }

  function beginLoadingAnimation() {
    noiseInstance = noise();
    body.setAttribute('animation-screen', 'loading-channel');
    channelLoadTimestamp = Date.now();
  }

  function endScreenAnimation() {
    if (noiseInstance) {
      noiseInstance.stop();
      noiseInstance = null;
    }
    body.removeAttribute('animation-screen');
  }

  function onChannelChange(channelInfo) {
    // prevent firing before mounting
    if (!mounted) {
      return;
    }

    channelNumber.textContent = channelInfo.displayName;

    raf(() => {
      beginLoadingAnimation();
      // can't wait for something that's not a video/webcam
      if (channelInfo.type == 'unknown') {
        handleChannelReady();
      }
    });

    sendEvent({
      type: 'channel_switch',
      label: `Switched to channel ${channelInfo.displayName}`,
      category: 'easter_egg',
    });
  }

  function handleChannelReady() {
    raf(() => {
      const diff = Date.now() - channelLoadTimestamp;

      if (diff <= MIN_CHANNEL_LOADING_TIME) {
        timeout(endScreenAnimation, MIN_CHANNEL_LOADING_TIME - diff);
      } else {
        endScreenAnimation();
      }
    });
  }

  $: onChannelChange($currentChannelInfo);

  $: body.setAttribute('channel', `${$currentChannel}`);

  $: body.classList.toggle('hide-content', !$contentVisible);

  onMount(() => {
    mounted = true;

    animateScreen('turn-on');

    channelBtn.addEventListener('click', incrementChannel);
  });
</script>

<style lang="postcss">
  .tv-videos {
    z-index: var(--layer-channels);
    overflow: hidden;
    pointer-events: none;

    & :global(.tv-video) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;

      &[channel='2'],
      &[channel='8'] {
        object-position: center top;
      }
    }
  }
</style>

<div class="tv-videos">
  {#if $currentChannelInfo.type === 'webcam'}
    <Webcam on:ready={handleChannelReady} />
  {:else if $currentChannelInfo.type === 'video'}
    <Video on:ready={handleChannelReady} />
  {/if}
</div>

<Volume />

<svelte:window on:keyup={handleKeyup} />
