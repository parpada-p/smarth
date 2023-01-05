import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DateTime } from "luxon";
import * as luxon from "chartjs-adapter-luxon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation
);

function valueOrDefault(value, defaultValue) {
  return typeof value === "undefined" ? defaultValue : value;
}

var _seed = 10;
function rand(min, max) {
  min = valueOrDefault(min, 0);
  max = valueOrDefault(max, 0);
  _seed = (_seed * 9301 + 49297) % 233280;
  return min + (_seed / 233280) * (max - min);
}

export default function App() {
  const [decimation, setDecimation] = useState([{}]);
  const NUM_POINTS = 1439;

  useEffect(() => {
    setDecimation({
      enabled: true,
      algorithm: "min-max",
    });
  }, []);

  const data = React.useMemo(() => {
    const start = DateTime.fromISO("1985-01-01T20:29:59+00:00").toMillis();

    const pointData = [];
    for (let i = 0; i < NUM_POINTS; ++i) {
      // Most data will be in the range [0, 20) but some rare data will be in the range [0, 100)
      const max = Math.random() < 0.001 ? 100 : 20;
      pointData.push({ x: start + i * 300000, y: rand(-4, 0) });
    }
    return {
      datasets: [
        {
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderWidth: 1,
          data: pointData,
          label: "Large Dataset",
          radius: 0,
          stepped: true,
        },
      ],
    };
  }, []);

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
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
    },
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
      samples: 500,
      threshold: 5,
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
      <div>
        <Button onClick={handleDefault}>No decimation</Button>
        <Button onClick={handleMaxMin}>min-max decimation</Button>
        <Button onClick={handleLttb_50}>LTTB decimation (50 samples)</Button>
        <Button onClick={handleLttb_500}>LTTB decimation (500 samples)</Button>
      </div>
      <Line data={data} options={options}></Line>
    </div>
  );
}
