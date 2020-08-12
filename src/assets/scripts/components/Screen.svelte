<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Volume from './Volume.svelte';
  import Webcam from './Webcam.svelte';
  import Video from './Video.svelte';
  import { noise } from '../modules/noise.js';
  import {
    currentChannel,
    currentChannelInfo,
    decreaseChannel,
    increaseChannel,
    gotoChannel,
    contentVisible,
    toggleContent,
  } from '../tv';

  const screenEl = document.querySelector('.js-screen');
  const channelBtn = screenEl.querySelector('.js-channel-btn');
  const channelNumber = channelBtn.querySelector('.js-channel-number');

  function animateContainer(animation = null) {
    if (animation) {
      screenEl.setAttribute('tv-animation', 'switch-channel');
    }

    // remove the attribute after the animation ends
    screenEl.addEventListener(
      'animationend',
      (e) => screenEl.removeAttribute('tv-animation'),
      { once: true },
    );
  }

  onMount(() => {
    // removes the initial animation attribute once it's done
    animateContainer();

    channelBtn.addEventListener('click', increaseChannel);
  });

  $: document.body.setAttribute('channel', `${$currentChannel}`);

  $: $contentVisible
    ? document.body.removeAttribute('content-invisible')
    : document.body.setAttribute('content-invisible', '');

  $: {
    channelNumber.textContent = $currentChannelInfo.displayName;
    window.requestAnimationFrame(noise);

    const animation = screenEl.getAttribute('tv-animation');

    if (!animation) {
      animateContainer('switch-channel');
    }

    // todo: test this
    if (window.gtag) {
      window.gtag('event', 'channel_switch', {
        event_label: `Switched to channel ${$currentChannelInfo.displayName}`,
        event_category: 'easter_egg',
      });
    }
  }

  function handleKeyup(e) {
    if (e.key === '=') return increaseChannel();
    if (e.key === '-') return decreaseChannel();
    if (e.key === 'h') return toggleContent();

    let channelNumber = parseInt(e.key, 10);

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
</script>

<style lang="postcss">
  .tv-videos {
    z-index: var(--layer-channels);
    overflow: hidden;
    pointer-events: none;

    & :global(.tv-video) {
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
</style>

<div class="tv-videos">
  {#if $currentChannelInfo.type === 'webcam'}
    <Webcam />
  {:else if $currentChannelInfo.type === 'video'}
    <Video />
  {/if}
</div>

<Volume />

<svelte:window on:keyup={handleKeyup} />
