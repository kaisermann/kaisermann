import { init as initTextNav } from './modules/textNav.js';
import TVScreen from './components/Screen.svelte';
// import Remote from './components/Remote.svelte';
// import RemoteTrigger from './components/RemoteTrigger.svelte';

function bootstrap() {
  initTextNav();

  new TVScreen({ target: document.querySelector('.js-screen') });

  // new Remote({
  //   target: document.querySelector('.js-remote'),
  // });

  // new RemoteTrigger({
  //   target: document.querySelector('.js-remote-trigger'),
  // });

  if (process.env.ELEVENTY_ENV === 'production') {
    const script = document.createElement('script');

    script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-75837777-1';
    script.async = true;

    document.head.append(script);
  }
}

requestAnimationFrame(bootstrap);
