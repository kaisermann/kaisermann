<script>
  import { onMount } from 'svelte';

  import Volume from './Volume.svelte';
  import Webcam from './Webcam.svelte';
  import Video from './Video.svelte';
  import { sendEvent } from '../modules/analytics.js';
  import { noise } from '../modules/noise.js';
  import { isValidHotkey } from '../modules/keyboard.js';
  import { raf, timeout, body } from '../modules/utils.js';
  import {
    screenEl,
    currentChannel,
    currentChannelInfo,
    decrementChannel,
    incrementChannel,
    gotoChannel,
    contentVisible,
    toggleContent,
    toggleSpace,
  } from '../tv';

  const MIN_CHANNEL_LOADING_TIME = 400;

  let mounted = false;
  let noiseInstance = null;
  let isAnimatingLoading = false;

  let channelLoadTimestamp;

  function handleKeyup(e) {
    if (!isValidHotkey(e)) return;
    if (e.key === 'r') return toggleSpace();
    if (e.key === '=') return incrementChannel();
    if (e.key === '-') return decrementChannel();
    if (e.key === 'h') return toggleContent();

    let channelNumber = Number(e.key);

    // ignore non-number keys
    if (Number.isNaN(channelNumber)) {
      return;
    }

    // toggle between a X channel and channel 0
    if (channelNumber === $currentChannel) {
      gotoChannel(0);
    } else {
      gotoChannel(channelNumber);
    }
  }

  function beginLoadingAnimation() {
    endLoadingAnimation();
    noiseInstance = noise();
    body.setAttribute('animation-screen', 'loading-channel');
    channelLoadTimestamp = Date.now();
    isAnimatingLoading = true;
  }

  function removeScreenAnimationOnceDone(duration = 1500) {
    let timer;

    function removeAnimation() {
      clearTimeout(timer);
      timer = null;
      body.removeAttribute('animation-screen');
      screenEl.removeEventListener('animationend', removeAnimation);
    }

    screenEl.addEventListener('animationend', removeAnimation, { once: true });
    timer = timeout(removeAnimation, duration);
  }

  function endLoadingAnimation() {
    if (noiseInstance) {
      noiseInstance.stop();
      noiseInstance = null;
    }
    body.removeAttribute('animation-screen');
    isAnimatingLoading = false;
  }

  function handleChannelReady() {
    raf(() => {
      const diff = Date.now() - channelLoadTimestamp;

      if (diff <= MIN_CHANNEL_LOADING_TIME) {
        timeout(endLoadingAnimation, MIN_CHANNEL_LOADING_TIME - diff);
      } else {
        endLoadingAnimation();
      }
    });
  }

  function handleChannelChange(channelInfo) {
    // prevent firing before mounting
    if (!mounted) {
      return;
    }

    raf(() => {
      beginLoadingAnimation();
      // can't wait for something that's not a video/webcam
      if (channelInfo.type == 'unknown') {
        handleChannelReady();
      }
    });

    sendEvent({
      type: 'channel_switch',
      label: `Switched to channel ${channelInfo.displayName}`,
      category: 'easter_egg',
    });
  }

  $: handleChannelChange($currentChannelInfo);

  $: body.setAttribute('channel', `${$currentChannel}`);

  $: body.classList.toggle('hide-content', !$contentVisible);

  onMount(() => {
    mounted = true;

    // remove hard-coded animation-screen (base.njk)
    removeScreenAnimationOnceDone();
  });
</script>

<style lang="postcss">
  .tv-videos {
    z-index: var(--layer-channels);
    overflow: hidden;
    pointer-events: none;

    & :global .tv-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;

      &[channel='2'],
      &[channel='8'] {
        object-position: center top;
      }
    }
  }

  :global body[animation-screen='loading-channel'] {
    & .tv-screen {
      filter: brightness(5) saturate(0.2) contrast(1.1);
    }

    & .tv-effect--colors {
      opacity: 0.4;
    }

    & .tv-effect--static {
      opacity: 0.7;
    }
  }

  :global body[space] .stars {
    animation: moving-stars 117s linear infinite;
    background-image: url(/assets/images/stars.webp);
  }

  :global body[space='floating'] .spaceship {
    animation: float 6s ease-in-out infinite;
  }

  :global .tv {
    --spaceIntro: 0.8s;
    --spaceOutroDelay: 0.2s;
    transform-origin: center 10%;
    transition: box-shadow 0.6s ease-out;

    @nest :global body[space] & {
      --scale: 0.6;
      --startTransform: scale(1) translateY(0);
      --endTransform: scale(var(--scale)) translateY(80px);
      animation-duration: var(--spaceIntro);
      animation-timing-function: cubic-bezier(0.72, 0.27, 0, 1);
      animation-fill-mode: both;

      @media (max-width: 900px) {
        --scale: 0.9;
        transition: height var(--spaceIntro) ease;
        will-change: height, transform;
      }
    }

    @nest :global body:matches([space='floating'], [space='exiting']) & {
      box-shadow: 0px 0px 50px 1px rgba(255, 255, 255, 0.2);
    }

    @nest :global body:matches([space='entering'], [space='floating']) & {
      animation-name: go-to-space;

      @media (max-width: 900px) {
        height: calc(90vw / 16 * 10);
      }
    }

    @nest :global body[space='exiting'] & {
      transform: var(--endTransform);
      animation-name: exit-space;
      animation-delay: var(--spaceOutroDelay);

      @media (max-width: 900px) {
        transition-delay: var(--spaceOutroDelay);
      }
    }
  }

  :global body[animation-screen='turn-on'] .tv-effect--vignette {
    background: radial-gradient(circle, black 30%, transparent 90%), transparent;
  }

  @keyframes -global-float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes -global-go-to-space {
    from {
      transform: var(--initTransform);
    }

    to {
      transform: var(--endTransform);
    }
  }

  @keyframes -global-exit-space {
    from {
      transform: var(--endTransform);
    }

    to {
      transform: var(--initTransform);
    }
  }

  @keyframes -global-moving-stars {
    0% {
      transform: translate(0, 0);
    }

    100% {
      transform: translate(-50%, -50%);
    }
  }

  @keyframes -global-blink {
    50% {
      opacity: 0;
    }
  }
</style>

<div class="tv-videos">
  {#if $currentChannelInfo.type === 'webcam'}
    <Webcam on:ready={handleChannelReady} />
  {:else if $currentChannelInfo.type === 'video'}
    <Video on:ready={handleChannelReady} hidden={isAnimatingLoading} />
  {/if}
</div>

<Volume />

<svelte:window on:keyup={handleKeyup} />
