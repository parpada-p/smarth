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

export default function App() {
  const [plotData2, setPlotData2] = useState([]);

  useEffect(() => {
    fetch("/reportCharts/P0003_24062022_025830.edf")
      .then((res) => res.json())
      .then((data) => {
        setPlotData2(data.chartsData[0].data);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "EOG-L",
      },
    },
    scales: {
      x: {
        display: false,
      },
    },
  };
  const labels = plotData2;
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: plotData2,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        radius: 0,
      },
    ],
  };

  return (
    <div>
      <Line height="30%" data={data} options={options} />
    </div>
  );
}
