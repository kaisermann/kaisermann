import { grid, paintCell, getGridPosition } from './grid.js';

// Initialize mouse object at origin
export const mouse = {
  absPos: [0, 0],
  gridPos: [0, 0],
  toolSize: 0, // Math.min(numRows, numColumns) / 10,
  render() {
    paintCircle(...mouse.gridPos, mouse.toolSize, 'gold');
    paintCell(...mouse.gridPos, 'gold');
  },
};

function paintCircle(ci, cj, radius, color) {
  // (x-x0)^2 + (y-y0)^2 = r^2
  for (let i = 0; i <= grid.numCols; i++) {
    for (let j = 0; j <= grid.numRows; j++) {
      // "Lesser than radius" + "greater or equal (radius - 1)" in continuous geometry is the same as "equal to (radius - 1)",
      // but in discrete geometry "equal to" has discrete bias, failing in diagonals
      // This combination assures a full "circle" is drawn in grid-like coordinates
      const check1 = (i - ci) ** 2 + (j - cj) ** 2 < radius ** 2;
      const check2 = (i - ci) ** 2 + (j - cj) ** 2 >= (radius - 1) ** 2;

      if (check1 && check2) paintCell(i, j, color);
    }
  }
}

const updateMousePosition = (e) => {
  mouse.absPos[0] = e.x;
  mouse.absPos[1] = e.y;
  mouse.gridPos = getGridPosition(...mouse.absPos);
};

const updateToolSizeonWheelScroll = (e) => {
  // Inverting sign to make scroll up grow and scroll down shrink
  // Multiplying by 0.01 because deltaY returns huge numbers. Needs calibration for user experience.
  const delta = e.deltaY * -0.01;

  const newSize = mouse.toolSize + delta;
  const maxSize = 15; // Math.ceil(Math.max(numColumns / 2, numRows / 2));

  // Don't let toolsize exceed grid size (but let it completely span the screen, if centered)
  // Don't let toolsize be 0 or negative
  if (newSize <= maxSize && newSize > 0) mouse.toolSize = newSize;
};

window.addEventListener('mousemove', updateMousePosition);
window.addEventListener('wheel', updateToolSizeonWheelScroll);
