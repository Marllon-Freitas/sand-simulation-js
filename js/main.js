let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clear-sand");
const GRAIN_SIZE = 10;
let grid;
let cols, rows;

function mouseDrag(e) {
  let x = Math.floor(e.offsetX / GRAIN_SIZE);
  let y = Math.floor(e.offsetY / GRAIN_SIZE);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[x][y] = 1;
  }
}

function removeCell(e) {
  let x = Math.floor(e.offsetX / GRAIN_SIZE);
  let y = Math.floor(e.offsetY / GRAIN_SIZE);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[x][y] = 0;
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
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      let x = i * GRAIN_SIZE;
      let y = j * GRAIN_SIZE;
      if (grid[i][j] == 0) {
        ctx.fillStyle = "#000";
      } else {
        ctx.fillStyle = "#F6D7B0";
      }
      ctx.fillRect(x, y, GRAIN_SIZE, GRAIN_SIZE);
    }
  }

  let nextGrid = createGrid(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      let currentCell = grid[i][j];
      if (currentCell == 1) {
        let dir = Math.round(Math.random()) * 2 - 1;
        let bellowRight, bellowLeft;
        if (i + dir >= 0 && i + dir <= cols - 1) {
          bellowRight = grid[i + dir][j + 1];
        }
        if (i - dir >= 0 && i - dir <= cols - 1) {
          bellowLeft = grid[i - dir][j + 1];
        }
        let bellowCell = grid[i][j + 1];
        if (j == rows - 1) {
          nextGrid[i][j] = 1;
        } else if (bellowCell == 0) {
          nextGrid[i][j + 1] = 1;
        } else if (bellowLeft == 0) {
          nextGrid[i - dir][j + 1] = 1;
        } else if (bellowRight == 0) {
          nextGrid[i + dir][j + 1] = 1;
        } else {
          nextGrid[i][j] = 1;
        }
      }
    }
  }

  grid = nextGrid;
}

function init() {
  setup();
  let mouseDown = false;
  let mouseDelete = false;
  canvas.addEventListener("mousedown", function (e) {
    switch (e.buttons) {
      case 1:
        mouseDown = true;
        mouseDrag(e);
        break;
      case 4:
        mouseDelete = true;
        removeCell(e);
        break;
      default:
        break;
    }
  });

  canvas.addEventListener("mousemove", function (e) {
    if (mouseDown) {
      mouseDrag(e);
    }
    if (mouseDelete) {
      removeCell(e);
    }
  });

  canvas.addEventListener("mouseup", function (e) {
    mouseDown = false;
    mouseDelete = false;
  });
  setInterval(draw, 30);
}

init();

clearButton.addEventListener("click", function () {
  setup();
});
