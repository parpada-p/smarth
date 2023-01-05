import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DateTime } from "luxon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Hypnogram(props) {
  const [edfData, setEdfData] = useState([{}]);
  const [plotData, setPlotData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [decimation, setDecimation] = useState([{}]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    fetch("/hypnogramData")
      .then((res) => res.json())
      .then((data) => {
        setEdfData(data.edfData[0]);
      });
  }, []);
  useEffect(() => {
    if (edfData.data !== undefined) {
      setPlotData(edfData.data);
    }
  }, [edfData.data]);
  useEffect(() => {
    if (edfData.labels !== undefined) {
      setLabels(edfData.labels);
    }
  }, [edfData.labels]);

  //Slider
  function valuetext(value) {
    let valueStr = "";
    if (labels != undefined && labels.length > 1) {
      valueStr = labels[value];
    }

    return valueStr;
  }
  const handleSliderChange = (event, newValue) => {
    fetch("/hypnogramFilter/P0003/" + newValue[0] + "/" + newValue[1])
      .then((res) => res.json())
      .then((data) => {
        setEdfData(data.edfData[0]);
      });
  };

  // chart
  const handleDefault = () => {
    setDecimation({
      enabled: false,
      algorithm: "min-max",
    });
  };
  const handleLttb_30 = () => {
    setDecimation({
      enabled: true,
      algorithm: "lttb",
      samples: 432,
      threshold: 43,
    });
  };
  const handleLttb_50 = () => {
    setDecimation({
      enabled: true,
      algorithm: "lttb",
      samples: 720,
      threshold: 72,
    });
  };
  const options = {
    animation: false,
    parsing: false,
    responsive: true,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      decimation: decimation,
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            if (value == 0) {
              return "AWAKE";
            } else if (value == -1) {
              return "REM";
            } else if (value == -2) {
              return "N1";
            } else if (value == -3) {
              return "N2";
            } else if (value == -4) {
              return "N3";
            }
          },
        },
      },
      x: {
        display: false,
        type: "time",
      },
    },
  };
  const data = {
    datasets: [
      {
        borderColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#264653");
          gradient.addColorStop(0.25, "#2a9d8f");
          gradient.addColorStop(0.5, "#e9c46a");
          gradient.addColorStop(0.75, "#f4a261");
          gradient.addColorStop(1, "#e76f51");
          return gradient;
        },
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
        data: plotData,
        label: "Large Dataset",
        radius: 0,
        stepped: true,
      },
    ],
  };

  // TODO:
  //  #Responsive
  //  #Chart heigth
  //    ##Dashboard: height="120%"
  //    ##EDFViewer: height="20%"
  //  #Chart gradient
  //    ##Dashboard: ctx.createLinearGradient(0, 0, 0, 400);
  //    ##EDFViewer: ctx.createLinearGradient(0, 0, 0, 80);
  return (
    <React.Fragment>
      <Box>
        {plotData != undefined && plotData.length > 0 ? (
          <Line height="120%" options={options} data={data} />
        ) : null}
        <br></br>
        <br></br>
        {labels != undefined && labels.length > 0 ? (
          <Slider
            min={0}
            step={1}
            max={labels.length - 1}
            getAriaLabel={() => "Measurement date"}
            getAriaValueText={valuetext}
            valueLabelFormat={valuetext}
            defaultValue={[0, labels.length - 1]}
            valueLabelDisplay="auto"
            sx={{ width: "95%", marginLeft: 7 }}
            onChange={handleSliderChange}
          />
        ) : null}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={handleDefault}>No decimation</Button>
          <Button onClick={handleLttb_30}>LTTB decimation (30% samples)</Button>
          <Button onClick={handleLttb_50}>LTTB decimation (50% samples)</Button>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
