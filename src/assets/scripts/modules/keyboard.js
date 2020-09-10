import { get } from 'svelte/store';

import {
  currentChannel,
  toggleSpace,
  incrementChannel,
  decrementChannel,
  toggleContent,
  gotoChannel,
} from '../tv.js';

function isValidHotkey(e) {
  return (
    document.activeElement === document.body ||
    document.activeElement == null ||
    (document.activeElement.tagName === 'BUTTON' &&
      e.key !== 'Enter' &&
      e.key !== ' ')
  );
}

function handleHotkey(e) {
  if (!isValidHotkey(e)) return;
  if (e.key === 'r') return toggleSpace();
  if (e.key === '+' || e.key === '=') return incrementChannel();
  if (e.key === '-') return decrementChannel();
  if (e.key === 'h') return toggleContent();

  const channelNumber = Number(e.key);

  // ignore non-number keys
  if (Number.isNaN(channelNumber)) {
    return;
  }

  // toggle between a X channel and channel 0
  if (channelNumber === get(currentChannel)) {
    gotoChannel(0);
  } else {
    gotoChannel(channelNumber);
  }
}

export function initHotkeys() {
  window.addEventListener('keyup', handleHotkey);
}
