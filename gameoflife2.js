const live = 1;
const dead = 0;
let classMap = { 0: "dead", 1: "live" };
let dim = document.getElementById("cells").value || 45;
let seedGrid = null;
let runningGrid = null;
const seedUIElemId = "seedUI";
const runUIElemId = "runUITable";
let currentGen = 1;
let totalGenerations = 10000;
let isRunning = false;
let iterDuration = 1;
window.onload = () => {
    seedGrid = initializeGridToDead(dim);
    dispUITable(seedGrid, seedUIElemId, dim);
    connectDataToUI(seedGrid, seedUIElemId, dim);
}

let playPause = async () => {
    let btn = document.getElementById("playPause");
    if (!isRunning) {
        toStop = true;
        currentGen = 1;
        runningGrid = seedGrid;
        dispUITable(runningGrid, runUIElemId, dim);
        isRunning = true;
        btn.innerText = "Pause";
        await continueGen();
    } else {
        isRunning = false;
        toStop = true;
        btn.innerText = "Play";
        pauseItrn();
    }
    return;

}

let continueGen = async () => {
    toStop = false;
    while (currentGen <= totalGenerations && !toStop) {
        await next();
    }
    return;
}

let next = async () => {
    updateGrid(dim);
    await timeout(iterDuration * 1000);
    return;
}

let updateGrid = (n) => {
    let b = initializeGridToDead(n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            b[i][j] = getNextState(i, j, n, runningGrid);
        }
    }
    runningGrid = b;
    document.getElementById("generationsCtr").innerHTML = `Generation ${currentGen++} of ${totalGenerations}`;
    dispUITable(runningGrid, runUIElemId, n);
    iterDuration = document.getElementById("iterDuration").value || 1;
    if (!(iterDuration > 0)) {
        iterDuration = 1;
    }
    return;
}

let pauseItrn = () => {
    toStop = true;
    return;
}

let resetRunGrid = () => {
    runningGrid = initializeGridToDead(dim);
    dispUITable(runningGrid, runUIElemId, dim);
    currentGen = 1;
    pauseItrn();
    isRunning = false;
    document.getElementById("playPause").innerText = "Play";
    return;
}

let reset = () => {
    seedGrid = initializeGridToDead(dim);
    runningGrid = initializeGridToDead(dim);
    dispUITable(seedGrid, seedUIElemId, dim);
    dispUITable(runningGrid, runUIElemId, dim);
    currentGen = 1;
    pauseItrn();
    isRunning = false;
    document.getElementById("playPause").innerText = "Play";
    return;
}

let findLiveNeighbours = (i, j, dataGrid, n) => {
    let ctr = 0;
    // let size=n-1;
    for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
            // if (grid[i + k] && grid[i + k][j + l]) {
            let x = (i + k) % n;
            let y = (j + l) % n;
            if (x < 0) {
                x = n + x;
            }
            if (y < 0) {
                y = n + y;
            }
            ctr += dataGrid[x][y];
        }
    }
    ctr -= dataGrid[i][j];
    return ctr;
}

let getNextState = (i, j, n, dataGrid) => {
    let liveNeighbours = findLiveNeighbours(i, j, dataGrid, n);
    let nextState = dataGrid[i][j];
    if (dataGrid[i][j] == live) {
        if (liveNeighbours < 2) {
            nextState = dead;   //underpopulation
        } else if (liveNeighbours == 2 || liveNeighbours == 3) {
            nextState = live;   //lives to next gen
        } else if (liveNeighbours > 3) {
            nextState = dead;   //overpopulation
        }
    } else {
        if (liveNeighbours == 3) {
            nextState = live;   //reproduction
        }
    }
    // nextState = liveNeighbours
    return nextState;
}

let initializeGridToDead = (n) => {
    let a = new Array(n);
    for (let i = 0; i < n; i++) {
        a[i] = new Array(n);
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            a[i][j] = dead;
        }
    }
    return a;
}
let dispUITable = (dataGrid, uiElemId, n) => {
    let uitable = document.getElementById(uiElemId)
    for (let i = 0; i < n; i++) {
        //get row or create row if doesn't exist
        var row = uitable.rows[i] || uitable.insertRow(i);
        for (let j = 0; j < n; j++) {
            //get cell of current cell or create cell if doesn't exist
            let cell = row.cells[j] || row.insertCell(j);
            cell.className = classMap[dataGrid[i][j]];
        }
    }
    return;
}
let connectDataToUI = (dataGrid, uiElemId, n) => {
    let uitable = document.getElementById(uiElemId);
    const rowAll = document.querySelectorAll(`#${uiElemId} tr`);
    const rowsArray = Array.from(rowAll);
    uitable.addEventListener('mousedown', e => {
        const rowIndex = rowsArray.findIndex(row => row.contains(e.target));
        const columns = Array.from(rowsArray[rowIndex].querySelectorAll('td'));
        const columnIndex = columns.findIndex(column => column == e.target);
        // console.log(`Started in ${rowIndex}, ${columnIndex}`);
        setStateHelper(dataGrid, uitable, rowIndex, columnIndex);
    });
    return;
}

let setStateHelper = (dataGrid, uiTbl, i, j) => {
    //flip state
    dataGrid[i][j] = live - dataGrid[i][j];
    uiTbl.rows[i].cells[j].className = classMap[dataGrid[i][j]];
    return;
}

let timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}