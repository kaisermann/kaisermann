import { writable, derived, get } from 'svelte/store';

import { sendEvent } from './modules/analytics.js';
import { raf, timeout } from './modules/aliases.js';

// used for toggling
let prevVolume = null;

export const contentVisible = writable(true);
export const volume = writable(0.25);
export const currentChannel = writable(0);

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

const tvEl = document.querySelector('.js-tv');
const screenEl = document.querySelector('.js-screen');

const { body } = document;

// todo: better way to do this animation orchestration
export function toggleSpace() {
  tvEl.addEventListener(
    'animationend',
    (e) => {
      raf(() => {
        if (e.animationName === 'go-to-space') {
          return body.setAttribute('animation-space', 'floating');
        }

        if (e.animationName === 'exit-space') {
          return body.removeAttribute('animation-space');
        }
      });
    },
    { once: true },
  );

  raf(() => {
    const isInSpace = body.getAttribute('animation-space') === 'floating';

    body.setAttribute('animation-space', isInSpace ? 'exiting' : 'entering');

    if (isInSpace) {
      sendEvent({ type: 'Went to space', category: 'easter_egg' });
    }
  });
}

export function animateScreen(animation) {
  raf(() => {
    const currentAnimation = body.getAttribute('animation-screen');

    if (currentAnimation !== animation) {
      body.setAttribute('animation-screen', animation);
    }

    let timer;
    const cancel = () => {
      clearTimeout(timer);
      raf(() => {
        body.removeAttribute('animation-screen');
      });
    };

    // remove the attribute after the animation ends
    screenEl.addEventListener('animationend', cancel, { once: true });

    timer = timeout(cancel, 1500);
  });
}
