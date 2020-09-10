import levenshtein from 'js-levenshtein';

import { raf } from './utils.js';
import { gotoPage } from './links.js';

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
  if (textNav == null) return;

  const pos = getCaretPositionWithin(textNav);

  textNav.style.setProperty('--caret-position', pos);
}

function changePage() {
  const page = getClosestPageMatch(textNav.textContent.trim());

  if (page.external) {
    window.open(page.url, '_blank');

    return;
  }

  gotoPage(page.url);
}

function fetchPagesData() {
  fetch('/assets/pages.json')
    .then((r) => r.json())
    .then((data) => {
      pages = data;
    })
    .catch(() => {
      if (fetchPagesData.retries++ < 3) {
        fetchPagesData();
      } else {
        console.warn('Something went wrong :(');
      }
    });
}

fetchPagesData.retries = 0;

const debouncedUpdateCaret = raf.bind(null, updateCaret);

const handleClick = debouncedUpdateCaret;

function handleBlur() {
  if (textNav.textContent === '') {
    textNav.textContent = textNav.getAttribute('data-original-text');
  }
}

function handleFocus() {
  debouncedUpdateCaret();

  if (pages == null) {
    fetchPagesData();
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    changePage();
  }

  if (e.key === ' ') {
    e.preventDefault();
  }

  debouncedUpdateCaret();
}

export function seekAndBindElement() {
  textNav = document.querySelector('.js-text-nav');

  if (!textNav) {
    return;
  }

  // Garbace collection takes care of removing these listeners when the element is destroyed
  textNav.addEventListener('click', handleClick);
  textNav.addEventListener('blur', handleBlur);
  textNav.addEventListener('focus', handleFocus);
  textNav.addEventListener('keydown', handleKeydown);

  textNav.textContent = textNav.textContent.trim();
}

export function initTextNav() {
  seekAndBindElement();
  window.addEventListener('contentChange', seekAndBindElement);
}
