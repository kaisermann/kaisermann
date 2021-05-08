import { canvas, ctx } from './canvas.js';
import { Particle } from './particles.js';
import { mouse } from './mouse.js';

class Grid {
  constructor() {
    this.numRows = 10;
    this.numCols = 10;
    this.cellSize = 30;

    // List of lists of cell data (put Particles here)
    this.cells = Array.from({
      length: this.numRows,
    }).map((_, i) => {
      return Array.from({
        length: this.numCols,
      }).map((_, j) => ({ i, j, particle: null }));
    });

    canvas.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    const [i, j] = mouse.gridPos;

    this.createParticle(i, j, 'sand');
  }

  createParticle(i, j, type) {
    const cell = this.cells[i][j];

    if (cell.particle == null) {
      cell.particle = new Particle(type);
    } else {
      console.log('No particle created :(');
    }
  }

  drawGridlines() {
    ctx.beginPath();
    ctx.strokeStyle = 'black';

    // Draw vertical lines
    for (let i = 0; i <= grid.numCols; i++) {
      ctx.moveTo(this.cellSize * i, 0);
      ctx.lineTo(this.cellSize * i, canvas.height);
    }

    // Draw horizontal lines
    for (let j = 0; j <= this.numRows; j++) {
      ctx.moveTo(0, this.cellSize * j);
      ctx.lineTo(canvas.width, this.cellSize * j);
    }

    ctx.stroke();
  }

  eachCell(fn) {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        fn(cell);
      });
    });
  }

  mapCell(fn) {
    this.cells.map((row) => {
      return row.map((cell) => {
        return fn(cell);
      });
    });
  }

  updatePosition(newCellsState, cell) {
    if (!cell.particle) return;
    const { particle } = cell;
    let newI = cell.i + particle.velX;
    let newJ = cell.j + particle.velY;

    if (newI >= this.numRows || newI < 0) newI = cell.i;
    if (newJ >= this.numCols || newJ < 0) newJ = cell.j;

    let newCell = newCellsState[newI][newJ];

    while (newI !== cell.i || newJ !== cell.j) {
      if (this.cells[newI][newJ].particle) {
        newI =
          particle.velX > 0 ? newI - 1 : particle.velX < 0 ? newI + 1 : newI;
        newJ =
          particle.velY > 0 ? newJ - 1 : particle.velY < 0 ? newJ + 1 : newJ;
      } else {
        break;
      }

      newCell = newCellsState[newI][newJ];
    }

    newCellsState[cell.i][cell.j].particle = null;
    newCell.particle = cell.particle;
  }

  applyGravity(particle) {
    particle.velY = 1;
  }

  updatePhysics() {
    this.eachCell((cell) => {
      if (!cell.particle) return;
      this.applyGravity(cell.particle);
    });

    const newCellsState = Array.from({
      length: this.numRows,
    }).map((_, i) => {
      return Array.from({
        length: this.numCols,
      }).map((_, j) => ({ i, j, particle: null }));
    });

    this.eachCell((cell) => {
      this.updatePosition(newCellsState, cell);
    });

    this.cells = newCellsState;
  }

  render() {
    this.updatePhysics();
    this.eachCell((cell) => {
      if (cell.particle) cell.particle.render(cell.i, cell.j);
    });
    this.drawGridlines();
  }
}

export function getGridPosition(x, y, ox = 0, oy = 0) {
  const i = Math.trunc((x - ox) / grid.cellSize);
  const j = Math.trunc((y - oy) / grid.cellSize);

  return [i, j];
}

export function paintCell(i, j, color) {
  ctx.fillStyle = color;

  ctx.fillRect(
    grid.cellSize * i,
    grid.cellSize * j,
    grid.cellSize,
    grid.cellSize,
  );
}

export const grid = new Grid();
