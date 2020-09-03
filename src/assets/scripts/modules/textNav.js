import levenshtein from 'js-levenshtein';

const textNav = document.querySelector('.js-text-nav');
let timer;

const PAGES = ['home', 'playlists', 'websites', 'open-source'];

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

if (textNav) {
  textNav.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  textNav.addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const page = getClosestPageMatch(e.target.textContent);

      window.location.href = `/${encodeURIComponent(page)}`;
    }, 1000);
  });
}
