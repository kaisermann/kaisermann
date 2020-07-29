import { writable, derived } from 'svelte/store';

export const MAX_CHANNELS = 10;

export const channel = writable(0);
export const volume = writable(0.25);

export const channels = writable({
  0: { type: 'static' },
  1: { type: 'video', ts: null, duration: null },
  2: { type: 'video', ts: null, duration: null },
  3: { type: 'video', ts: null, duration: null },
  4: { type: 'video', ts: null, duration: null },
  5: { type: 'video', ts: null, duration: null },
  6: { type: 'video', ts: null, duration: null },
  7: { type: 'video', ts: null, duration: null },
  8: { type: 'video', ts: null, duration: null },
  9: { type: 'webcam', ts: null, duration: null },
});

export const currentChannel = derived(
  [channel, channels],
  ([$channel, $channels]) => {
    return {
      paddedNumber: $channel.toString().padStart(2, '0'),
      number: $channel,
      ...$channels[$channel],
    };
  },
);
