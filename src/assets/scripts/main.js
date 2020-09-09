import '../styles/deferred.css';

import TVScreen from './components/Screen.svelte';
import Remote from './components/Remote.svelte';
import HeaderControls from './components/HeaderControls.svelte';
import SpaceTrigger from './components/SpaceTrigger.svelte';
import { raf } from './modules/utils.js';
import { screenEl } from './tv.js';
import { initTextNav } from './modules/textNav.js';
import { initHotkeys } from './modules/keyboard';

const bootstrap = () => {
  raf(() => {
    initTextNav();
    initHotkeys();

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
