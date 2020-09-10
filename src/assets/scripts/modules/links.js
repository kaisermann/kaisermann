import { body, hostname } from './utils';
import { sendPageview } from './analytics';

let parser;
const contentEl = document.querySelector('.js-content');

const contentSlotList = Array.from(contentEl.querySelectorAll('[js-slot]'));

const pageCache = new Map();

const initialState = {
  title: document.title,
  slots: getSlotsContent(),
};

function isValidAnchor(anchor) {
  if (anchor == null) return false;
  if (anchor.tagName !== 'A') return false;
  if (anchor == null) return false;
  if (anchor.target === '_blank') return false;
  if (anchor.hostname !== hostname) return false;

  return true;
}

function getSlotsContent(container = contentEl) {
  let slotList = contentSlotList;

  if (container !== contentEl) {
    slotList = Array.from(container.querySelectorAll('[js-slot]'));
  }

  const slots = slotList.reduce((acc, el) => {
    const slotName = el.getAttribute('js-slot');

    acc[slotName] = el.innerHTML;

    return acc;
  }, {});

  return slots;
}

function replaceSlotsContent({ slots }) {
  Object.keys(slots).forEach((slotName) => {
    const slotEl = contentSlotList.find(
      (el) => el.getAttribute('js-slot') === slotName,
    );

    if (slotEl == null) return;
    slotEl.innerHTML = slots[slotName];
  });

  window.dispatchEvent(new CustomEvent('contentChange'));
}

function fetchPage(url) {
  url = url.replace(/\/$/, '');

  if (pageCache.has(url)) {
    return Promise.resolve(pageCache.get(url));
  }

  const promise = fetch(url, { importance: 'low' })
    .then((response) => response.text())
    .then((html) => {
      if (parser == null) {
        parser = new DOMParser();
      }

      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.querySelector('.js-content');

      const cacheObj = {
        title: doc.title,
        slots: getSlotsContent(newContent),
      };

      pageCache.set(url, cacheObj);

      return cacheObj;
    });

  pageCache.set(url, promise);

  return promise;
}

export function gotoPage(url) {
  if (url.indexOf('http') !== 0) {
    url = `${window.location.origin}${url}`;
  }

  return fetchPage(url).then(({ title, slots }) => {
    replaceSlotsContent({ title, slots });
    document.title = title;
    contentEl.scrollTop = 0;
    window.history.pushState({ title, slots }, title, url);

    // todo: test this
    sendPageview();
  });
}

export function initLinks() {
  window.addEventListener('popstate', (e) => {
    let { state } = e;

    if (state == null) {
      state = initialState;
    }

    replaceSlotsContent(state);
    document.title = e.title;
    contentEl.scrollTop = 0;
  });

  body.addEventListener('mousemove', (e) => {
    if (!isValidAnchor(e.target)) return;
    if (pageCache.has(e.target.href)) return;

    fetchPage(e.target.href);
  });

  body.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');

    if (!isValidAnchor(anchor)) return;

    e.preventDefault();
    gotoPage(anchor.href);
  });
}
