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
} from "chart.js";
import { Line } from "react-chartjs-2";

import LineCharts from "../components/LineCharts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Charts(props) {
  const [hypnogramData, setHypnogramData] = useState([{}]);
  const [plotData, setPlotData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [decimation, setDecimation] = useState([{}]);
  const [value, setValue] = useState([]);

  const [no_channel, setNoChannel] = useState(0);
  const [charts, setcharts] = useState([{}]);
  console.log(charts);

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

  //Line data
  async function fetchData() {
    let chartsLabel = [];
    let chartsData = [];
    let charts = [];
    if (no_channel > 0) {
      for (let i = 0; i < 8 - 1; i++) {
        await fetch("/reportChartDetails/P0003_24062022_025830.edf/" + i)
          .then((res) => res.json())
          .then((data) => {
            charts.push({
              chartLabel: data.channelLabel,
              chartData: data.chartsData[0].data,
            });
          });
      }
      setcharts(charts);
    }
  }
  useEffect(() => {
    fetch("/reportCharts/P0003_24062022_025830.edf")
      .then((res) => res.json())
      .then((data) => {
        setNoChannel(data.n_channels);
      });
  }, []);
  useEffect(() => {
    fetchData();
  }, [no_channel]);

  //Line chart
  return (
    <React.Fragment>
      <Box style={{ height: "100%" }}>
        {/* Charts */}
        {charts.map((row) => (
          <LineCharts chartLabel={row.chartLabel} chartData={row.chartData} />
        ))}
      </Box>
    </React.Fragment>
  );
}
