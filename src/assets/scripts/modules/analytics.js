export function sendEvent({ type, label, category }) {
  if (!window.gtag) return;

  window.gtag('event', type, {
    event_label: label,
    event_category: category,
  });
}
