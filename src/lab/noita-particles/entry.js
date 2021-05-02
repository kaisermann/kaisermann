let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const mouse = [0, 0];

// Number of grid divisions
const refNumColumns = 20;
const refNumRows = 20;

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
  mouse[0] = e.clientX;
  mouse[1] = e.clientY;
};

window.addEventListener("resize", updateCanvasSize());
window.addEventListener("mousemove", updateMousePosition);

function getGridPosition(x, y) {
  const i = Math.trunc(x / cellSize);
  const j = Math.trunc(y / cellSize);

  return [i, j];
}

function drawGridlines(){
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

function paintCell(i, j, color){

  ctx.fillStyle = color;

  ctx.fillRect(
    cellSize * i,
    cellSize * j,
    cellSize,
    cellSize
  );
}

function paintMouseCell(){
  let mouseGridPos = getGridPosition(...mouse);

  // Paint mouse-over cell
  paintCell(...mouseGridPos, 'gold');
}

function loop() {
  requestAnimationFrame(loop);

  // Refresh canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGridlines();

  paintMouseCell();
}

loop();
