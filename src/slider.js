import React from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
const { ResizeCells } = require("./menu");

const useStyles = makeStyles((theme) => ({
  randomPatternSlider: {
    margin: "0.5rem 0.25rem",
    display: "flex",
    flexWrap: "wrap",
    // justifyContent: "center",
    alignContent: "center",
  },
  randomPatternBtnAndRows: {
    margin: "0.5rem 0.25rem",
    display: "flex",
    // flexWrap: "wrap",
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
}));

export default function RandomPattern(props) {
  const [value, setValue] = React.useState(50);
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleSubmit(event) {
    event.preventDefault();
    props.randomPattern(value / 100);
  }

  return (
    <div className={classes.randomPatternSlider}>
      <div>
        <Typography id="continuous-slider" gutterBottom>
          Probability({value}%) of live cell
        </Typography>
        <Slider
          defaultValue={50}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          // getAriaValueText={valuetext}
          aria-labelledby="continuous-slider"
          min={0}
          max={100}
          style={{ width: "12.5rem", margin: "0 0.5rem" }}
        />
      </div>
      <div className={classes.randomPatternBtnAndRows}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Random pattern
        </Button>
        <ResizeCells
          key={props.noOfRows}
          resizeGrid={props.resizeGrid}
          noOfRows={props.noOfRows}
        />
      </div>
    </div>
  );
}
