<script context="module">
  export const AVAILABLE_CHANNELS = new Set([1, 2, 3, 4, 5, 6]);
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Channel from './Channel.svelte';
  import { noise } from '../modules/noise.js';

  let currentChannel = 0;

  let pageWrapper = document.querySelector('.js-page-wrapper');
  let channelBtn = pageWrapper.querySelector('.js-channel-btn');
  let channelNumber = channelBtn.querySelector('.js-channel');

  function removeWrapperAnimationOnEnd() {
    pageWrapper.addEventListener(
      'animationend',
      (e) => pageWrapper.removeAttribute('animation'),
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
    removeWrapperAnimationOnEnd();
    channelBtn.addEventListener('click', cycleChannel);

    return () => {
      channelBtn.removeEventListener('click', cycleChannel);
    };
  });

  $: doesChannelExist = AVAILABLE_CHANNELS.has(currentChannel);
  $: formattedChannel = currentChannel.toString().padStart(2, '0');

  $: {
    if (currentChannel != null) {
      channelNumber.textContent = formattedChannel;

      const animation = pageWrapper.getAttribute('animation');
      // todo: should we listen to chrome complaining about playing noise without user interaction?
      // if (animation !== 'turn-on') {
      window.requestAnimationFrame(noise);
      // }

      if (!animation) {
        pageWrapper.setAttribute('animation', 'switch-channel');
        removeWrapperAnimationOnEnd();
      }
    } else {
      channelNumber.textContent = '00';
    }
  }

  function handleKeyup(e) {
    let channel = parseInt(e.key, 10);

    if (Number.isNaN(channel)) {
      return;
    }

    if (channel === currentChannel) {
      currentChannel = 0;
    } else {
      currentChannel = channel;
    }
  }
</script>

<Channel number={doesChannelExist ? currentChannel : undefined} />

<svelte:window on:keyup={handleKeyup} />
