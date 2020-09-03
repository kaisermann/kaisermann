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
