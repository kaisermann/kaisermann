<script>
  import { onMount } from 'svelte';

  let video;

  onMount(() => {
    video.play();
  });
</script>

<video bind:this={video} class="channel__video" autoplay playsinline loop>
  <source src="/assets/videos/channel-01.webm" type="video/webm" />
  <source src="/assets/videos/channel-01.mp4" type="video/mp4" />
</video>
