<script>
  import { getContext } from 'svelte';

  const segment$ = getContext('segment');

  $: segment = $segment$;
</script>

<style lang="postcss">
  .header {
    position: relative;
    min-height: 200px;
    height: 50vh;
    margin-bottom: 2.07rem;
    text-transform: uppercase;
    user-select: none;
  }

  .header__container {
    position: sticky;
    top: 100px;
  }

  @media (min-width: 481px) {
    .header__container {
      display: flex;
      justify-content: space-between;
    }

    .header__info {
      text-align: right;
    }
  }

  .nav__breadcrumb {
    display: flex;
    align-items: center;
    min-height: 28px;

    & li {
      &:not(:last-child)::after {
        content: ' /';
        margin-right: 1ch;
      }

      &:last-child {
        display: flex;
        align-items: center;

        &::after {
          margin-left: 0.5ch;
          content: '►';
          font-size: 1.2em;
        }

        &:focus-within::after {
          visibility: hidden;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .nav {
      margin-bottom: 1rem;
    }

    .nav__menu li {
      margin-top: 0.6rem;
    }
  }

  .text-nav {
    position: relative;
    caret-color: transparent;
    user-select: text;

    &:focus {
      outline: none;

      &::before {
        content: '_';
        position: absolute;
        bottom: 0;
        left: calc(var(--caret-position, -9999) * 1ch);
        animation: blink 0.8s step-end infinite;
      }
    }
  }

  .tv-rec {
    display: inline-flex;
    align-items: center;

    & span {
      content: '';
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      margin-left: 0.5rem;
      background-color: #f00;
      box-shadow: 3px 0 0 var(--glitchy-blue), -3px 0 0 var(--glitchy-red);
      animation: blink 1.4s step-end infinite;
    }

    @nest :global(body:not(.using-camera)) & {
      display: none;
    }
  }
</style>

<header class="header">
  <div class="header__container">
    <nav class="nav">
      {#if !segment}
        <ul class="nav__breadcrumb">
          <li>CK</li>
        </ul>
        <!-- {% set navPages = collections.headerNav | eleventyNavigation("bio") %}
        <ul class="nav__menu">
          {%- for entry in navPages %}
            <li>
              <a href="{{ entry.url | url }}">{{ entry.title }}</a>
            </li>
          {%- endfor %}
        </ul> -->
      {:else}
        <!-- {% set navPages = collections.all | eleventyNavigationBreadcrumb(eleventyNavigation.key) %}
        <ul class="nav__breadcrumb">
          {%- for entry in navPages %}
            <li>
              <a href="{{ entry.url | url }}">{{ entry.title }}</a>
            </li>
          {%- endfor %}
          <li class="js-text-nav text-nav cursor-pointer" contenteditable role="textbox" aria-label="navigation by text" data-original-text="{{eleventyNavigation.key}}">{{eleventyNavigation.key}}</li>
        </ul> -->
      {/if}
    </nav>
    <div class="header__info">
      <div role="button" class="header__channel cursor-pointer js-channel-btn">
        CHANNEL <span class="js-channel-number">00</span>
      </div>
      <div class="js-header-date">JUL 2, 1993</div>
      <div class="tv-rec">REC <span /></div>
    </div>
  </div>
</header>
