<script>
  import LinkList from './LinkList.svelte';

  const links = [
    { url: '/resume', label: 'RESUME' },
    { url: 'mailto:christian@kaisermann.me', label: 'EMAIL' },
    { url: 'https://twitter.com/kiwistian', label: 'TWITTER' },
    { url: 'https://linkedin.com/in/kaisermann', label: 'LINKEDIN' },
  ];
</script>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    align-self: flex-end;
    margin-top: 160px;
    padding-bottom: var(--gui-bottom);
  }
</style>

<footer id="footer">
  <LinkList {links} />
</footer>
