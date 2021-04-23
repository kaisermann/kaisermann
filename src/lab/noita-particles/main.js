const MOUSE = {
  position: null,
};

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

function loop() {
  window.requestAnimationFrame(loop);
  ctx;
}

function updateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);

canvas.addEventListener('mousemove', (e) => {
  MOUSE.position = [e.clientX, e.clientY];
});

/** start loop */
window.requestAnimationFrame(loop);
