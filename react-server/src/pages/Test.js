import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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

export default function App() {
  const [edfData, setEdfData] = useState([{}]);
  const [plotData, setPlotData] = useState([]);
  const [decimation, setDecimation] = useState([{}]);
  const [value, setValue] = React.useState([20, 37]);

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
    }
  }, [edfData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // chart
  const options = {
    animation: false,
    parsing: false,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    plugins: {
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
        // time: {
        //   unit: "hour",
        // },
      },
    },
  };
  const data = {
    datasets: [
      {
        borderColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 600);
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
  const handleDefault = () => {
    setDecimation({
      enabled: false,
      algorithm: "min-max",
    });
  };
  const handleMaxMin = () => {
    setDecimation({
      enabled: true,
      algorithm: "min-max",
    });
  };
  const handleLttb_50 = () => {
    setDecimation({
      enabled: true,
      algorithm: "lttb",
      samples: 300,
      threshold: 30,
    });
  };
  const handleLttb_500 = () => {
    setDecimation({
      enabled: true,
      algorithm: "lttb",
      samples: 500,
      threshold: 50,
    });
  };

  return (
    <div>
      <Button onClick={handleDefault}>No decimation</Button>
      <Button onClick={handleMaxMin}>min-max decimation</Button>
      <Button onClick={handleLttb_50}>LTTB decimation (50 samples)</Button>
      <Button onClick={handleLttb_500}>LTTB decimation (500 samples)</Button>
      <Line options={options} data={data} />
      <Box sx={{ width: "100%" }}>
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
        />
      </Box>
    </div>
  );
}
