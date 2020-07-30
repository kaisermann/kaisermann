import TV from './components/TV.svelte';
import Remote from './components/Remote.svelte';

new TV({
  target: document.querySelector('.js-tv'),
});

new Remote({
  target: document.querySelector('.js-remote'),
});
