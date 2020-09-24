import React from "react";
import RandomPattern from "./slider";
import ReactDOM from "react-dom";
import "./index.css";
const { nextGen, fillPattern, getRandomCell } = require("./helper");
const { defaultPatternList, compressPattern } = require("./defaultPatterns");
const { Load, Save, Play, ResizeCells, Footer } = require("./menu");

function Cell(props) {
  return (
    <td className={`cell ${props.className}`} onClick={props.onClick}></td>
  );
}

class Grid extends React.Component {
  constructor(props) {
    console.log("Grid contructor again");
    super(props);
    /* this.state = {
      cells: props.cells,
    }; */
  }

  /* static getDerivedStateFromProps(props, state) {
    // console.log("getDerivedStateFromProps");
    if (props.currentPattern !== state.currentPattern) {
      return {
        noOfRows: props.noOfRows,
        currentPattern: props.currentPattern,
        cells: props.cells,
        toPlay: false,
      };
    }

    // Return null to indicate no change to state.
    return null;
  } */

  componentWillUnmount() {
    console.log("grid unmounted");
    clearInterval(this.interval);
  }

  renderCell(i, j) {
    return (
      <Cell
        key={i * this.props.noOfRows + j}
        value={this.props.cells[i][j]}
        onClick={() => this.props.handleCellClick(i, j)}
        className={this.props.cells[i][j] ? "live" : "dead"}
      />
    );
  }

  render() {
    if (this.props.toPlay) {
      clearInterval(this.interval);
      this.interval = setInterval(
        () => this.props.upgradeGrid(),
        this.props.interval * 1000
      );
    } else {
      clearInterval(this.interval);
    }
    return (
      <div>
        Generation #{this.props.generation}
        <table className="holder">
          <tbody>
            {this.props.cells.map((row, i) => {
              return (
                <tr className="grid-row" key={i}>
                  {row.map((col, j) => this.renderCell(i, j))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let patternExamples = localStorage.getItem("patternList");
    if (patternExamples) {
      patternExamples = JSON.parse(patternExamples);
    } else {
      patternExamples = defaultPatternList;
      localStorage.setItem("patternList", JSON.stringify(patternExamples));
    }
    const noOfRows = this.getNoOfRows();
    this.state = {
      noOfRows,
      currentPattern: null,
    };
    this.state = {
      patternExamples,
      currentPattern: null,
      noOfRows: this.state.noOfRows,
      cells: fillPattern(this.state.noOfRows, this.state.currentPattern),
      toPlay: false,
      interval: 0.5,
      generation: 0,
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.playOrPause = this.playOrPause.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.upgradeGrid = this.upgradeGrid.bind(this);
    this.savePattern = this.savePattern.bind(this);
    this.randomPattern = this.randomPattern.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.fitGridToWindow = this.fitGridToWindow.bind(this);
    this.resizeGrid = this.resizeGrid.bind(this);
  }

  clearGrid() {
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfRows: state.noOfRows,
      cells: fillPattern(state.noOfRows, null),
      toPlay: false,
      interval: state.interval,
      generation: 0,
    }));
  }

  randomPattern(probOfLive) {
    const cells = this.state.cells.slice();
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        cells[i][j] = getRandomCell(probOfLive);
      }
    }
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfRows: state.noOfRows,
      cells,
      toPlay: false,
      interval: state.interval,
      generation: 0,
    }));
  }

  savePattern(patternName) {
    const cells = this.state.cells.slice();
    let compPattern = compressPattern(cells);
    const customPattern = {
      name: patternName,
      rows: compPattern.length,
      columns: compPattern[0].length,
      data: compPattern,
    };
    let patternList = JSON.parse(localStorage.getItem("patternList"));
    patternList.push(customPattern);
    localStorage.setItem("patternList", JSON.stringify(patternList));
    this.setState((state) => ({
      patternExamples: patternList,
      currentPattern: state.currentPattern,
      noOfRows: state.noOfRows,
      cells: state.cells,
      toPlay: state.toPlay,
      interval: state.interval,
      generation: state.generation,
    }));
  }

  upgradeGrid() {
    const [cells, isSameAsPrevGen] = nextGen(
      this.state.noOfRows,
      this.state.cells
    );
    let toPlay = this.state.toPlay;
    if (isSameAsPrevGen) {
      toPlay = false;
    }
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfRows: state.noOfRows,
      cells,
      toPlay,
      interval: state.interval,
      generation: state.generation + 1,
    }));
  }

  handleCellClick(i, j) {
    const cells = this.state.cells.slice();
    cells[i][j] = 1 - cells[i][j];
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfRows: state.noOfRows,
      cells,
      toPlay: false,
      interval: state.interval,
      generation: 0,
    }));
  }

  handleDropdownChange(event) {
    const currentPattern = JSON.parse(
      JSON.stringify(this.state.patternExamples[event.target.value])
    );
    this.setState({
      patternExamples: this.state.patternExamples,
      currentPattern,
      noOfRows: this.state.noOfRows,
      cells: fillPattern(this.state.noOfRows, currentPattern),
      toPlay: false,
      interval: this.state.interval,
      generation: 0,
    });
  }

  playOrPause(event) {
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfRows: state.noOfRows,
      cells: state.cells,
      toPlay: !state.toPlay,
      interval: state.interval,
      generation: state.generation,
    }));
  }

  render() {
    return (
      <div className="game">
        <div className="menu">
          <div className="topBar" style={{ margin: "0.25rem" }}>
            <Load
              patternName={""}
              handleDropdownChange={this.handleDropdownChange}
              patternExamples={this.state.patternExamples}
            />
            <Play
              playOrPause={this.playOrPause}
              toPlay={this.state.toPlay}
              upgradeGrid={this.upgradeGrid}
              clearGrid={this.clearGrid}
            />
          </div>
          <Save disabled={this.state.toPlay} onClick={this.savePattern} />
          <RandomPattern randomPattern={this.randomPattern} />
          <ResizeCells
            key={this.state.noOfRows}
            resizeGrid={this.resizeGrid}
            noOfRows={this.state.noOfRows}
          />
        </div>
        <div id="game-grid" className="game-grid">
          <Grid
            currentPattern={this.state.currentPattern}
            noOfRows={this.state.noOfRows}
            cells={this.state.cells}
            toPlay={this.state.toPlay}
            handleCellClick={this.handleCellClick}
            upgradeGrid={this.upgradeGrid}
            interval={this.state.interval}
            generation={this.state.generation}
          />
        </div>
        <Footer />
      </div>
    );
  }

  componentDidMount() {
    this.fitGridToWindow();
    window.addEventListener("resize", this.fitGridToWindow);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.fitGridToWindow);
  }

  fitGridToWindow() {
    const noOfRows = this.getNoOfRows();
    if (noOfRows !== this.state.noOfRows) {
      this.resizeGrid(noOfRows);
    }
  }

  getNoOfRows(maxnoOfRows = 25) {
    //39.552px are subtracted due to margin
    const avlblWindowWidth = window.innerWidth - 39.552;
    // let maxnoOfRows = 25;
    //20px is width of a cell
    let calcnoOfRows = Math.floor(avlblWindowWidth / 20) - 1;
    const noOfRows = Math.min(maxnoOfRows, calcnoOfRows);
    return noOfRows;
  }

  resizeGrid(inpNoOfRows) {
    const noOfRows = this.getNoOfRows(inpNoOfRows);
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: null,
      noOfRows,
      cells: fillPattern(noOfRows, state.currentPattern),
      toPlay: false,
      interval: 0.5,
      generation: 0,
    }));
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
