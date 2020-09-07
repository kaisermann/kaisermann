<script context="module">
  export async function preload() {
    const res = await this.fetch('websites.json');
    const projects = await res.json();

    return { projects };
  }
</script>

<script>
  export let projects = [];
</script>

<article>
  <ul class="project-list">
    {#each projects as project}
      <li>
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          {project.name}
        </a>
        <small>{project.description}</small>
      </li>
    {/each}
  </ul>
</article>
