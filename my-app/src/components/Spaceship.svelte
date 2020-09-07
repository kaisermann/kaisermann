<style lang="postcss">
  .spaceship {
    @nest :global(body.remote) & {
      animation: float 6s ease-in-out infinite;
    }
  }
</style>

<div class="spaceship">
  <slot />
</div>
