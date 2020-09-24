<script context="module">
  export const data = () => {
    return {
      layout: 'layouts/base.njk',
    };
  };
</script>

<style lang="postcss">
  .photo {
    position: relative;
    color: var(--text-secondary);

    &::after {
      content: '';
      display: block;
      position: absolute;
      z-index: var(--layer-me-hover);
      top: calc(100% + 1em);
      left: 1rem;
      width: 14rem;
      padding-bottom: 14rem;
      visibility: hidden;
      background-size: cover;
    }

    &:hover::after,
    &:focus::after {
      background-image: url(/assets/images/me.jpg);
      transition: visibility 0s 0.2s;
      visibility: visible;
    }
  }
</style>

<article class="bio">
  <p class="big-text">
    Hi! I'm <span class="photo" tabindex="0">Christian Kaisermann</span>, a web
    engineer, CSS enthusiast and<br />avid open-sourcerer. <br /><br /> Currently,
    I work at <a
      href="https://www.vtex.com/"
      target="_blank"
      rel="noopener noreferrer">VTEX</a> focused on improving the understandability
    of its codebase and the quality of its front-end infrastructure and workflow.
    <br /><br /> I'm a very outgoing and curious person, who's passionate about <a
      href="https://github.com/kaisermann"
      target="_blank"
      rel="noopener noreferrer">coding</a>, <a
      href="https://instagram.com/kiwistian"
      target="_blank"
      rel="noopener noreferrer">photography, nature, cats</a>, and <a
      href="https://www.last.fm/user/chrispif"
      target="_blank"
      rel="noopener noreferrer">music</a>. I love to stare at a <a
      href="https://justgetflux.com/"
      target="_blank"
      rel="noopener noreferrer">not-so-bright screen</a> while coding on a constant
    state of <a
      href="https://en.wikipedia.org/wiki/Flow_(psychology)"
      target="_blank"
      rel="noopener noreferrer">Flow</a>. Here are some <a
      href="/playlists">playlists</a> to get you going. <br /><br /> If you'd like
    to chat, feel free to <a
      href="https://calendly.com/kaisermann"
      target="_blank"
      rel="noopener noreferrer">schedule a call</a> or send me an <a
      href="mailto:christian@kaisermann.me">e-mail</a>.
  </p>
</article>
