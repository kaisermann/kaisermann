import { writable, derived, get } from 'svelte/store';

import { sendEvent } from './modules/analytics.js';
import { raf, body } from './modules/utils.js';

export const LOADING_STATE = {
  None: 0,
  Loading: 1,
  Done: 2,
};

// used for toggling
let prevVolume = null;

export const tvEl = document.querySelector('.js-tv');
export const screenEl = tvEl.querySelector('.js-screen');
export const contentEl = screenEl.querySelector('.js-content');

export const contentVisible = writable(true);
export const volume = writable(0.25);
export const currentChannel = writable(0);
export const loadingChannel = writable(LOADING_STATE.None);
export const loadingPage = writable(LOADING_STATE.None);

export const channelMap = {
  0: {},
  1: { type: 'video', duration: null, watchTimestamp: null },
  2: { type: 'video', duration: null, watchTimestamp: null },
  3: { type: 'video', duration: null, watchTimestamp: null },
  4: { type: 'video', duration: null, watchTimestamp: null },
  5: { type: 'video', duration: null, watchTimestamp: null },
  6: { type: 'video', duration: null, watchTimestamp: null },
  7: { type: 'video', duration: null, watchTimestamp: null },
  8: { type: 'video', duration: null, watchTimestamp: null },
  9: { type: 'webcam', displayName: 'AV1' },
};

const channelIds = Object.keys(channelMap);

export const currentChannelInfo = derived(
  [currentChannel],
  ([$currentChannel]) => {
    return {
      displayName: $currentChannel.toString().padStart(2, '0'),
      number: $currentChannel,
      type: 'unknown',
      ...channelMap[$currentChannel],
    };
  },
);

export const updateChannelInfo = (number, info) => {
  channelMap[number] = {
    ...channelMap[number],
    ...info,
  };
};

export const incrementChannel = () => {
  currentChannel.update((n) => {
    const newValue = n + 1;

    if (newValue >= channelIds.length) {
      return 0;
    }

    return newValue;
  });
};

export const gotoChannel = (n) => {
  currentChannel.set(n);
};

export const decrementChannel = () => {
  currentChannel.update((n) => {
    const newValue = n - 1;

    if (newValue < 0) {
      return channelIds.length - 1;
    }

    return newValue;
  });
};

const MAX_VOLUME = 15;
const VOLUME_STEP = 1 / MAX_VOLUME;

export function decrementVolume() {
  const newVol = get(volume) - VOLUME_STEP;

  if (newVol < 0) return;

  volume.set(newVol);
}

export function incrementVolume() {
  const newVol = get(volume) + VOLUME_STEP;

  if (newVol > 1) return;

  volume.set(newVol);
}

export function toggleMute() {
  const $volume = get(volume);

  if ($volume === 0) {
    volume.set(prevVolume);
  } else {
    prevVolume = $volume;
    volume.set(0);
  }
}

export const toggleContent = () => {
  contentVisible.update((v) => !v);
};

// todo: better way to do this animation orchestration
export function toggleSpace() {
  tvEl.addEventListener(
    'animationend',
    (e) => {
      raf(() => {
        if (e.animationName === 'go-to-space') {
          return body.setAttribute('space', 'floating');
        }

        if (e.animationName === 'exit-space') {
          return body.removeAttribute('space');
        }
      });
    },
    { once: true },
  );

  raf(() => {
    const isInSpace = body.getAttribute('space') === 'floating';

    body.setAttribute('space', isInSpace ? 'exiting' : 'entering');

    if (isInSpace) {
      sendEvent({ type: 'Went to space', category: 'easter_egg' });
    }
  });
}
