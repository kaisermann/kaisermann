import { idle, raf } from './utils.js';

const defer = idle || raf;

export function sendEvent({ type, label, category }) {
  defer(() => {
    if (!window.gtag) return;

    window.gtag('event', type, {
      event_label: label,
      event_category: category,
    });
  });
}

export function sendPageview() {
  defer(() => {
    if (!window.gtag) return;

    window.gtag('event', 'page_view');
  });
}
