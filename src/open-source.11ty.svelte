<script context="module">
  export const data = () => {
    return {
      layout: 'layouts/base.njk',
      tags: 'headerNav',
      // eleventyNavigation: {
      //   key: 'open-source',
      //   parent: 'bio',
      // },
      dataFn(data) {
        return {
          projects: data.projects,
        };
      },
    };
  };
</script>

<script>
  export let projects;
</script>

<article>
  <ul class="project-list">
    {#each projects.opensource as project}
      <li>
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          {project.name}
        </a>
        <small>{project.description}</small>
      </li>
    {/each}
  </ul>
</article>
