<script>
  import { volume } from '../tv';

  function changeVol(n) {
    const newVol = $volume + n / 10;

    if (newVol > 1 || newVol < 0) return;

    $volume = newVol;
  }
</script>

<style>

</style>

<div class="remote" js-remote>
  <button>ON/OFF</button>
  <button on:click={() => changeVol(+0.5)}>VOL+</button>
  <button on:click={() => changeVol(-0.5)}>VOL-</button>
  <button>MUTE-</button>
  <button>CH +</button>
  <button>CH -</button>
</div>
