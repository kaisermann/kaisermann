import './styles/main/main.css';

import TVScreen from './scripts/components/Screen.svelte';
import Remote from './scripts/components/Remote.svelte';
import HeaderControls from './scripts/components/HeaderControls.svelte';
import SpaceTrigger from './scripts/components/SpaceTrigger.svelte';
import { raf } from './scripts/modules/utils.js';
import { screenEl } from './scripts/modules/tv.js';
import { initTextNav } from './scripts/modules/textNav.js';
import { initHotkeys } from './scripts/modules/keyboard.js';
import { initLinks } from './scripts/modules/links.js';

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
