import { rafps } from './utils.js';
import { mouse } from './mouse.js';
import { canvas, ctx } from './canvas.js';
import { grid, paintCell } from './grid.js';

canvas.width = 300;
canvas.height = 300;

function paintDisk(ci, cj, radius, color) {
  // (x-x0)^2 + (y-y0)^2 < r^2
  for (let i = 0; i <= grid.numCols; i++) {
    for (let j = 0; j <= grid.numRows; j++) {
      const check = (i - ci) ** 2 + (j - cj) ** 2 < radius ** 2;

      if (check) paintCell(i, j, color);
    }
  }
}

rafps(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.render();

  mouse.render();
}, 24).play();
