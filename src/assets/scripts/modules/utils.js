export const raf = window.requestAnimationFrame;
export const idle = window.requestIdleCallback;
export const timeout = window.setTimeout;
export const { body } = document;
export const { location } = window;
export const { hostname } = location;

export const waitFor = (ms) => new Promise((res) => timeout(res, ms));
