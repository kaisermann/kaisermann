<script>
  import Header from '../Header.svelte';
  import Footer from '../Footer.svelte';
  import Effects from './Effects.svelte';
</script>

<style lang="postcss">
  .tv-screen {
    height: 100%;
  }

  .tv__content {
    position: relative;
    z-index: var(--layer-content);
    height: 100%;
    overflow: hidden auto;
    background-color: rgba(0, 0, 0, 0.4);

    /* todo: needed? no js causes this to never be removed */
    @nest :global(body:not([no-js]) [screen-animation='turn-on']) & {
      overflow: hidden;
    }
  }
</style>

<div class="tv-screen">
  <Effects />
  <div class="tv__content">
    <div class="page__container glitchy-text">
      <Header />

      <div class="page__content" id="content">
        <slot />
      </div>

      <Footer />
    </div>
  </div>
</div>
