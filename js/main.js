let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clear-sand");
// get controllers
let sandController = document.getElementById("sand");
let staticController = document.getElementById("static");
let clearController = document.getElementById("eraser");
let dirtController = document.getElementById("dirt");
let waterController = document.getElementById("water");
let brushSizeController = document.getElementById("brush-size");

let lineBrushController = document.getElementById("line-brush");

const GRAIN_SIZE = 5;
let grid;
let cols, rows;
let brushSize = 1;
let action = '';

let startingPoint = null;

function mouseDrag(e, value, brushSize = 1) {
  e.preventDefault();
  console.log('AAAAAAAA', action);
  if (action === 'line') {
    console.log('AAAAAAAA line');
    return;
  }
  let offsetX, offsetY;
  if (e.touches) {
    offsetX = e.touches[0].pageX - e.target.offsetLeft;
    offsetY = e.touches[0].pageY - e.target.offsetTop;
  } else {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  }
  let mouseColumn = Math.floor(offsetX / GRAIN_SIZE);
  let mouseRow = Math.floor(offsetY / GRAIN_SIZE);

  let matrix = brushSize;
  let halfMatrix = Math.floor(matrix / 2);
  for (let i = -halfMatrix; i <= halfMatrix; i++) {
    for (let j = -halfMatrix; j <= halfMatrix; j++) {
      if (Math.random() < 0.5) {
        let x = mouseColumn + i;
        let y = mouseRow + j;
        if (Math.sqrt(i * i + j * j) <= halfMatrix && x >= 0 && x < cols && y >= 0 && y < rows) {
          grid[x][y] = value;
        }
      }
    }
  }
}

function createGrid(cols, rows) {
  let grid = new Array(cols);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = 0;
    }
  }
  return grid;
}

function setup() {
  let width = canvas.width;
  let height = canvas.height;
  cols = width / GRAIN_SIZE;
  rows = height / GRAIN_SIZE;
  grid = createGrid(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
    }
  }
}

function draw() {
  const colorMap = {
    0: "#000",
    1: "#F6D7B0",
    2: "#ffffff",
    3: "#8B4513"
  };

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      ctx.fillStyle = colorMap[grid[i][j]];
      ctx.fillRect(i * GRAIN_SIZE, j * GRAIN_SIZE, GRAIN_SIZE, GRAIN_SIZE);
    }
  }

  let nextGrid = createGrid(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      let currentCell = grid[i][j];
      if (currentCell == 1) {
        let dir = Math.round(Math.random()) * 2 - 1;
        let bellowRight, bellowLeft, leftCell, rightCell;
        if (i + dir >= 0 && i + dir <= cols - 1) {
          bellowRight = grid[i + dir][j + 1];
        }
        if (i - dir >= 0 && i - dir <= cols - 1) {
          bellowLeft = grid[i - dir][j + 1];
        }
        if (i - dir >= 0 && grid[i - dir]) {
          leftCell = grid[i - dir][j];
        }
        if (i + dir <= cols - 1 && grid[i + dir]) {
          rightCell = grid[i + dir][j];
        }
        let bellowCell = grid[i][j + 1];
        if (j == rows - 1) {
          nextGrid[i][j] = 1;
        } else if (bellowCell == 0) {
          nextGrid[i][j + 1] = 1;
        } else if (bellowLeft == 0 && leftCell == 0) {
          nextGrid[i - dir][j + 1] = 1;
        } else if (bellowRight == 0 && rightCell == 0) {
          nextGrid[i + dir][j + 1] = 1;
        } else {
          nextGrid[i][j] = 1;
        }
      } else if (currentCell == 2) {
        nextGrid[i][j] = 2;
      } else if (currentCell == 3) {
        let bellowCell = grid[i][j + 1];
        if (j == rows - 1) {
          nextGrid[i][j] = 3;
        } else if (bellowCell == 0) {
          nextGrid[i][j + 1] = 3;
        } else {
          nextGrid[i][j] = 3;
        }
      } 
    }
  }
  grid = nextGrid;
}

function getMousePos(e) {
  let offsetX, offsetY;
  if (e.touches) {
    offsetX = e.touches[0].pageX - e.target.offsetLeft;
    offsetY = e.touches[0].pageY - e.target.offsetTop;
  } else {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  }
  let mouseColumn = Math.floor(offsetX / GRAIN_SIZE);
  let mouseRow = Math.floor(offsetY / GRAIN_SIZE);
  return { x: mouseColumn, y: mouseRow };
}

function startAction(e) {
  if (lineBrushController.checked) {
    startingPoint = getMousePos(e);
    action = 'line';
    return;
  }
  if (sandController.checked) {
    action = 'sand';
  } else if (staticController.checked) {
    action = 'static';
  } else if (clearController.checked) {
    action = 'clear';
  } else if (dirtController.checked) {
    action = 'dirt';
  }
}

function moveAction(e) {
  if (action === 'line') {
    if (startingPoint) {
      let endPoint = getMousePos(e);
      drawLine(startingPoint, endPoint, 0);
    }
    return;
  }
  brushSize = brushSizeController.value;
  if (action === 'sand') {
    mouseDrag(e, 1, brushSize);
  } else if (action === 'static') {
    mouseDrag(e, 2, brushSize);
  } else if (action === 'clear') {
    mouseDrag(e, 0, brushSize);
  } else if (action === 'dirt') {
    mouseDrag(e, 3, brushSize);
  } else {
    return;
  }
}

function endAction(e) {
  if (startingPoint) {
    let endPoint = getMousePos(e);
    drawLine(startingPoint, endPoint, 2); // Desenha uma linha
    startingPoint = null;
  }
  action = '';
}

function drawLine(pointA, pointB, value) {
  let dx = Math.abs(pointB.x - pointA.x);
  let dy = Math.abs(pointB.y - pointA.y);
  let sx = (pointA.x < pointB.x) ? 1 : -1;
  let sy = (pointA.y < pointB.y) ? 1 : -1;
  let err = dx - dy;

  let x = pointA.x;
  let y = pointA.y;
  while (true) {
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      if (grid[x][y] !== 2) 
        grid[x][y] = value;
    }
    if (x === pointB.x && y === pointB.y) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return grid;
}

canvas.addEventListener("mousedown", startAction);
canvas.addEventListener("mousemove", moveAction);
canvas.addEventListener("mouseup", endAction);

canvas.addEventListener("touchstart", startAction);
canvas.addEventListener("touchmove", moveAction);
canvas.addEventListener("touchend", endAction);

clearButton.addEventListener("click", function () {
  setup();
});

function init() {
  setup();
  setInterval(draw, 1000 / 60);
}

init();
