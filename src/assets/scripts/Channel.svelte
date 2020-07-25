<script>
  import { onMount } from 'svelte';

  export let number = undefined;

  let video;

  $: paddedNumber = number && number.toString().padStart(2, '0');

  $: video && (video.volume = 0.3);
  $: {
    if (video && number != null) {
      video.load();
      video.play();
    }
  }
</script>

{#if number != null}
  <video bind:this={video} class="channel__video" playsinline loop>
    <source
      src="/assets/videos/channel-{paddedNumber}.webm"
      type="video/webm" />
    <source src="/assets/videos/channel-{paddedNumber}.mp4" type="video/mp4" />
  </video>
{/if}
