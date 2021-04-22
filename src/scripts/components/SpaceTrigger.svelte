<script>
  import { toggleSpace } from '../modules/tv.js';
</script>

<style lang="postcss">
  button {
    font-family: var(--font-primary);
    appearance: none;
    background-color: transparent;
    border: none;
    padding: 0;
    opacity: 0.2;
    transition: opacity 0.3s ease;
    color: currentColor;
    font-size: 1rem;

    &:hover {
      opacity: 1;
      /* preload the stars background on button hover */
      background-image: url(/assets/images/stars.jpg);
      background-size: 0 0;
      background-repeat: no-repeat;

      @nest :global(html.webp) & {
        background-image: url(/assets/images/stars.webp);
      }

      @nest :global(html.avif) & {
        background-image: url(/assets/images/stars.avif);
      }
    }

    @nest :global(body.hide-content) & {
      visibility: visible;
    }
  }
</style>

<button class="cursor-pointer" on:click={toggleSpace}>SPACE MODE</button>
