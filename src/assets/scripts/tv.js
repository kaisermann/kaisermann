import { writable, derived, get } from 'svelte/store';

export const MAX_CHANNEL = 9;

// used for toggling
let prevVolume = null;
let prevChannel = null;

export const volume = writable(0.25);

export const currentChannel = writable(0);

export const channelMap = {
  0: { type: 'static', duration: null, watchTimestamp: null },
  1: { type: 'video', duration: null, watchTimestamp: null },
  2: { type: 'video', duration: null, watchTimestamp: null },
  3: { type: 'video', duration: null, watchTimestamp: null },
  4: { type: 'video', duration: null, watchTimestamp: null },
  5: { type: 'video', duration: null, watchTimestamp: null },
  6: { type: 'video', duration: null, watchTimestamp: null },
  7: { type: 'video', duration: null, watchTimestamp: null },
  8: { type: 'video', duration: null, watchTimestamp: null },
  9: { type: 'webcam', duration: null, watchTimestamp: null },
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

export function decreaseVolume(n) {
  const newVol = get(volume) - n / 10;

  if (newVol < 0) return;

  volume.set(newVol);
}

export function increaseVolume(n) {
  const newVol = get(volume) + n / 10;

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

export const toggleOnOff = () => {
  const $currentChannel = get(currentChannel);

  if ($currentChannel === 0 && prevChannel) {
    gotoChannel(prevChannel);
  } else {
    prevChannel = $currentChannel;
    gotoChannel(0);
  }
};
