<script context="module">
  import { now } from 'svelte/internal';

  const timestamps = {};
</script>

<script>
  export let number = undefined;

  let video;

  $: paddedNumber = number != null && number.toString().padStart(2, '0');

  $: video && (video.volume = 0.25);

  $: changeChannel(number, video);

  async function changeChannel(number) {
    if (!video || number == null) return;

    video.load();

    if (number in timestamps) {
      const { duration, ts } = timestamps[number];
      const now = Date.now() / 1000;
      let currentTime = now - ts;

      if (currentTime < duration) {
        video.currentTime = currentTime;
      } else {
        video.currentTime = 0;
        timestamps[number].ts = now;
      }
    }

    await video.play().catch(() => {});

    if (!(number in timestamps)) {
      const { duration } = video;

      timestamps[number] = { duration, ts: Date.now() / 1000 };
    }
  }
</script>

{#if number != null}
  <video bind:this={video} class="tv-video" channel={number} playsinline loop>
    <source
      src="/assets/videos/channel-{paddedNumber}.webm"
      type="video/webm" />
    <source src="/assets/videos/channel-{paddedNumber}.mp4" type="video/mp4" />
  </video>
{/if}
