import levenshtein from 'js-levenshtein';

import { raf } from './utils.js';

let pages;
let textNav;

function getClosestPageMatch(text) {
  const { page } = pages.reduce(
    (acc, p) => {
      const { aliases } = p;

      aliases.forEach((alias) => {
        const weight =
          alias.startsWith(text) || text.startsWith(alias) ? -4 : 1;

        const diff = Math.max(0, levenshtein(alias, text) + weight);

        if (diff < acc.diff) {
          acc = { diff, page: p };
        }
      });

      return acc;
    },
    {
      page: pages[0],
      diff: 100,
    },
  );

  return page;
}

function getCaretPositionWithin(element) {
  let caretOffset = 0;
  const sel = window.getSelection();

  if (sel.rangeCount > 0) {
    const range = window.getSelection().getRangeAt(0);
    const preCaretRange = range.cloneRange();

    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }

  return caretOffset;
}

function updateCaret() {
  const pos = getCaretPositionWithin(textNav);

  textNav.style.setProperty('--caret-position', pos);
}

function changePage() {
  const page = getClosestPageMatch(textNav.textContent.trim());

  if (page.external) {
    window.open(page.url, '_blank');

    return;
  }

  window.location.href = page.url;
}

function fetchPages() {
  fetch('/assets/pages.json')
    .then((r) => r.json())
    .then((data) => {
      pages = data;
    })
    .catch(() => {
      if (fetchPages.retries++ < 3) {
        fetchPages();
      } else {
        console.warn('Something went wrong :(');
      }
    });
}

fetchPages.retries = 0;

const debouncedUpdateCaret = raf.bind(null, updateCaret);

export function initTextNav() {
  textNav = document.querySelector('.js-text-nav');

  if (!textNav) {
    return;
  }

  textNav.addEventListener('click', debouncedUpdateCaret);
  textNav.addEventListener('blur', () => {
    if (textNav.textContent === '') {
      textNav.textContent = textNav.getAttribute('data-original-text');
    }
  });
  textNav.addEventListener('focus', () => {
    debouncedUpdateCaret();

    if (pages == null) {
      fetchPages();
    }
  });
  textNav.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      changePage();
    }

    if (e.key === ' ') {
      e.preventDefault();
    }

    debouncedUpdateCaret();
  });
}
