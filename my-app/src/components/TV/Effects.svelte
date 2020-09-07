<style lang="postcss">
  .tv-effect--decontrast,
  .tv-effect--colors,
  .tv-effect--static,
  .tv-effect--vignette {
    position: absolute;
    z-index: var(--layer-tv-effects);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* colors */
  .tv-effect--colors {
    background-image: url(/assets/images/effect-colored-noise.gif);
    background-size: cover;
    opacity: 0.1;
  }

  /* static/noise effect */
  .tv-effect--static {
    background-image: url(/assets/images/effect-glitch.gif);
    background-size: cover;
    opacity: 0.4;
  }

  /* vignette */
  .tv-effect--vignette {
    background: radial-gradient(circle, transparent 60%, black 100%),
      transparent;

    @nest :global(body:not([no-js]) [screen-animation='turn-on']) & {
      background: radial-gradient(circle, black 30%, transparent 90%),
        transparent;
    }
  }

  /* remove some contrast from the webcam */
  .tv-effect--decontrast {
    background-color: #fff;
    opacity: 0.2;

    @nest :global(body:not(.using-camera)) & {
      display: none;
    }
  }

  .tv-effect--crt {
    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      z-index: var(--layer-tv-effects);
      top: 0;
      left: 0;
      width: 100%;
      pointer-events: none;
    }

    &::before {
      height: 90px;
      background: linear-gradient(
        180deg,
        transparent 0,
        #fffafa26 50%,
        transparent
      );
      animation: vline 8s linear infinite;
    }

    &::after {
      height: 100%;
      background-image: repeating-linear-gradient(
        transparent,
        transparent 6px,
        rgba(255, 255, 255, 0.03) 6px,
        rgba(255, 255, 255, 0.03) 12px
      );
    }
  }
</style>

<div class="tv-effects">
  <div class="tv-effect--decontrast" />
  <div class="tv-effect--colors" />
  <div class="tv-effect--static" />
  <div class="tv-effect--vignette" />
  <div class="tv-effect--crt" />
</div>
