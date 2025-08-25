import { writable, derived, get } from 'svelte/store'

import { raf } from './utils.js'

export const LOADING_STATE = {
  None: 0,
  Loading: 1,
  Done: 2,
}

// used for toggling
let prevVolume = null

export const contentVisible = writable(true)
export const volume = writable(0.25)
export const currentChannel = writable(0)
export const loadingChannel = writable(LOADING_STATE.None)
export const loadingPage = writable(LOADING_STATE.None)

export const channelMap = {
  0: {},
  1: { type: 'video', duration: null, startTimestamp: null },
  2: { type: 'video', duration: null, startTimestamp: null },
  3: { type: 'video', duration: null, startTimestamp: null },
  4: { type: 'video', duration: null, startTimestamp: null },
  5: { type: 'video', duration: null, startTimestamp: null },
  6: { type: 'video', duration: null, startTimestamp: null },
  7: { type: 'video', duration: null, startTimestamp: null },
  8: { type: 'video', duration: null, startTimestamp: null },
  9: { type: 'webcam', displayName: 'AV1' },
}

const channelIds = Object.keys(channelMap)

export const currentChannelInfo = derived(
  [currentChannel],
  ([$currentChannel]) => {
    return {
      displayName: $currentChannel.toString().padStart(2, '0'),
      number: $currentChannel,
      type: 'unknown',
      ...channelMap[$currentChannel],
    }
  }
)

export const updateChannelInfo = (number, info) => {
  channelMap[number] = {
    ...channelMap[number],
    ...info,
  }
}

export const incrementChannel = () => {
  currentChannel.update((n) => {
    const newValue = n + 1

    if (newValue >= channelIds.length) {
      return 0
    }

    return newValue
  })
}

export const gotoChannel = (n) => {
  currentChannel.set(n)
}

export const decrementChannel = () => {
  currentChannel.update((n) => {
    const newValue = n - 1

    if (newValue < 0) {
      return channelIds.length - 1
    }

    return newValue
  })
}

const MAX_VOLUME = 15
const VOLUME_STEP = 1 / MAX_VOLUME

export function decrementVolume() {
  let newVol = get(volume) - VOLUME_STEP

  if (newVol < 0) newVol = 0

  volume.set(newVol)
}

export function incrementVolume() {
  let newVol = get(volume) + VOLUME_STEP

  if (newVol > 1) newVol = 1

  volume.set(newVol)
}

export function toggleMute() {
  const $volume = get(volume)

  if ($volume === 0) {
    volume.set(prevVolume)
  } else {
    prevVolume = $volume
    volume.set(0)
  }
}

export const toggleContent = () => {
  contentVisible.update((v) => !v)
}

export function toggleSpace() {
  document.querySelector('.js-tv').addEventListener(
    'animationend',
    (e) => {
      raf(() => {
        if (e.animationName === 'go-to-space') {
          document.body.dataset.space = 'floating'
        }

        if (e.animationName === 'exit-space') {
          delete document.body.dataset.space
        }
      })
    },
    { once: true }
  )

  raf(() => {
    const nextState =
      document.body.dataset.space === 'floating' ? 'exiting' : 'entering'
    if (nextState === 'entering') {
      const stars = document.querySelector('.stars')
      if (stars && !stars.dataset.start) {
        stars.dataset.start = performance.now().toString()
      }
    }
    document.body.dataset.space = nextState
  })
}

function loadChannelTimestamps() {
  const tsList = JSON.parse(localStorage.getItem('timestamps'))

  if (tsList == null) return

  tsList.forEach(([id, ts]) => {
    channelMap[id].startTimestamp = ts
  })
}

function saveChannelTimestamps() {
  localStorage.setItem(
    'timestamps',
    JSON.stringify(
      Object.entries(channelMap).map(([id, info]) => {
        return [id, info.startTimestamp]
      })
    )
  )
}

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}

function lookForChannelButtons() {
  const channelButtons = document.querySelectorAll('.js-channel-trigger')

  channelButtons.forEach((button) => {
    if (button._channelButton) return

    button._channelButton = true

    button.addEventListener('click', (e) => {
      e.preventDefault()
      e.target.blur()

      const channel = Number(e.target.dataset.channel)

      if (!Number.isNaN(channel)) {
        currentChannel.update((current) => {
          if (channel === current) return 0

          return channel
        })
      }
    })
  })
}

window.addEventListener(
  'visibilitychange',
  () => {
    if (document.visibilityState === 'hidden') {
      saveChannelTimestamps()
    }
  },
  false
)

loadChannelTimestamps()
document.addEventListener('astro:page-load', () => {
  lookForChannelButtons()
})
