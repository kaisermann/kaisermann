import levenshtein from 'js-levenshtein';

const PAGES = ['home', 'playlists', 'websites', 'open-source'];

const textNav = document.querySelector('.js-text-nav');
let timer;

function getClosestPageMatch(text) {
  const { page } = PAGES.reduce(
    (acc, p) => {
      const weight = p.startsWith(text) || text.startsWith(p) ? -4 : 1;
      const diff = Math.max(0, levenshtein(p, text) + weight);

      if (diff < acc.diff) {
        acc = { diff, page: p };
      }

      return acc;
    },
    {
      page: PAGES[0],
      diff: 100,
    },
  );

  if (page === 'home') {
    return '';
  }

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

function resetCaret() {
  textNav.style.removeProperty('--caret-position');
}

function changePage() {
  const page = getClosestPageMatch(textNav.textContent);

  window.location.href = `/${encodeURIComponent(page)}`;
}

const debouncedUpdateCaret = requestAnimationFrame.bind(null, updateCaret);

if (textNav) {
  textNav.addEventListener('click', debouncedUpdateCaret);
  textNav.addEventListener('focus', debouncedUpdateCaret);
  textNav.addEventListener('blur', resetCaret);

  textNav.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // clearTimeout(timer);
      changePage();
    }

    debouncedUpdateCaret();
  });

  // textNav.addEventListener('input', () => {
  //   clearTimeout(timer);
  //   timer = setTimeout(changePage, 1000);
  // });
}
