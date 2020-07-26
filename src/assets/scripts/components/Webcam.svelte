<script>
  import { onMount } from 'svelte';

  let stream;
  let video;

  async function initStream() {
    stream = await window.navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { exact: 256 },
          height: { exact: 144 },
        },
      })
      .catch(() => null);

    if (stream == null) {
      return;
    }

    video.srcObject = stream;

    video.addEventListener(
      'playing',
      () => {
        document.body.setAttribute('using-camera', '');
      },
      { once: true },
    );
  }

  onMount(() => {
    initStream();

    return () => {
      document.body.removeAttribute('using-camera');
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  });
</script>

<video bind:this={video} class="tv__video" channel="camera" autoplay />
