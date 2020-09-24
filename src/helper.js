const live = 1,
  dead = 0;
function findLiveNeighbours(i, j, grid, n) {
  let ctr = 0;
  // let size=n-1;
  for (let k = -1; k < 2; k++) {
    for (let l = -1; l < 2; l++) {
      // if (grid[i + k] && grid[i + k][j + l]) {
      let x = (i + k) % n;
      let y = (j + l) % n;
      // console.log(i,j);
      // console.log(x,y);
      if (x < 0) {
        // console.log(x);
        x = n + x;
        // console.log(x);
      }
      if (y < 0) {
        y = n + y;
        // console.log(y);
      }
      // console.log(grid);
      ctr += grid[x][y];
      // }
    }
  }
  ctr -= grid[i][j];
  return ctr;
}

function getNextState(i, j, n, grid) {
  let liveNeighbours = findLiveNeighbours(i, j, grid, n);
  let nextState = grid[i][j];
  if (grid[i][j] === live) {
    if (liveNeighbours < 2) {
      //underpopulation
      nextState = dead;
    } else if (liveNeighbours === 2 || liveNeighbours === 3) {
      //lives to next gen
      nextState = live;
    } else if (liveNeighbours > 3) {
      //overpopulation
      nextState = dead;
    }
  } else {
    if (liveNeighbours === 3) {
      //reproduction
      nextState = live;
    }
  }
  // nextState = liveNeighbours
  return nextState;
}

function nextGen(n, grid) {
  let nextGen = initialize2dArray(n);
  let isSameAsPrevGen = true;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      nextGen[i][j] = getNextState(i, j, n, grid);
      if (isSameAsPrevGen && nextGen[i][j] !== grid[i][j]) {
        isSameAsPrevGen = false;
      }
    }
  }
  return [nextGen, isSameAsPrevGen];
}

function fillPattern(noOfRows, pattern) {
  let cells = initialize2dArray(noOfRows);
  if (!pattern || pattern.rows > noOfRows || pattern.columns > noOfRows) {
    return cells;
  }
  const gridCenter = [Math.floor(noOfRows / 2), Math.floor(noOfRows / 2)];
  const patternCenter = [
    Math.floor(pattern.rows / 2),
    Math.floor(pattern.columns / 2),
  ];
  const [rowStart, colStart] = [
    gridCenter[0] - patternCenter[0],
    gridCenter[1] - patternCenter[1],
  ];
  // console.log("rowStart, colStart", rowStart, colStart);
  for (let i = 0, gridRowCtr = rowStart; i < pattern.rows; i++, gridRowCtr++) {
    for (
      let j = 0, gridColCtr = colStart;
      j < pattern.columns;
      j++, gridColCtr++
    ) {
      cells[gridRowCtr][gridColCtr] = pattern.data[i][j];
    }
  }
  return cells;
}

function initialize2dArray(n) {
  return Array.from({length: n}, e => Array(n).fill(0));;
}

function getRandomInt(val) {
  const rand = Math.random();
  if (rand < parseFloat(val)) {
    return 1;
  } else {
    return 0;
  }
  // return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
  initialize2dArray,
  nextGen,
  fillPattern,
  getRandomCell: getRandomInt,
};
