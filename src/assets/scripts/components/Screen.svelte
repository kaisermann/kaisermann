<script>
  import { onMount } from 'svelte';

  import Volume from './Volume.svelte';
  import Webcam from './Webcam.svelte';
  import Video from './Video.svelte';
  import { sendEvent } from '../modules/analytics.js';
  import { noise } from '../modules/noise.js';
  import { isValidHotkey } from '../modules/keyboard.js';
  import {
    currentChannel,
    currentChannelInfo,
    decreaseChannel,
    increaseChannel,
    gotoChannel,
    contentVisible,
    toggleContent,
    toggleSpace,
    animateScreen,
  } from '../tv';

  let mounted = false;

  const channelBtn = document.querySelector('.js-channel-btn');
  const channelNumber = channelBtn.querySelector('.js-channel-number');

  function handleKeyup(e) {
    if (!isValidHotkey(e)) return;
    if (e.key === 'r') return toggleSpace();
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

  function updateChannel(channelInfo) {
    // prevent firing before mounting
    if (!mounted) {
      return;
    }

    channelNumber.textContent = channelInfo.displayName;
    requestAnimationFrame(noise);

    const animation = document.body.getAttribute('screen-animation');

    if (!animation) {
      animateScreen('switch-channel');
    }

    sendEvent({
      type: 'channel_switch',
      label: `Switched to channel ${channelInfo.displayName}`,
      category: 'easter_egg',
    });
  }

  $: updateChannel($currentChannelInfo);

  $: document.body.setAttribute('channel', `${$currentChannel}`);

  $: document.body.classList.toggle('hide-content', !$contentVisible);

  onMount(() => {
    mounted = true;

    animateScreen('turn-on');

    channelBtn.addEventListener('click', increaseChannel);
  });
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
