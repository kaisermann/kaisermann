<script>
  import { volume, currentChannelInfo, updateChannelInfo } from '../tv';

  let video;

  $: changeChannel($currentChannelInfo, video);

  async function changeChannel() {
    const { duration, watchTimestamp } = $currentChannelInfo;

    if (!video) return;

    video.load();

    if (watchTimestamp != null) {
      const now = Date.now() / 1000;
      let currentTime = now - watchTimestamp;

      if (currentTime < duration) {
        video.currentTime = currentTime;
      } else {
        video.currentTime = 0;
        updateChannelInfo($currentChannelInfo.number, {
          watchTimestamp: now,
        });
      }
    }

    const playPromise = video.play().catch(() => {});

    if (watchTimestamp == null) {
      await playPromise;

      // check for video element again because it could have died
      if (!video) return;

      updateChannelInfo($currentChannelInfo.number, {
        duration: video.duration,
        watchTimestamp: Date.now() / 1000,
      });
    }
  }
</script>

<video
  bind:this={video}
  bind:volume={$volume}
  class="tv-video"
  channel={$currentChannelInfo.number}
  playsinline
  loop>
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.webm"
    type="video/webm" />
  <source
    src="/assets/videos/channel-{$currentChannelInfo.displayName}.mp4"
    type="video/mp4" />
</video>
