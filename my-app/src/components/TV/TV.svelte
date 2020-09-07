<script>
  import Screen from './Screen.svelte';
</script>

<style lang="postcss">
  .tv {
    position: relative;
    height: 100vh;
    background-color: #000;
    box-shadow: 0px 0px 50px 1px rgba(255, 255, 255, 0.2);
    overflow: hidden;
    margin: 0 auto;
    transform-origin: center 10%;
    transition: transform 0.4s 0.1s ease;

    @media (max-width: 900px) {
      transition: height 0.4s ease, transform 0.4s ease;
      transition-delay: 0.1s, 0.1s, 0.1s;
      will-change: height, transform;
    }

    @nest :global(body.remote) & {
      --scale: 0.6;
      transition-delay: 0s;
      transform: scale(var(--scale)) translateY(80px);
      border-radius: 8px;

      @media (max-width: 900px) {
        --scale: 0.9;
        transition-delay: 0s, 0s;
        height: calc(90vw / 16 * 10);
      }
    }
  }
</style>

<div class="tv">
  <Screen>
    <slot />
  </Screen>
</div>
