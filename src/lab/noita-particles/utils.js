export function rafps(draw, fps) {
  const delay = 1e3 / (fps || 60);
  let tmp;
  let pid;
  let last;
  let frame = -1;

  function loop(time) {
    if (!last) last = time;
    tmp = ((time - last) / delay) | 0;
    if (pid && tmp > frame) draw((frame = tmp));
    if (pid) pid = requestAnimationFrame(loop);
  }

  return {
    play() {
      if (!pid) pid = requestAnimationFrame(loop);
    },
    pause() {
      if (pid) {
        // eslint-disable-next-line no-multi-assign
        last = pid = cancelAnimationFrame(pid);
        frame = -1;
      }
    },
  };
}
