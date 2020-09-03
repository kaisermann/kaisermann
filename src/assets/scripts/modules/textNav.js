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

function changePage() {
  const page = getClosestPageMatch(textNav.textContent);

  window.location.href = `/${encodeURIComponent(page)}`;
}

if (textNav) {
  textNav.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(timer);
      changePage();
    }
  });

  textNav.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(changePage, 1000);
  });
}
