import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

export default function App() {
  const [edfData, setEdfData] = useState([{}]);
  const [plotData, setPlotData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [value, setValue] = useState([10, 20]);

  function valuetext(value) {
    let valueStr = "";
    if (labels != undefined && labels.length > 1) {
      valueStr = labels[value - 1];
    }

    return valueStr;
  }

  useEffect(() => {
    fetch("/test")
      .then((res) => res.json())
      .then((data) => {
        setEdfData(data.edfData[0]);
      });
  }, []);
  useEffect(() => {
    if (edfData !== undefined) {
      setPlotData(edfData.data);
      setLabels(edfData.labels);
    }
  }, [edfData]);

  return (
    <Box sx={{ width: 250, p: 1 }}>
      <Typography id="non-linear-slider" gutterBottom>
        Storage: {value}
      </Typography>
      {/* <Slider
        value={value}
        min={1}
        step={1}
        max={1439}
        scale={calculateValue}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      /> */}
      <Slider
        min={1}
        step={1}
        max={1439}
        getAriaLabel={() => "Measurement date"}
        getAriaValueText={valuetext}
        valueLabelFormat={valuetext}
        defaultValue={[1, 1439]}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}
