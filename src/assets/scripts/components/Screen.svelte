<script>
  import { onMount } from 'svelte';

  import Volume from './Volume.svelte';
  import Webcam from './Webcam.svelte';
  import Video from './Video.svelte';
  import { sendEvent } from '../modules/analytics.js';
  import { noise } from '../modules/noise.js';
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

  let channelLoadTimestamp;

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
    noise({ loop: false });
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
    <Webcam on:ready={handleChannelReady} hidden={isAnimatingLoading} />
  {:else if $currentChannelInfo.type === 'video'}
    <Video on:ready={handleChannelReady} hidden={isAnimatingLoading} />
  {/if}
</div>

<Volume />
