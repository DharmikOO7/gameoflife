import React from "react";
import RandomPattern from "./slider";
import ReactDOM from "react-dom";
import "./index.css";
import Button from "@material-ui/core/Button";
const { nextGen, fillPattern, getRandomCell } = require("./helper");
const { defaultPatternList, compressPattern } = require("./defaultPatterns");

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
        noOfCells: props.noOfCells,
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
        key={i * this.props.noOfCells + j}
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
    this.state = {
      noOfCells: 25,
      currentPattern: null,
    };
    this.state = {
      patternExamples,
      currentPattern: null,
      noOfCells: this.state.noOfCells,
      cells: fillPattern(this.state.noOfCells, this.state.currentPattern),
      toPlay: 0,
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
    this.resizeGrid = this.resizeGrid.bind(this);
  }

  clearGrid() {
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfCells: state.noOfCells,
      cells: fillPattern(state.noOfCells, null),
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
      noOfCells: state.noOfCells,
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
      noOfCells: state.noOfCells,
      cells: state.cells,
      toPlay: state.toPlay,
      interval: state.interval,
      generation: state.generation,
    }));
  }

  upgradeGrid() {
    const [cells, isSameAsPrevGen] = nextGen(
      this.state.noOfCells,
      this.state.cells
    );
    let toPlay = this.state.toPlay;
    if (isSameAsPrevGen) {
      toPlay = false;
    }
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfCells: state.noOfCells,
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
      noOfCells: state.noOfCells,
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
      noOfCells: this.state.noOfCells,
      cells: fillPattern(this.state.noOfCells, currentPattern),
      toPlay: false,
      interval: this.state.interval,
      generation: 0,
    });
  }

  playOrPause(event) {
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: state.currentPattern,
      noOfCells: state.noOfCells,
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
          <div className="topBar" style={{ margin: "0.5rem 0.25rem" }}>
            <Load
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
        </div>
        <div id="game-grid" className="game-grid" style={{ float: "right" }}>
          <Grid
            currentPattern={this.state.currentPattern}
            noOfCells={this.state.noOfCells}
            cells={this.state.cells}
            toPlay={this.state.toPlay}
            handleCellClick={this.handleCellClick}
            upgradeGrid={this.upgradeGrid}
            interval={this.state.interval}
            generation={this.state.generation}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.resizeGrid();
    window.addEventListener("resize", this.resizeGrid);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeGrid);
  }

  resizeGrid() {
    //39.552px are subtracted due to margin
    const avlblWindowWidth = window.innerWidth - 39.552;
    let maxNoOfCells = 25;
    //20px is width of a cell
    let calcNoOfCells = Math.floor(avlblWindowWidth / 20) - 1;
    const noOfCells = Math.min(maxNoOfCells, calcNoOfCells);
    this.setState((state) => ({
      patternExamples: state.patternExamples,
      currentPattern: null,
      noOfCells,
      cells: fillPattern(noOfCells, state.currentPattern),
      toPlay: 0,
      interval: 0.5,
      generation: 0,
    }));
  }
}

class Load extends React.Component {
  render() {
    return (
      <label>
        <select
          style={{ margin: "0.25rem" }}
          defaultValue
          onChange={this.props.handleDropdownChange}
        >
          <option disabled value>
            Load a pattern
          </option>
          {this.props.patternExamples.map((pattern, i) => (
            <option key={i} value={i}>
              {pattern.name}
            </option>
          ))}
        </select>
      </label>
    );
  }
}

class Save extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onClick(this.state.value);
    this.setState({ value: "" });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ margin: "0.5rem 0.25rem" }}>
        <label>
          <input
            type="text"
            value={this.state.value}
            placeholder="Save pattern with name"
            style={{ marginRight: "0.25rem" }}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <button disabled={this.props.disabled || !this.state.value}>
            Save
          </button>
        </label>
      </form>
    );
  }
}

function Play(props) {
  return (
    <div className="playBar">
      <Button
        size="small"
        variant="contained"
        color="primary"
        // style={{ flex: 1, flexBasis: 0 }}
        onClick={props.playOrPause}
      >
        {props.toPlay ? "Pause" : "Play"}
      </Button>
      <Button
        size="small"
        variant="contained"
        color="primary"
        // style={{ flex: 1, flexBasis: 0}}
        disabled={Boolean(props.toPlay)}
        onClick={props.upgradeGrid}
      >
        Next Gen
      </Button>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={props.clearGrid}
      >
        Clear grid
      </Button>
    </div>
  );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
