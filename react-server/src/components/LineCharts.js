import React, { useState, useEffect } from "react";
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

export default function LineCharts(props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: props.chartLabel,
        position: "left",
      },
    },
    scales: {
      x: {
        display: false,
      },
    },
  };
  const labels = props.chartData;
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: props.chartData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        radius: 0,
      },
    ],
  };

  return <Line height="10%" data={data} options={options} />;
}
