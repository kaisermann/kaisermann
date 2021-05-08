import { paintCell } from './grid';

export class Particle {
  constructor(type) {
    this.type = type;
    this.velX = 0;
    this.velY = 0;
  }

  getColor() {
    if (this.type === 'sand') {
      return 'yellow';
    }

    return 'lightblue';
  }

  render(i, j) {
    paintCell(i, j, this.getColor());
  }
}
