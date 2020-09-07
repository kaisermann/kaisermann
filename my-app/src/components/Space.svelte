<style lang="postcss">
  .space {
    position: relative;
    height: 100vh;
    background-color: #000;
    overflow: hidden;
  }

  .stars {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;

    @nest :global(body:not([screen-animation^='turn-on'])) & {
      width: 3840px; /* calc(1920px * 2); */
      height: 2640px; /* calc(1320px * 2); */
      animation: moving-stars 117s linear infinite;
      background-image: url(/assets/images/stars.webp);
    }
  }
</style>

<div class="space">
  <div class="stars" />
  <slot />
</div>
