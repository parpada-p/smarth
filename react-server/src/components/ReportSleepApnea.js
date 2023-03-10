import React from "react";
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

export default function Rechart_Line(props) {
  const chartData = props.chartData;
  const chartLabel = props.chartLabel;

  const data = chartData.map((value, index) => ({ index, value }));
  return (
    <ResponsiveContainer height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
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
        <Line dataKey="value" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
