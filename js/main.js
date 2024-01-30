let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clear-sand");
// get controllers
let sandController = document.getElementById("sand");
let staticController = document.getElementById("static");
let clearController = document.getElementById("eraser");
let dirtController = document.getElementById("dirt");
let waterController = document.getElementById("water");

const GRAIN_SIZE = 10;
let grid;
let cols, rows;

function mouseDrag(e, value) {
  let x = Math.floor(e.offsetX / GRAIN_SIZE);
  let y = Math.floor(e.offsetY / GRAIN_SIZE);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[x][y] = value;
  }
}

// function createStaticStructure(e) {
//   let x = Math.floor(e.offsetX / GRAIN_SIZE);
//   let y = Math.floor(e.offsetY / GRAIN_SIZE);
//   if (x >= 0 && x < cols && y >= 0 && y < rows) {
//     grid[x][y] = 2;
//   }
// }

// function removeCell(e) {
//   let x = Math.floor(e.offsetX / GRAIN_SIZE);
//   let y = Math.floor(e.offsetY / GRAIN_SIZE);
//   if (x >= 0 && x < cols && y >= 0 && y < rows) {
//     grid[x][y] = 0;
//   }
// }

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
      } else if (grid[i][j] == 1) {
        ctx.fillStyle = "#F6D7B0";
      } else if (grid[i][j] == 2) {
        ctx.fillStyle = "#0000FF";
      } else if (grid[i][j] == 3) {
        ctx.fillStyle = "#8B4513";
      }
      ctx.fillRect(x, y, GRAIN_SIZE, GRAIN_SIZE);
    }
  }
  let direction = 1;
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

function init() {
  setup();
  let mouseAction = '';
  canvas.addEventListener("mousedown", function (e) {
    if (sandController.checked) {
      mouseAction = 'sand';
    } else if (staticController.checked) {
      mouseAction = 'static';
    } else if (clearController.checked) {
      mouseAction = 'clear';
    } else if (dirtController.checked) {
      mouseAction = 'dirt';
    } else if (waterController.checked) {
      mouseAction = 'water';
    }
  });

  canvas.addEventListener("mousemove", function (e) {
    if (mouseAction === 'sand') {
      mouseDrag(e, 1);
    } else if (mouseAction === 'static') {
      mouseDrag(e, 2);
    } else if (mouseAction === 'clear') {
      mouseDrag(e, 0);
    } else if (mouseAction === 'dirt') {
      mouseDrag(e, 3);
    } else if (mouseAction === 'water') {
      mouseDrag(e, 4);
    }
  });

  canvas.addEventListener("mouseup", function (e) {
    mouseAction = '';
  });
  setInterval(draw, 30);
}

init();

clearButton.addEventListener("click", function () {
  setup();
});
