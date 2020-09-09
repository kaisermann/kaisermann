<script>
  import { toggleSpace } from '../tv.js';
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
      opacity: 0.8;
    }

    @nest :global(body.hide-content) & {
      visibility: visible;
    }
  }
</style>

<button class="cursor-pointer" on:click={toggleSpace}> SPACE MODE </button>
