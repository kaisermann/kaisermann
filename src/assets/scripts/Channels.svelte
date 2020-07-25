<script context="module">
  export const AVAILABLE_CHANNELS = new Set([1, 2]);
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  import Channel from './Channel.svelte';

  let currentChannel;
  let pageWrapper = document.querySelector('.js-page-wrapper');
  let channelNumberEl = document.querySelector('.js-channel');

  $: doesChannelExist = AVAILABLE_CHANNELS.has(currentChannel);
  $: channelNumberEl.textContent = currentChannel
    ? currentChannel.toString().padStart(2, '0')
    : '00';

  $: {
    if (currentChannel != null) {
      pageWrapper.setAttribute('animation', 'switch-channel');
      pageWrapper.addEventListener(
        'animationend',
        (e) => pageWrapper.removeAttribute('animation'),
        { once: true },
      );
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
      currentChannel = channel === currentChannel ? 0 : channel;
    }
  }
</script>

<Channel number={doesChannelExist ? currentChannel : undefined} />

<svelte:window on:keyup={handleKeyup} />
