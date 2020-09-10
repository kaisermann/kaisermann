<script>
  import { onMount } from 'svelte';

  import Volume from './Volume.svelte';
  import Webcam from './Webcam.svelte';
  import Video from './Video.svelte';
  import { sendEvent } from '../modules/analytics.js';
  import { startNoise, stopNoise } from '../modules/noise.js';
  import { raf, timeout, body } from '../modules/utils.js';
  import {
    currentChannel,
    currentChannelInfo,
    contentVisible,
    loadingChannel,
    loadingPage,
    LOADING_STATE,
  } from '../tv';

  const MIN_CHANNEL_LOADING_TIME = 400;

  let mounted = false;

  let channelLoadTimestamp;

  function startLoadingChannelAnimation() {
    stopLoadingChannelAnimation();

    body.classList.add('loading-channel');
    channelLoadTimestamp = Date.now();
  }

  function stopLoadingChannelAnimation() {
    body.classList.remove('loading-channel');
  }

  function handleChannelReady() {
    raf(() => {
      const diff = Date.now() - channelLoadTimestamp;

      if (diff <= MIN_CHANNEL_LOADING_TIME) {
        timeout(() => {
          $loadingChannel = LOADING_STATE.Done;
        }, MIN_CHANNEL_LOADING_TIME - diff);
      } else {
        $loadingChannel = LOADING_STATE.Done;
      }
    });
  }

  function handleChannelChange(channelInfo) {
    // prevent firing before mounting
    if (!mounted) return;

    raf(() => {
      $loadingChannel = LOADING_STATE.Loading;

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

  $: $loadingChannel === LOADING_STATE.Loading
    ? startLoadingChannelAnimation()
    : stopLoadingChannelAnimation();

  $: handleChannelChange($currentChannelInfo);

  $: body.setAttribute('channel', `${$currentChannel}`);

  $: body.classList.toggle('hide-content', !$contentVisible);
  $: {
    const isLoadingPage = $loadingPage === LOADING_STATE.Loading;
    body.classList.toggle('loading-page', isLoadingPage);
  }

  $: {
    if (
      $loadingPage === LOADING_STATE.Loading ||
      $loadingChannel === LOADING_STATE.Loading
    ) {
      startNoise();
    } else {
      stopNoise();
    }
  }

  onMount(() => {
    mounted = true;
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
