const live = 1;
const dead = 0;
let defaultNoOfCells=45;
let grid=null; 
let totalGenerations, n = defaultNoOfCells, currentGen = 1, toStop = false;
let customGrid = (size=n) => {
    clearTable(size,"seed");
    grid = initialize2dArray(size);
    dispGridAsTable(size, "seed");
    //allows user to select seed state
    var tbl = document.getElementById("seed");
    if (tbl != null) {
        for (let i = 0; i < tbl.rows.length; i++) {
            for (let j = 0; j < tbl.rows[i].cells.length; j++)
                tbl.rows[i].cells[j].onclick = () => {
                    if (grid[i][j] == live) {
                        grid[i][j] = dead;
                        tbl.rows[i].cells[j].className = "dead"
                    } else {
                        grid[i][j] = live;
                        tbl.rows[i].cells[j].className = "live"
                    }
                };
        }
    }
}
window.onload = customGrid(n);
function seedGrid(grid, n) {
    // Blinker
    grid[2][1] = live;
    grid[2][2] = live;
    grid[2][3] = live;

    /* // Glider
    grid[0][0] = dead;
    grid[0][1] = live;
    grid[0][2] = dead;;
    grid[1][0] = dead;
    grid[1][1] = dead;
    grid[1][2] = live;;
    grid[2][0] = live;
    grid[2][1] = live;
    grid[2][2] = live; */
}

function findLiveNeighbours(i, j, grid, n) {
    let ctr = 0;
    for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
            if (grid[i + k] && grid[i + k][j + l]) {
                ctr += grid[i + k][j + l];
            }
        }
    }
    ctr -= grid[i][j];
    return ctr;
}

function getNextState(i, j, n, grid) {
    let liveNeighbours = findLiveNeighbours(i, j, grid, n);
    let nextState = grid[i][j];
    if (grid[i][j] == live) {
        if (liveNeighbours < 2) {
            //underpopulation
            nextState = dead;
        } else if (liveNeighbours == 2 || liveNeighbours == 3) {
            //lives to next gen
            nextState = live;
        } else if (liveNeighbours > 3) {
            //overpopulation
            nextState = dead;
        }
    } else {
        if (liveNeighbours == 3) {
            //reproduction
            nextState = live;
        }
    }
    // nextState = liveNeighbours
    return nextState;
}

async function play() {
    resetGrid();
    n = document.getElementById("cells").value || defaultNoOfCells;
    totalGenerations = document.getElementById("totalGenerations").value||100000;
    clearTable(n);
    dispGridAsTable(n);
    currentGen = 1;
    continueGen();
}

async function next() {
    await updateGrid();
    currentGen++
}

function stop() {
    toStop = true;
}
function reset() {
    n = document.getElementById("cells").value || defaultNoOfCells;
    currentGen = 1;
    toStop = false;
    clearTable(n);
    clearTable(n,"seed");
    totalGenerations=0;
    document.getElementById("demo2").innerHTML = "";
    customGrid(n);
}
function resetGrid() {
    n = document.getElementById("cells").value || defaultNoOfCells;
    currentGen = 1;
    toStop = false;
    clearTable(n);
    totalGenerations=0;
    document.getElementById("demo2").innerHTML = "";
    // customGrid(n);
}
async function continueGen() {
    toStop = false;
    while (currentGen <= totalGenerations && !toStop) {
        await next();
    }
}

async function updateGrid() {
    let b = initialize2dArray(n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            b[i][j] = getNextState(i, j, n, grid);
        }
    }
    grid = b;
    document.getElementById("demo2").innerHTML = `Generation ${currentGen} of ${totalGenerations}`;
    clearTable(n);
    dispGridAsTable(n);
    await timeout(0.75 * 1000);
}

function dispGridAsTable(n, elemId = "grid") {

    let table = document.getElementById(elemId)

    for (let i = 0; i < n; i++) {
        var row = table.insertRow(i);
        for (let j = 0; j < n; j++) {
            let cell = row.insertCell(j);
            if (grid[i][j]) {
                cell.className = "live";
            } else {
                cell.className = "dead";
            }
        }
    }
}

function initialize2dArray(n) {
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

function clearTable(n, elemId = "grid") {
    let table = document.getElementById(elemId);
    table.innerHTML = ""
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}