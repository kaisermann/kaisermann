<script context="module">
  const AVAILABLE_CHANNELS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const N_CHANNELS = 10;
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Webcam from './Webcam.svelte';
  import Channel from './Channel.svelte';
  import { noise } from '../modules/noise.js';

  let currentChannel = 0;

  const animationContainer = document.querySelector('.js-tv-animation');
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

    channelBtn.addEventListener('click', () => {
      // only few channels when changing via click
      if (currentChannel + 1 > 9) {
        currentChannel = 0;
      } else {
        currentChannel++;
      }
    });
  });

  $: doesChannelExist = AVAILABLE_CHANNELS.has(currentChannel);

  $: {
    const formattedChannel = currentChannel.toString().padStart(2, '0');
    channelNumber.textContent = formattedChannel;
    window.requestAnimationFrame(noise);

    const animation = animationContainer.getAttribute('tv-animation');

    if (!animation) {
      animateContainer('switch-channel');
    }

    // todo: test this
    if (window.gtag) {
      window.gtag('event', 'channel_switch', {
        event_label: `Switched to channel ${formattedChannel}`,
        event_category: 'easter_egg',
      });
    }
  }

  function handleKeyup(e) {
    if (e.key === '=') {
      if (currentChannel + 1 <= N_CHANNELS) {
        currentChannel++;
      } else {
        currentChannel = 0;
      }
      return;
    }

    if (e.key === '-') {
      if (currentChannel - 1 >= 0) {
        currentChannel--;
      } else {
        currentChannel = N_CHANNELS;
      }
      return;
    }

    let channel = parseInt(e.key, 10);

    // ignore non-number keys
    if (Number.isNaN(channel)) {
      return;
    }

    // toggle between a X channel and channel 0
    if (channel === currentChannel) {
      currentChannel = 0;
    } else {
      currentChannel = channel;
    }
  }
</script>

{#if currentChannel === 9}
  <Webcam />
{:else}
  <Channel number={doesChannelExist ? currentChannel : undefined} />
{/if}

<svelte:window on:keyup={handleKeyup} />
