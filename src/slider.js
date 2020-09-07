import React from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

export default function RandomPattern(props) {
  const [value, setValue] = React.useState(50);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleSubmit(event) {
    event.preventDefault();
    props.randomPattern(value / 100);
  }

  return (
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
      />
      <button style={{ float: "left" }} onClick={handleSubmit}>
        Random pattern
      </button>
    </div>
  );
}
