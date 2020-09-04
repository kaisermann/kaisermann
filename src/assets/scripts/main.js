import './modules/textNav.js';
import TVScreen from './components/Screen.svelte';
// import Remote from './components/Remote.svelte';
// import RemoteTrigger from './components/RemoteTrigger.svelte';

new TVScreen({
  target: document.querySelector('.js-screen'),
});

// new Remote({
//   target: document.querySelector('.js-remote'),
// });

// new RemoteTrigger({
//   target: document.querySelector('.js-remote-trigger'),
// });

function addGTag() {
  const script = document.createElement('script');

  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-75837777-1';
  script.async = true;

  document.head.append(script);
}

if (process.env.ELEVENTY_ENV === 'production') {
  requestAnimationFrame(addGTag);
}
