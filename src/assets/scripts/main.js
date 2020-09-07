import { init as initTextNav } from './modules/textNav.js';
import TVScreen from './components/Screen.svelte';
import Remote from './components/Remote.svelte';

const bootstrap = () => {
  requestAnimationFrame(() => {
    document.body.removeAttribute('no-js', '');

    initTextNav();

    new TVScreen({ target: document.querySelector('.js-screen') });

    new Remote({ target: document.querySelector('.js-remote') });
  });
};

if (document.readyState === 'complete') {
  bootstrap();
} else {
  window.addEventListener('load', bootstrap);
}
