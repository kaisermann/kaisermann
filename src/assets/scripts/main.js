import { init as initTextNav } from './modules/textNav.js';
import { raf, body } from './modules/utils.js';
import { screenEl } from './tv.js';
import TVScreen from './components/Screen.svelte';
import Remote from './components/Remote.svelte';

const bootstrap = () => {
  raf(() => {
    body.removeAttribute('no-js', '');

    initTextNav();

    new TVScreen({ target: screenEl });

    new Remote({ target: document.querySelector('.js-remote') });
  });
};

if (document.readyState !== 'interactive') {
  window.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
