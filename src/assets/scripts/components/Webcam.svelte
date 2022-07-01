<script>
  import { createEventDispatcher } from 'svelte';

  import { onMount } from 'svelte';
  import { raf, body } from '../modules/utils.js';
  import { loadingChannel, LOADING_STATE } from '../modules/tv.js';

  const dispatch = createEventDispatcher();

  let isReady = false;
  let stream;
  let video;

  let startTime;
  let elapsedTime;
  let formattedTime;
  let counterRequest;

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
        dispatch('ready', true);

        isReady = true;

        initCounter();

        body.setAttribute('camera', '');
      },
      { once: true },
    );
  }

  function padNumber(n) {
    return n < 10 ? `0${n}` : n;
  }

  function initCounter() {
    counterRequest = raf(function loop(ts) {
      if (startTime == null) {
        startTime = ts;
      }

      elapsedTime = ts - startTime;

      counterRequest = raf(loop);
    });
  }

  $: {
    const milliseconds = parseInt((elapsedTime % 1000) / 100);
    const seconds = padNumber(Math.floor((elapsedTime / 1000) % 60));
    const minutes = padNumber(Math.floor((elapsedTime / (1000 * 60)) % 60));
    const hours = padNumber(Math.floor((elapsedTime / (1000 * 60 * 60)) % 24));

    formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  onMount(() => {
    initStream();

    return () => {
      body.removeAttribute('camera');
      cancelAnimationFrame(counterRequest);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  });
</script>

<style lang="postcss">
  video {
    transform: scaleX(-1);
  }

  .rec-wrapper {
    position: absolute;
    z-index: calc(var(--layer-tv-effects) + 1);
    bottom: var(--gui-bottom);
    right: var(--gui-side);
    filter: blur(1px);

    @nest :global(body:not([camera])) & {
      display: none;
    }
  }

  .rec {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & span {
      content: '';
      display: inline-block;
      width: 0.6em;
      height: 0.6em;
      margin-left: 0.5em;
      border-radius: 50%;
      background-color: #f00;
      box-shadow: 3px 0 0 var(--glitchy-blue), -3px 0 0 var(--glitchy-red);
      animation: blink 1.4s step-end infinite;
    }
  }
</style>

<!-- svelte-ignore a11y-media-has-caption -->
<div
  class:visually-hidden={!isReady || $loadingChannel === LOADING_STATE.Loading}>
  <video bind:this={video} class="tv-video" channel="camera" autoplay />

  <div class="rec-wrapper big-text glitchy-text">
    <div class="rec">REC <span /></div>
    <div class="counter">{formattedTime}</div>
  </div>
</div>
