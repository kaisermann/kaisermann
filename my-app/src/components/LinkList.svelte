<script>
  export let links = [];
</script>

<ul class="link-list">
  {#each links as { url, label, external = false}}
    <li>
      <a href={url} rel={external ? "noopener noreferrer" : "preload"}
      target={external ? "_blank" : "_self" }>{label}</a>
    </li>
  {/each}
</ul>
