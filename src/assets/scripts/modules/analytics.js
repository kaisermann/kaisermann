import { idle, raf } from './aliases.js';

export function sendEvent({ type, label, category }) {
  (idle || raf)(() => {
    if (!window.gtag) return;

    window.gtag('event', type, {
      event_label: label,
      event_category: category,
    });
  });
}
