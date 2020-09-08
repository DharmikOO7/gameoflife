import React from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";

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
    <div style={{margin:"0.5rem 0.25rem"}}>
      <span>
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
          style={{ width: "29ch", margin: "0 0.5rem" }}
        />
      </span>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Random pattern
      </Button>
    </div>
  );
}
