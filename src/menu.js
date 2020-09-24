import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "8rem",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
}));

function Load(props) {
  const classes = useStyles();
  const [patternName, setPattern] = React.useState(props.patternName);

  const handleChange = (event) => {
    setPattern(event.target.value);
    if (event.target.value !== "") {
      props.handleDropdownChange(event);
    }
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="pattern-select-label">Load a pattern</InputLabel>
      <Select
        labelId="pattern-select-label"
        // style={{ margin: "0.25rem", minWidth: "120px" }}
        value={patternName}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {props.patternExamples.map((pattern, i) => (
          <MenuItem key={i} value={i}>
            {pattern.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
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
      <form className="saveForm" style={{ margin: "0.5rem 0.25rem" }}>
        <TextField
          type="text"
          value={this.state.value}
          label="Save pattern"
          style={{ marginRight: "0.25rem" }}
          onChange={this.handleChange}
          disabled={this.props.disabled}
          variant="outlined"
          size="small"
        />
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={this.props.disabled || !this.state.value}
          onClick={this.handleSubmit}
        >
          Save
        </Button>
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

class ResizeCells extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.noOfRows,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    const value = parseInt(e.target.value);
    this.setState({ value });
  }

  handleBlur(e) {
    const inputRows = parseInt(e.target.value);
    this.setState({ value: inputRows });
    if (inputRows && inputRows > 0) {
      this.props.resizeGrid(inputRows);
    }
  }

  render() {
    return (
      <div
        id="resize-cells"
        className="resize-cells"
        style={{
          margin: "0.5rem 0.25rem",
          alignContent: "center",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <TextField
          type="number"
          label="No. of rows"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          variant="outlined"
          size="small"
        />
      </div>
    );
  }
}

function Footer(props) {
  return (
    <div
      id="footer"
      className="footer"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <span>
        Source code:{" "}
        <a
          href="https://github.com/DharmikOO7/gameoflife"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </span>
      <span>
        More Info:{" "}
        <a
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wiki
        </a>
      </span>
    </div>
  );
}

export { Load, Save, Play, ResizeCells, Footer };
