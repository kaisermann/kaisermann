import cheet from 'cheet.js';

const combination = 'a'; // '↑ ↑ ↓ ↓ ← → ← → b a'

const { body } = document;
const bg = document.querySelector('.js-page-bg');

cheet(combination, () => {
  const easterWrapper = bg.querySelector('.js-easter');

  if (!easterWrapper) {
    window.requestAnimationFrame(() => {
      body.classList.add('--easter-tv-on');
      body.addEventListener('onanimationend', () => {
        body.classList.remove('--easter-tv-on');
      });

      bg.innerHTML += `<iframe class="page__background__easter  --video js-easter" src="https://www.youtube.com/embed/4-F5TfXtue8?autoplay=1&controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media;" allowfullscreen></iframe>`;
    });
  } else {
    body.classList.remove('--easter-tv-on');
    easterWrapper.remove();
  }
});
