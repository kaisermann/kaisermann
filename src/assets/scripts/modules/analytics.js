export function sendEvent({ type, label, value }) {
  if (!window.panelbear) return;

  window.panelbear('track', [type, label, value].filter(Boolean).join('.'));
}
