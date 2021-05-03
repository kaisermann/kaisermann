let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Number of grid divisions
const refNumColumns = 50;
const refNumRows = 50;

// Initialize mouse object at origin
let mouse = {
  absPos: [0, 0],
  gridPos: [0, 0],
  toolSize: Math.min(refNumRows, refNumColumns) / 10,
}

// Size of grid
let numColumns;
let numRows;

let cellSize;

const updateCanvasSize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get reference aspect ratio of canvas
  const colSize = canvas.width / refNumColumns;
  const rowSize = canvas.height / refNumRows;

  // Normalize size of grid
  cellSize = Math.min(colSize, rowSize);
  numColumns = Math.trunc(canvas.width / cellSize);
  numRows = Math.trunc(canvas.height / cellSize);

  return updateCanvasSize;
};

const updateMousePosition = (e) => {
  mouse.absPos[0] = e.clientX;
  mouse.absPos[1] = e.clientY;
};

const updateToolSizeonWheelScroll = (e) =>{
  // Inverting sign to make scroll up grow and scroll down shrink
  // Multiplying by 0.01 because deltaY returns huge numbers. Needs calibration for user experience.
  let delta = e.deltaY * -0.01;

  const newSize = mouse.toolSize + delta;
  const maxSize = Math.ceil(Math.max(numColumns / 2, numRows / 2));

  // Don't let toolsize exceed grid size (but let it completely span the screen, if centered)
  // Don't let toolsize be 0 or negative
  if (newSize <= maxSize && newSize > 0) 
    mouse.toolSize = newSize;
}

window.addEventListener("resize", updateCanvasSize());
window.addEventListener("mousemove", updateMousePosition);
window.addEventListener("wheel", updateToolSizeonWheelScroll);

function getGridPosition(x, y) {
  const i = Math.trunc(x / cellSize);
  const j = Math.trunc(y / cellSize);

  return [i, j];
}

function drawGridlines() {
  ctx.beginPath();
  ctx.strokeStyle = "black";

  // Draw vertical lines
  for (let i = 0; i <= numColumns; i++) {
    ctx.moveTo(cellSize * i, 0);
    ctx.lineTo(cellSize * i, canvas.height);
  }
  // Draw horizontal lines
  for (let j = 0; j <= numRows; j++) {
    ctx.moveTo(0, cellSize * j);
    ctx.lineTo(canvas.width, cellSize * j);
  }

  ctx.stroke();
}

function paintCell(i, j, color) {

  ctx.fillStyle = color;

  ctx.fillRect(
    cellSize * i,
    cellSize * j,
    cellSize,
    cellSize
  );
}

function paintCircle(ci, cj, radius, color){
// (x-x0)^2 + (y-y0)^2 = r^2
for (let i = 0; i <= numColumns; i++) {
  for (let j = 0; j <= numRows; j++) {
    // "Lesser than radius" + "greater or equal (radius - 1)" in continuous geometry is the same as "equal to (radius - 1)", 
    // but in discrete geometry "equal to" has discrete bias, failing in diagonals
    // This combination assures a full "circle" is drawn in grid-like coordinates
    const check1 = ((i - ci) ** 2 + (j - cj) ** 2 < (radius) ** 2);
    const check2 = ((i - ci) ** 2 + (j - cj) ** 2 >= (radius - 1) ** 2);
    if (check1 && check2) paintCell(i, j, color);
  }
}
}

function paintDisk(ci, cj, radius, color) {
  // (x-x0)^2 + (y-y0)^2 < r^2
  for (let i = 0; i <= numColumns; i++) {
    for (let j = 0; j <= numRows; j++) {
      const check = ((i - ci) ** 2 + (j - cj) ** 2 < (radius) ** 2);
      if (check) paintCell(i, j, color);
    }
  }
}

function paintMouseCell() {
  mouse.gridPos = getGridPosition(...mouse.absPos);

  // Paint mouse-over cell
  let toolSize = 60;
  paintDisk(...mouse.gridPos, mouse.toolSize, 'orange');
  paintCircle(...mouse.gridPos, mouse.toolSize, 'gold')
  paintCell(...mouse.gridPos, 'gold');
}

function loop() {
  requestAnimationFrame(loop);

  // Refresh canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGridlines();

  paintMouseCell();
}

loop();
