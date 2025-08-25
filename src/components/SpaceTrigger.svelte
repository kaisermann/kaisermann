<script>
  import { toggleSpace } from '../modules/tv.js'
</script>

<button on:click={toggleSpace}>SPACE MODE</button>

<style>
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
    cursor: var(--cursor-pointer);

    &:hover {
      opacity: 1;
      /* preload the stars background on button hover */
      background-image: url(/assets/images/stars.jpg);
      background-size: 0 0;
      background-repeat: no-repeat;

      :global(html.webp) & {
        background-image: url(/assets/images/stars.webp);
      }

      :global(html.avif) & {
        background-image: url(/assets/images/stars.avif);
      }
    }

    :global(body.hide-content) & {
      visibility: visible;
    }
  }
</style>
