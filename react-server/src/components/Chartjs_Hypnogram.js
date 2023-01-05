import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportHypnogram(props) {
  const h = 100 / (props.n / (props.n - 1));
  const h_str = String(h) + "%";
  console.log(h_str);

  const [hypnogramData, setHypnogramData] = useState([{}]);
  const [plotData, setPlotData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [decimation, setDecimation] = useState([{}]);
  const [value, setValue] = useState([]);

  //Hypnogram data
  useEffect(() => {
    fetch("/reportHypnogram/P0003_24062022_025830.edf/0/4")
      .then((res) => res.json())
      .then((data) => {
        setHypnogramData(data.hypnogramData[0]);
      });
  }, []);
  useEffect(() => {
    if (hypnogramData.data !== undefined) {
      setPlotData(hypnogramData.data);
    }
  }, [hypnogramData.data]);
  useEffect(() => {
    if (hypnogramData.labels !== undefined) {
      setLabels(hypnogramData.labels);
    }
  }, [hypnogramData.labels]);
  //Hypnogram chart
  const sleepCycleOptions = {
    maintainAspectRatio: false,
    responsive: true,
    animation: false,
    parsing: false,
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
      title: {
        display: true,
        text: "Sleep Cycle",
        position: "left",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            if (value === 0) {
              return "AWAKE";
            } else if (value === -1) {
              return "REM";
            } else if (value === -2) {
              return "N1";
            } else if (value === -3) {
              return "N2";
            } else if (value === -4) {
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
  const sleepCycleData = {
    datasets: [
      {
        borderWidth: 1,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: plotData,
        label: "Large Dataset",
        radius: 0,
        stepped: true,
      },
    ],
  };

  //Line chart
  return (
    <React.Fragment>
      <Box>
        {/* Hypnogram */}
        <Line height="100%" options={sleepCycleOptions} data={sleepCycleData} />
      </Box>
    </React.Fragment>
  );
}
