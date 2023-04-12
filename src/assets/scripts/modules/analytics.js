export function sendEvent({ type, label, value }) {
  if (!window.cronitor) return;

  window.cronitor('track', [type, label, value].filter(Boolean).join('.'));
}
