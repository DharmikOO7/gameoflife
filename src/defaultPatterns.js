let compressPattern = (cells) => {
  //remove all rows with only 0s(dead)
  let compPattern = cells.filter((row) => row.indexOf(1) !== -1);
  const leftMostNonEmptyCol = compPattern
    .map((row) => row.indexOf(1))
    .reduce(
      (minIdx, curr) => (minIdx > curr ? curr : minIdx),
      compPattern[0].length - 1
    );
  console.log("leftMostNonEmptyCol", leftMostNonEmptyCol);
  const rightMostNonEmptyCol = compPattern
    .map((row) => row.lastIndexOf(1))
    .reduce((maxIdx, curr) => (maxIdx < curr ? curr : maxIdx), 0);
  console.log("rightMostNonEmptyCol", rightMostNonEmptyCol);
  //Set all values as undefined in columns containing only 0s(dead)
  for (let j = 0; j < leftMostNonEmptyCol; j++) {
    for (let i = 0; i < compPattern.length; i++) {
      compPattern[i][j] = undefined;
    }
  }
  for (let j = rightMostNonEmptyCol + 1; j < compPattern[0].length; j++) {
    for (let i = 0; i < compPattern.length; i++) {
      compPattern[i][j] = undefined;
    }
  }
  console.table(compPattern);
  /* for (let j = 0; j < compPattern[0].length; j++) {
    let isOnlyZeroes = true;
    for (let i = 0; i < compPattern.length; i++) {
      if (compPattern[i][j] === 1) {
        isOnlyZeroes = false;
        break;
      }
    }
    if (isOnlyZeroes) {
      for (let i = 0; i < compPattern.length; i++) {
        compPattern[i][j] = undefined;
      }
    }
  } */

  compPattern = compPattern.map((row) =>
    row.filter((cell) => cell === 0 || cell === 1)
  );
  console.table(compPattern);
  return compPattern;
};

let defaultPatternList = [
  {
    name: "Glider",
    rows: 3,
    columns: 3,
    data: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    name: "Blinker",
    rows: 1,
    columns: 3,
    data: [[1, 1, 1]],
  },
  {
    name: "Beacon",
    rows: 4,
    columns: 4,
    data: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
  },
  {
    name: "R-pentomino",
    rows: 3,
    columns: 3,
    data: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
];

module.exports = {
  defaultPatternList,
  compressPattern,
};
