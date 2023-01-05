import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

export default function ChartsSleepApnea(props) {
  const chartLabel = props.chartLabel;
  const [sleepApneaCharts, setSleepApneaCharts] = useState();

  async function fetchData(chartLabel) {
    let chart = [];
    await fetch("/lineChart/P0003_24062022_025830.edf/" + chartLabel)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // setSleepApneaCharts(data.chartsData);
      });
  }
  useEffect(() => {
    if (chartLabel != undefined) {
      fetchData(chartLabel);
    }
  }, [chartLabel]);

  return (
    <ResponsiveContainer height="100%">
      {/* <LineChart
        width={500}
        height={300}
        data={sleepApneaCharts.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis hide="true" />
        <YAxis
          label={{ value: chartLabel, angle: -90, position: "insideLeft" }}
        />
        <YAxis />
        <Tooltip />
        <Legend type="none" />
        <Line dataKey="y" stroke="#82ca9d" />
      </LineChart> */}
    </ResponsiveContainer>
  );
}
