<script>
  import { createEventDispatcher } from 'svelte';

  import { volume, currentChannelInfo, updateChannelInfo } from '../tv';

  export let hidden = true;

  const dispatch = createEventDispatcher();

  let video;
  let isReady = false;

  async function changeChannel(channelInfo) {
    const { number, duration, watchTimestamp } = channelInfo;

    if (!video) return;

    isReady = false;
    video.load();

    if (watchTimestamp != null) {
      const now = Date.now() / 1000;
      let updatedTime = now - watchTimestamp;

      if (updatedTime < duration) {
        video.currentTime = updatedTime;
      } else {
        video.currentTime = 0;
        updateChannelInfo(number, { watchTimestamp: now });
      }
    }

    if (watchTimestamp == null) {
      updateChannelInfo(number, { watchTimestamp: Date.now() / 1000 });
    }
  }

  function handleMetadata() {
    updateChannelInfo($currentChannelInfo.number, { duration: video.duration });
  }

  function handleLoadedData() {
    if (video.readyState >= 2) {
      dispatch('ready', true);
      isReady = true;
    } else {
      isReady = false;
    }
  }

  function updatePlayState() {
    if (!video) return;

    if (isReady && !hidden) {
      video.play();
      return;
    }

    video.pause();
  }

  $: changeChannel($currentChannelInfo, video);

  $: updatePlayState(isReady, hidden);
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  bind:this={video}
  bind:volume={$volume}
  class="tv-video"
  class:visually-hidden={!isReady || hidden}
  channel={$currentChannelInfo.number}
  playsinline
  loop
  on:loadeddata={handleLoadedData}
  on:loadedmetadata={handleMetadata}>
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.webm"
    type="video/webm" />
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.mp4"
    type="video/mp4" />
</video>
