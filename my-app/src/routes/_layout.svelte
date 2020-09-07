<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Space from '../components/Space.svelte';
  import Spaceship from '../components/Spaceship.svelte';
  import TV from '../components/TV/TV.svelte';

  export let segment;

  const segmentStore = writable(segment);

  $: $segmentStore = segment;

  setContext('segment', segmentStore);
</script>

<style lang="postcss" global>
  @import '../global/main.css';

  .page__container {
    display: grid;
    grid-template-rows: auto 1fr auto;
    max-width: 100%;
    min-height: 100vh;
    width: var(--container-width);
    margin: 0 auto;

    @nest body.hide-content & {
      visibility: hidden;
    }
  }

  .skip-link {
    position: absolute;
    z-index: var(--layer-top);
    top: 0;
    left: 0;

    &:not(:focus) {
      transform: translateX(-100%);
    }
  }
</style>

<main>
  <a class="skip-link" href="#content">Skip to content</a>

  <Space>
    <Spaceship>
      <TV>
        <slot />
      </TV>
    </Spaceship>
  </Space>
</main>
