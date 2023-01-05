import { green } from "@mui/material/colors";
import React, { useState } from "react";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  CartesianGrid,
} from "recharts";

export default function Hypnogram(props) {
  const [color, setColor] = useState(0);
  const data = props.data;

  const yAxisTickFormatter = (x, y, payload, itemType) => {
    if (y === 4) return "AWAKE";
    if (y === 3) return "REM";
    if (y === 2) return "N1";
    if (y === 1) return "N2";
    if (y === 0) return "N3";
    return y;
  };

  return (
    <React.Fragment>
      <ResponsiveContainer width={"100%"}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#264653" stopOpacity={1} />
              <stop offset="25%" stopColor="#2a9d8f" stopOpacity={1} />
              <stop offset="50%" stopColor="#e9c46a" stopOpacity={1} />
              <stop offset="75%" stopColor="#f4a261" stopOpacity={1} />
              <stop offset="100%" stopColor="#e76f51" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Line
            type="step"
            dataKey="y_pred"
            stroke="url(#color)"
            strokeWidth={4}
            isAnimationActive={false}
            dot={false}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis tick={false} />
          <YAxis
            label={{ value: "Hypnogram", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            tickFormatter={yAxisTickFormatter}
            type="number"
            domain={[-4, 0]}
          />
          <Tooltip />
        </ComposedChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
