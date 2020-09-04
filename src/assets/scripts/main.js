import { init as initTextNav } from './modules/textNav.js';
import TVScreen from './components/Screen.svelte';
// import Remote from './components/Remote.svelte';
// import RemoteTrigger from './components/RemoteTrigger.svelte';

const bootstrap = () => {
  requestAnimationFrame(() => {
    document.body.removeAttribute('no-js', '');

    initTextNav();

    new TVScreen({ target: document.querySelector('.js-screen') });

    // new Remote({
    //   target: document.querySelector('.js-remote'),
    // });

    // new RemoteTrigger({
    //   target: document.querySelector('.js-remote-trigger'),
    // });
  });
};

if (document.readyState !== 'interactive') {
  window.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
