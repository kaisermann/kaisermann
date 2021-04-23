import '../styles/main/main.css';

import TVScreen from './components/Screen.svelte';
import Remote from './components/Remote.svelte';
import HeaderControls from './components/HeaderControls.svelte';
import SpaceTrigger from './components/SpaceTrigger.svelte';
import { raf } from './modules/utils.js';
import { screenEl } from './modules/tv.js';
import { initTextNav } from './modules/textNav.js';
import { initHotkeys } from './modules/keyboard.js';
import { initLinks } from './modules/links.js';

const bootstrap = () => {
  raf(() => {
    initTextNav();
    initHotkeys();
    initLinks();

    new TVScreen({ target: screenEl });

    new Remote({ target: document.querySelector('.js-remote') });

    new HeaderControls({
      target: document.querySelector('.js-header-controls'),
    });

    new SpaceTrigger({
      target: document.querySelector('.js-space-trigger'),
    });
  });
};

if (document.readyState !== 'interactive') {
  window.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
