<script context="module">
  export const AVAILABLE_CHANNELS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
      animationContainer.setAttribute('animation', 'switch-channel');
    }

    // remove the attribute after the animation ends
    animationContainer.addEventListener(
      'animationend',
      (e) => animationContainer.removeAttribute('animation'),
      { once: true },
    );
  }

  function cycleChannel() {
    if (currentChannel + 1 > 9) {
      currentChannel = 0;
    } else {
      currentChannel++;
    }
  }

  onMount(() => {
    // remvoes the initial animation attribute once it's done
    animateContainer();

    channelBtn.addEventListener('click', cycleChannel);
  });

  $: doesChannelExist = AVAILABLE_CHANNELS.has(currentChannel);

  $: {
    if (currentChannel != null) {
      channelNumber.textContent = currentChannel.toString().padStart(2, '0');
      window.requestAnimationFrame(noise);

      const animation = animationContainer.getAttribute('animation');

      if (!animation) {
        animateContainer('switch-channel');
      }
    } else {
      channelNumber.textContent = '00';
    }
  }

  function handleKeyup(e) {
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
