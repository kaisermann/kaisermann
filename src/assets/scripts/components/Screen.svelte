<script>
  import { onMount } from 'svelte';

  import Volume from './Volume.svelte';
  import Webcam from './Webcam.svelte';
  import Video from './Video.svelte';
  import { sendEvent } from '../modules/analytics.js';
  import { noise } from '../modules/noise.js';
  import { isValidHotkey } from '../modules/keyboard.js';
  import { raf, timeout, body } from '../modules/utils.js';
  import {
    screenEl,
    currentChannel,
    currentChannelInfo,
    decrementChannel,
    incrementChannel,
    gotoChannel,
    contentVisible,
    toggleContent,
    toggleSpace,
  } from '../tv';

  const MIN_CHANNEL_LOADING_TIME = 400;

  let mounted = false;
  let noiseInstance = null;
  let isAnimatingLoading = false;

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
    endLoadingAnimation();
    noiseInstance = noise();
    body.setAttribute('animation-screen', 'loading-channel');
    channelLoadTimestamp = Date.now();
    isAnimatingLoading = true;
  }

  function removeScreenAnimationOnceDone(duration = 1500) {
    let timer;

    function removeAnimation() {
      clearTimeout(timer);
      timer = null;
      body.removeAttribute('animation-screen');
      screenEl.removeEventListener('animationend', removeAnimation);
    }

    screenEl.addEventListener('animationend', removeAnimation, { once: true });
    timer = timeout(removeAnimation, duration);
  }

  function endLoadingAnimation() {
    if (noiseInstance) {
      noiseInstance.stop();
      noiseInstance = null;
    }
    body.removeAttribute('animation-screen');
    isAnimatingLoading = false;
  }

  function handleChannelReady() {
    raf(() => {
      const diff = Date.now() - channelLoadTimestamp;

      if (diff <= MIN_CHANNEL_LOADING_TIME) {
        timeout(endLoadingAnimation, MIN_CHANNEL_LOADING_TIME - diff);
      } else {
        endLoadingAnimation();
      }
    });
  }

  function handleChannelChange(channelInfo) {
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

  $: handleChannelChange($currentChannelInfo);

  $: body.setAttribute('channel', `${$currentChannel}`);

  $: body.classList.toggle('hide-content', !$contentVisible);

  onMount(() => {
    mounted = true;

    // remove hard-coded animation-screen (base.njk)
    removeScreenAnimationOnceDone();

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
    <Video on:ready={handleChannelReady} hidden={isAnimatingLoading} />
  {/if}
</div>

<Volume />

<svelte:window on:keyup={handleKeyup} />
