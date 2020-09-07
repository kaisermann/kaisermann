<script>
  import { toggleRemote } from '../tv.js';
</script>

<button class="remote-trigger cursor-pointer" on:click={() => toggleRemote()}>
  <img
    src="/assets/images/remote-control.svg"
    alt="remote"
    width="32"
    height="32" />
</button>
