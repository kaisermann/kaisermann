<script context="module">
  export const AVAILABLE_CHANNELS = new Set([1, 2, 3, 4, 5]);
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Channel from './Channel.svelte';

  let currentChannel = 0;
  let pageWrapper = document.querySelector('.js-page-wrapper');
  let channelBtn = document.querySelector('.js-channel-btn');
  let channelNumber = channelBtn.querySelector('.js-channel');

  function removeWrapperAnimationOnEnd() {
    pageWrapper.addEventListener(
      'animationend',
      (e) => pageWrapper.removeAttribute('animation'),
      { once: true },
    );
  }

  function cycleChannel() {
    if (currentChannel) {
      if (currentChannel + 1 > 9) {
        currentChannel = 0;
      } else {
        currentChannel++;
      }
    } else {
      currentChannel = 1;
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
  $: channelNumber.textContent = currentChannel
    ? currentChannel.toString().padStart(2, '0')
    : '00';

  $: {
    if (currentChannel != null && !pageWrapper.hasAttribute('animation')) {
      pageWrapper.setAttribute('animation', 'switch-channel');
      removeWrapperAnimationOnEnd();
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
