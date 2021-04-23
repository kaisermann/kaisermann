import { body, hostname, waitFor, raf, location } from './utils';
import { contentEl, loadingPage, LOADING_STATE } from './tv.js';

const MIN_LOADING_TIME = 300;

const contentSlotList = Array.from(contentEl.querySelectorAll('[js-slot]'));

const pageCache = new Map();

const initialState = {
  title: document.title,
  slots: getSlotsContent(),
};

let parser;
let currentPathname = location.pathname;

function isHashAnchor(element) {
  return (
    element.tagName === 'A' && element.getAttribute('href').indexOf('#') === 0
  );
}

function isTransitionableAnchor(element) {
  return (
    element.tagName === 'A' &&
    !isHashAnchor(element) &&
    element.target !== '_blank' &&
    element.hostname === hostname &&
    !element.hasAttribute('redirect')
  );
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
  Object.entries(slots).forEach(([slotName, slotHTML]) => {
    const slotEl = contentSlotList.find(
      (el) => el.getAttribute('js-slot') === slotName,
    );

    if (slotEl == null) return;

    slotEl.innerHTML = slotHTML;
  });

  window.dispatchEvent(new CustomEvent('contentChange'));
}

function fetchPage(url, { importance } = {}) {
  url = url.replace(/\/$/, '');

  if (pageCache.has(url)) {
    return Promise.resolve(pageCache.get(url));
  }

  const promise = fetch(url, { importance })
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

export async function gotoPage(url) {
  if (url.indexOf('#') === 0) return;
  if (url.indexOf('http') !== 0) {
    url = `${window.location.origin}${url}`;
  }

  loadingPage.set(LOADING_STATE.Loading);

  // min loading time of 200ms
  const [{ title, slots }] = await Promise.all([
    fetchPage(url),
    waitFor(MIN_LOADING_TIME),
  ]);

  loadingPage.set(LOADING_STATE.Done);

  raf(() => {
    replaceSlotsContent({ title, slots });

    document.title = title;
    contentEl.scrollTop = 0;

    window.history.pushState({ title, slots }, title, url);
    currentPathname = location.pathname;
  });
}

function updateContentScrollPosition() {
  raf(() => {
    const target = contentEl.querySelector(':target');

    if (target) {
      contentEl.scrollTop = Math.max(target.offsetTop - 24, 0);
    } else {
      contentEl.scrollTop = 0;
    }
  });
}

export function initLinks() {
  window.addEventListener('popstate', async (e) => {
    let { state } = e;

    // same pathname, possibily means hash changed
    // prevent hash links from transitioning
    if (location.pathname === currentPathname) {
      e.preventDefault();
      updateContentScrollPosition();

      return;
    }

    currentPathname = location.pathname;

    if (state == null) {
      state = initialState;
    }

    loadingPage.set(LOADING_STATE.Loading);

    await waitFor(MIN_LOADING_TIME);

    loadingPage.set(LOADING_STATE.Done);

    raf(() => {
      replaceSlotsContent(state);
      document.title = state.title;
      updateContentScrollPosition();
    });
  });

  body.addEventListener('mousemove', (e) => {
    if (!isTransitionableAnchor(e.target)) return;
    if (pageCache.has(e.target.href)) return;

    fetchPage(e.target.href, { importante: 'low' });
  });

  body.addEventListener('click', (e) => {
    if (isHashAnchor(e.target)) {
      e.preventDefault();
      location.hash = e.target.getAttribute('href');

      return updateContentScrollPosition();
    }

    if (!isTransitionableAnchor(e.target)) return;

    e.preventDefault();
    gotoPage(e.target.href);
  });
}
