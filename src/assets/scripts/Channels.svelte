<script context="module">
  export const AVAILABLE_CHANNELS = new Set([1, 2, 3, 4, 5, 6]);

  const audioCtx = new window.AudioContext();
  const bufferSize = audioCtx.sampleRate / 3;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const gainNode = audioCtx.createGain();

  for (
    let i = 0, noiseBufferOutput = noiseBuffer.getChannelData(0);
    i < bufferSize;
    i++
  ) {
    noiseBufferOutput[i] = Math.random() * 2 - 1;
  }

  gainNode.gain.setValueAtTime(0.018, audioCtx.currentTime);
  gainNode.connect(audioCtx.destination);
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Channel from './Channel.svelte';

  let currentChannel = 0;

  let pageWrapper = document.querySelector('.js-page-wrapper');
  let channelBtn = pageWrapper.querySelector('.js-channel-btn');
  let channelNumber = channelBtn.querySelector('.js-channel');

  function noise() {
    const whiteNoise = audioCtx.createBufferSource();

    whiteNoise.buffer = noiseBuffer;
    whiteNoise.connect(gainNode);
    whiteNoise.start(0);
    whiteNoise.onended = (e) => {
      whiteNoise.disconnect(gainNode);
    };
  }

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
  $: formattedChannel = currentChannel.toString().padStart(2, '0');

  $: {
    if (currentChannel != null) {
      channelNumber.textContent = formattedChannel;
      noise();

      if (!pageWrapper.hasAttribute('animation')) {
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
