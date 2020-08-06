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

  const animationContainer = document.querySelector('.js-tv');
  const channelBtn = animationContainer.querySelector('.js-channel-btn');
  const channelNumber = channelBtn.querySelector('.js-channel-number');

  function animateContainer(animation = null) {
    if (animation) {
      animationContainer.setAttribute('tv-animation', 'switch-channel');
    }

    // remove the attribute after the animation ends
    animationContainer.addEventListener(
      'animationend',
      (e) => animationContainer.removeAttribute('tv-animation'),
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

    const animation = animationContainer.getAttribute('tv-animation');

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
    if (e.key === '=') {
      return increaseChannel();
    }

    if (e.key === '-') {
      return decreaseChannel();
    }

    if (e.key === 'h') {
      return toggleContent();
    }

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

<Volume />

{#if $currentChannelInfo.type === 'webcam'}
  <Webcam />
{:else if $currentChannelInfo.type === 'video'}
  <Video />
{/if}

<svelte:window on:keyup={handleKeyup} />
