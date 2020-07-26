<script>
  import { onMount } from 'svelte';

  let stream;
  let video;

  onMount(() => {
    window.navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { exact: 320 },
          height: { exact: 240 },
        },
      })
      .then((stream) => {
        video.srcObject = stream;
      });

    return () => {
      video.srcObject.getTracks().forEach((track) => track.stop());
    };
  });
</script>

<video bind:this={video} class="channel__video --camera" autoplay />
