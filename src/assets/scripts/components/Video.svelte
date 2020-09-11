<script>
  import { createEventDispatcher } from 'svelte';

  import {
    volume,
    currentChannelInfo,
    updateChannelInfo,
    loadingChannel,
    LOADING_STATE,
  } from '../tv';

  const dispatch = createEventDispatcher();

  let video;
  let isReady = false;

  async function changeChannel(channelInfo) {
    const { number, duration, startTimestamp } = channelInfo;

    if (!video) return;

    isReady = false;
    video.load();

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

  function handleMetadata() {
    updateChannelInfo($currentChannelInfo.number, { duration: video.duration });
  }

  function handleCanPlay() {
    if (video.readyState < 2) {
      return;
    }

    dispatch('ready', true);
    isReady = true;
  }

  function updatePlayState() {
    if (!video) return;

    if (isReady && $loadingChannel === LOADING_STATE.Done) {
      video.play();
      return;
    }

    video.pause();
  }

  $: changeChannel($currentChannelInfo, video);

  $: updatePlayState(isReady, $loadingChannel);
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  bind:this={video}
  bind:volume={$volume}
  class="tv-video"
  class:visually-hidden={!isReady || $loadingChannel === LOADING_STATE.Loading}
  channel={$currentChannelInfo.number}
  playsinline
  loop
  on:canplay={handleCanPlay}
  on:loadedmetadata={handleMetadata}>
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.webm"
    type="video/webm" />
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.mp4"
    type="video/mp4" />
</video>
