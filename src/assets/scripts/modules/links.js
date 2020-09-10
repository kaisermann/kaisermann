import { body, hostname, waitFor, raf, location } from './utils';
import { sendPageview } from './analytics';
import { loadingPage, LOADING_STATE } from '../tv';

const MIN_LOADING_TIME = 200;

const contentEl = document.querySelector('.js-content');
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
    element.hostname === hostname
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

export async function gotoPage(url) {
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

    // todo: test this
    sendPageview();
  });
}

function scrollContentToElement(el) {
  location.hash = el.getAttribute('href');

  raf(() => {
    const target = contentEl.querySelector(':target');

    if (target) target.scrollIntoView(true);
  });
}

export function initLinks() {
  window.addEventListener('popstate', async (e) => {
    let { state } = e;

    // prevent hash links from transitioning
    console.log(location.pathname, currentPathname);
    if (location.pathname === currentPathname) {
      e.preventDefault();

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
      contentEl.scrollTop = 0;
    });
  });

  body.addEventListener('mousemove', (e) => {
    if (!isTransitionableAnchor(e.target)) return;
    if (pageCache.has(e.target.href)) return;

    fetchPage(e.target.href);
  });

  body.addEventListener('click', (e) => {
    if (isHashAnchor(e.target)) {
      return scrollContentToElement(e.target);
    }

    if (!isTransitionableAnchor(e.target)) return;

    e.preventDefault();
    gotoPage(e.target.href);
  });
}
