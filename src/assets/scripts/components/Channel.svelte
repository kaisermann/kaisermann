<script>
  import { onMount } from 'svelte';

  export let number = undefined;

  let video;

  $: paddedNumber = number != null && number.toString().padStart(2, '0');

  $: video && (video.volume = 0.25);

  $: {
    if (video && number != null) {
      video.load();
      video.play();
    }
  }
</script>

{#if number != null}
  <video bind:this={video} class="tv__video" channel={number} playsinline loop>
    <source
      src="/assets/videos/channel-{paddedNumber}.webm"
      type="video/webm" />
    <source src="/assets/videos/channel-{paddedNumber}.mp4" type="video/mp4" />
  </video>
{/if}
