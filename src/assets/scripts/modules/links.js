import { body, hostname } from './utils';

let parser;
const currentContent = document.querySelector('.js-content');

const pageCache = new Map();

function isValidAnchor(anchor) {
  if (anchor == null) return false;
  if (anchor.tagName !== 'A') return false;
  if (anchor == null) return false;
  if (anchor.target === '_blank') return false;
  if (anchor.hostname !== hostname) return false;

  return true;
}

async function fetchPage(url) {
  if (pageCache.has(url)) {
    return pageCache.get(url);
  }

  const promise = fetch(url)
    .then((response) => response.text())
    .then((html) => {
      if (parser == null) {
        parser = new DOMParser();
      }

      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.querySelector('.js-content');

      pageCache.set(url, {
        title: doc.title,
        htmlContent: newContent.innerHTML,
      });

      return html;
    });

  pageCache.set(url, promise);

  return promise;
}

export function initLinks() {
  window.addEventListener('popstate', (e) => {
    currentContent.innerHTML = e.state;
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

    fetchPage(anchor.href).then(({ title, htmlContent }) => {
      document.title = title;

      currentContent.innerHTML = htmlContent;

      window.history.pushState(htmlContent, title, anchor.href);

      currentContent.scrollTop = 0;
    });
  });
}
