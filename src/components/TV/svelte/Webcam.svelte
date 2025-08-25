<script>
  import { raf } from '../../../modules/utils.js'
  import { loadingChannel, LOADING_STATE } from '../../../modules/tv.js'
  import { onMount } from 'svelte'

  const { onReady = () => {} } = $props()

  let isReady = $state(false)
  let elapsedTime = $state(0)
  let formattedTime = $state('00:00:00.0')
  let video = $state(null)

  let stream
  let startTime
  let counterRequest

  async function initStream() {
    stream = await window.navigator.mediaDevices
      .getUserMedia({
        video: { width: { exact: 256 }, height: { exact: 144 } },
      })
      .catch(() => null)

    if (stream == null || video == null) return

    video.srcObject = stream

    video.addEventListener(
      'playing',
      () => {
        onReady()
        isReady = true
        initCounter()
        document.body.dataset.camera = ''
      },
      { once: true }
    )
  }

  const padNumber = (n) => (n < 10 ? `0${n}` : n)

  function initCounter() {
    counterRequest = raf(function loop(ts) {
      if (startTime == null) startTime = ts
      elapsedTime = ts - startTime
      counterRequest = raf(loop)
    })
  }

  // derived formatted time
  $effect(() => {
    const t = elapsedTime
    const milliseconds = Number.isFinite(t) ? parseInt((t % 1000) / 100) : 0
    const seconds = padNumber(Math.floor((t / 1000) % 60))
    const minutes = padNumber(Math.floor((t / (1000 * 60)) % 60))
    const hours = padNumber(Math.floor((t / (1000 * 60 * 60)) % 24))
    formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`
  })

  // mount / cleanup
  onMount(() => {
    initStream()
    return () => {
      delete document.body.dataset.camera
      cancelAnimationFrame(counterRequest)
      if (stream) stream.getTracks().forEach((track) => track.stop())
    }
  })
</script>

<div
  class:visually-hidden={!isReady || $loadingChannel === LOADING_STATE.Loading}
>
  <video bind:this={video} class="tv-video" autoplay data-channel="camera">
    <track kind="captions" srclang="en" label="Camera" default />
  </video>

  <div class="rec-wrapper big-text glitchy-text">
    <div class="rec">REC <span></span></div>
    <div class="counter">{formattedTime}</div>
  </div>
</div>

<style>
  video {
    transform: scaleX(-1);
  }

  .rec-wrapper {
    position: absolute;
    z-index: calc(var(--layer-tv-effects) + 1);
    bottom: var(--gui-bottom);
    right: var(--gui-side);
    filter: blur(1px);

    :global(body:not([data-camera])) & {
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
      box-shadow:
        3px 0 0 var(--glitchy-blue),
        -3px 0 0 var(--glitchy-red);
      animation: blink 1.4s step-end infinite;
    }
  }
</style>
