<script>
  import Volume from './Volume.svelte'
  import Webcam from './Webcam.svelte'
  import Video from './Video.svelte'
  import { startNoise, stopNoise } from '../../../modules/noise.js'
  import { raf } from '../../../modules/utils.js'
  import {
    currentChannel,
    currentChannelInfo,
    contentVisible,
    loadingChannel,
    loadingPage,
    LOADING_STATE,
  } from '../../../modules/tv.js'

  const MIN_CHANNEL_LOADING_TIME = 400

  let channelLoadTimestamp = $state(0)

  function startLoadingChannelAnimation() {
    stopLoadingChannelAnimation()
    document.body.dataset.loadingChannel = ''
    channelLoadTimestamp = Date.now()
  }

  function stopLoadingChannelAnimation() {
    delete document.body.dataset.loadingChannel
  }

  function handleChannelReady() {
    raf(() => {
      const diff = Date.now() - channelLoadTimestamp
      if (diff <= MIN_CHANNEL_LOADING_TIME) {
        setTimeout(() => {
          $loadingChannel = LOADING_STATE.Done
        }, MIN_CHANNEL_LOADING_TIME - diff)
      } else {
        $loadingChannel = LOADING_STATE.Done
      }
    })
  }

  function handleChannelChange(info) {
    raf(() => {
      $loadingChannel = LOADING_STATE.Loading
      if (info.type === 'unknown') handleChannelReady()
    })
  }

  $effect(() => {
    if ($loadingChannel === LOADING_STATE.Loading) {
      startLoadingChannelAnimation()
    } else {
      stopLoadingChannelAnimation()
    }
  })

  $effect(() => {
    handleChannelChange($currentChannelInfo)
  })

  $effect(() => {
    document.body.dataset.channel = String($currentChannel)
  })

  $effect(() => {
    document.body.classList.toggle('hide-content', !$contentVisible)
  })

  $effect(() => {
    if ($loadingPage === LOADING_STATE.Loading) {
      document.body.dataset.loadingPage = ''
    } else {
      delete document.body.dataset.loadingPage
    }
  })

  $effect(() => {
    if (
      $loadingPage === LOADING_STATE.Loading ||
      $loadingChannel === LOADING_STATE.Loading
    ) {
      startNoise()
    } else {
      stopNoise()
    }
  })
</script>

<div class="tv-videos">
  {#if $currentChannelInfo.type === 'webcam'}
    <Webcam onReady={handleChannelReady} />
  {:else if $currentChannelInfo.type === 'video'}
    <Video onReady={handleChannelReady} />
  {/if}
</div>

<Volume />

<style>
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

      &:global([data-channel='2']),
      &:global([data-channel='8']) {
        object-position: center top;
      }
    }
  }
</style>
