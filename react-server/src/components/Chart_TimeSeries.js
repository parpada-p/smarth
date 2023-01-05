import React from "react";
import { TimeSeries, Index } from "pondjs";
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler,
} from "react-timeseries-charts";
import data from "./data";

export default function Chart_TimeSeries(props) {
  const series = new TimeSeries({
    name: "hilo_rainfall",
    columns: ["index", "precip"],
    points: data.values.map(([d, value]) => [
      Index.getIndexString("1h", new Date(d)),
      value,
    ]),
  });

  const style = styler([
    {
      key: "precip",
      color: "#A5C8E1",
      selected: "#2CB1CF",
    },
  ]);

  return (
    <Resizable height="150">
      <ChartContainer timeRange={series.range()}>
        <ChartRow>
          <YAxis
            id="rain"
            label="Rainfall (inches/hr)"
            min={0}
            max={2}
            format=".2f"
            width="100%"
            type="linear"
          />
          <Charts>
            <LineChart
              axis="rain"
              style={style}
              spacing={1}
              columns={["precip"]}
              series={series}
              minBarHeight={1}
            />
          </Charts>
        </ChartRow>
        <ChartRow>
          <YAxis
            id="rain"
            label="Rainfall (inches/hr)"
            min={0}
            max={2}
            format=".2f"
            type="linear"
          />
          <Charts>
            <LineChart
              axis="rain"
              style={style}
              spacing={1}
              columns={["precip"]}
              series={series}
              minBarHeight={1}
            />
          </Charts>
        </ChartRow>
        <ChartRow>
          <YAxis
            id="rain"
            label="Rainfall (inches/hr)"
            min={0}
            max={2}
            format=".2f"
            type="linear"
          />
          <Charts>
            <LineChart
              axis="rain"
              style={style}
              spacing={1}
              columns={["precip"]}
              series={series}
              minBarHeight={1}
            />
          </Charts>
        </ChartRow>
        <ChartRow>
          <YAxis
            id="rain"
            label="Rainfall (inches/hr)"
            min={0}
            max={2}
            format=".2f"
            type="linear"
          />
          <Charts>
            <LineChart
              axis="rain"
              style={style}
              spacing={1}
              columns={["precip"]}
              series={series}
              minBarHeight={1}
            />
          </Charts>
        </ChartRow>
        <ChartRow>
          <YAxis
            id="rain"
            label="Rainfall (inches/hr)"
            min={0}
            max={2}
            format=".2f"
            type="linear"
          />
          <Charts>
            <LineChart
              axis="rain"
              style={style}
              spacing={1}
              columns={["precip"]}
              series={series}
              minBarHeight={1}
            />
          </Charts>
        </ChartRow>
        <ChartRow>
          <YAxis
            id="rain"
            label="Rainfall (inches/hr)"
            min={0}
            max={2}
            format=".2f"
            type="linear"
          />
          <Charts>
            <LineChart
              axis="rain"
              style={style}
              spacing={1}
              columns={["precip"]}
              series={series}
              minBarHeight={1}
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
}
