export function sendEvent({ type, label, category }) {
  if (!window.gtag) return;

  window.gtag('event', type, {
    event_label: label,
    event_category: category,
  });
}

export function sendPageview() {
  if (!window.gtag) return;

  window.gtag('event', 'page_view');
}
