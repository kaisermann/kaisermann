<script>
  import { createEventDispatcher } from 'svelte';

  import {
    volume,
    updateChannelInfo,
    loadingChannel,
    LOADING_STATE,
    currentChannelInfo,
    currentChannel,
  } from '../modules/tv.js';

  const dispatch = createEventDispatcher();

  let video;
  let isReady = false;
  let duration;

  function loadVideo() {
    if (!video) return;

    isReady = false;
    video.load();
  }

  function updatePlayState() {
    if (!video) return;

    if (isReady && $loadingChannel === LOADING_STATE.Done) {
      return video.play();
    }

    video.pause();
  }

  function updateCurrentTime() {
    const { number, startTimestamp } = $currentChannelInfo;

    const now = Date.now() / 1000;

    if (startTimestamp != null) {
      let diff = now - startTimestamp;
      let currentTime;

      if (diff < duration) {
        currentTime = diff;
      } else {
        currentTime = diff % duration;
        updateChannelInfo(number, { startTimestamp: now - currentTime });
      }

      video.currentTime = currentTime;
    } else {
      updateChannelInfo(number, { startTimestamp: now });
    }
  }

  function handleCanPlay() {
    if (video.readyState < 2) return;

    dispatch('ready', true);
    isReady = true;
  }

  $: loadVideo($currentChannel, video);

  $: updatePlayState(isReady, $loadingChannel);

  $: duration && updateCurrentTime();
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  bind:this={video}
  bind:volume={$volume}
  bind:duration
  class="tv-video"
  class:visually-hidden={!isReady || $loadingChannel === LOADING_STATE.Loading}
  channel={$currentChannelInfo.number}
  playsinline
  loop
  on:canplay={handleCanPlay}>
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.webm"
    type="video/webm" />
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.mp4"
    type="video/mp4" />
</video>
