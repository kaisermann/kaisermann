import { writable, derived, get } from 'svelte/store';

import { sendEvent } from './modules/analytics.js';

export const MAX_CHANNEL = 9;

// used for toggling
let prevVolume = null;

export const contentVisible = writable(true);
export const volume = writable(0.25);
export const currentChannel = writable(0);

export const channelMap = {
  0: { type: 'static' },
  1: { type: 'video', duration: null, watchTimestamp: null },
  2: { type: 'video', duration: null, watchTimestamp: null },
  3: { type: 'video', duration: null, watchTimestamp: null },
  4: { type: 'video', duration: null, watchTimestamp: null },
  5: { type: 'video', duration: null, watchTimestamp: null },
  6: { type: 'video', duration: null, watchTimestamp: null },
  7: { type: 'video', duration: null, watchTimestamp: null },
  8: { type: 'video', duration: null, watchTimestamp: null },
  9: { type: 'webcam' },
};

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

export const increaseChannel = () => {
  currentChannel.update((n) => {
    const newValue = n + 1;

    if (newValue > MAX_CHANNEL) {
      return 0;
    }

    return newValue;
  });
};

export const gotoChannel = (n) => {
  currentChannel.set(n);
};

export const decreaseChannel = () => {
  currentChannel.update((n) => {
    const newValue = n - 1;

    if (newValue < 0) {
      return MAX_CHANNEL;
    }

    return newValue;
  });
};

const MAX_VOLUME = 15;
const VOLUME_STEP = 1 / MAX_VOLUME;

export function decreaseVolume() {
  const newVol = get(volume) - VOLUME_STEP;

  if (newVol < 0) return;

  volume.set(newVol);
}

export function increaseVolume() {
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

export const tvEl = document.querySelector('.js-tv');
export const screenEl = document.querySelector('.js-screen');

const raf = requestAnimationFrame;

export const toggleSpace = () => {
  tvEl.addEventListener(
    'animationend',
    (e) => {
      raf(() => {
        if (e.animationName === 'go-to-space') {
          return document.body.setAttribute('space', 'floating');
        }

        if (e.animationName === 'exit-space') {
          return document.body.removeAttribute('space');
        }
      });
    },
    { once: true },
  );

  raf(() => {
    const isInSpace = document.body.getAttribute('space') === 'floating';

    if (isInSpace) {
      document.body.setAttribute('space', 'exiting');
    } else {
      document.body.setAttribute('space', 'going');
    }

    if (isInSpace) {
      sendEvent({ type: 'Went to space', category: 'easter_egg' });
    }
  });
};

export function animateScreen(animation) {
  raf(() => {
    const currentAnimation = document.body.getAttribute('screen-animation');

    if (currentAnimation !== animation) {
      document.body.setAttribute('screen-animation', animation);
    }

    let timer;
    const cancel = () => {
      clearTimeout(timer);
      raf(() => {
        document.body.removeAttribute('screen-animation');
      });
    };

    // remove the attribute after the animation ends
    screenEl.addEventListener('animationend', cancel, { once: true });

    timer = setTimeout(cancel, 1500);
  });
}
