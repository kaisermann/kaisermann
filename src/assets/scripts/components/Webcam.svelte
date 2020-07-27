<script>
  import { onMount } from 'svelte';

  let stream;
  let video;

  let startTime = Date.now();
  let currentTime = startTime;

  async function initStream() {
    stream = await window.navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { exact: 256 },
          height: { exact: 144 },
        },
      })
      .catch(() => null);

    if (stream == null || video == null) {
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

  function padNumber(n) {
    return n < 10 ? `0${n}` : n;
  }

  let formattedTime;

  $: {
    const diff = currentTime - startTime;
    const milliseconds = parseInt((diff % 1000) / 100);
    const seconds = padNumber(Math.floor((diff / 1000) % 60));
    const minutes = padNumber(Math.floor((diff / (1000 * 60)) % 60));
    const hours = padNumber(Math.floor((diff / (1000 * 60 * 60)) % 24));

    formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  onMount(() => {
    initStream();

    let animationRequest = window.requestAnimationFrame(function loop() {
      currentTime = Date.now();
      animationRequest = window.requestAnimationFrame(loop);
    });

    return () => {
      document.body.removeAttribute('using-camera');
      window.cancelAnimationFrame(animationRequest);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  });
</script>

<video bind:this={video} class="tv__video" channel="camera" autoplay />
<div class="rec__counter">{formattedTime}</div>
