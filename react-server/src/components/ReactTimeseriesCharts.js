import React from "react";
import { render } from "react-dom";
import { TimeSeries } from "pondjs";
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler,
} from "react-timeseries-charts";
import response from "./response";

export default function ReactTimeseriesCharts(props) {
  const series = response.data.reduce(
    (acc, d) => {
      acc.flow.push([d.time, d.flowRate]);
      acc.temperature.push([d.time, d.tempAmbient, d.tempAmbient + 0.02]);
      return acc;
    },
    {
      flow: [],
      temperature: [],
    }
  );

  const temperatureSeries = new TimeSeries({
    name: "Ambient Temperature",
    columns: ["time", "temp", "ambient"],
    points: series.temperature,
  });

  const flowSeries = new TimeSeries({
    name: "Flow Rate",
    columns: ["time", "flow"],
    points: series.flow,
  });
  const styles = styler([
    { key: "temp", color: "steelblue", width: 1 },
    { key: "ambient", color: "red", width: 1 },
    { key: "flow", color: "#F68B24", width: 1 },
  ]);

  return (
    <div>
      <Resizable>
        <ChartContainer timeRange={temperatureSeries.range()}>
          <ChartRow height="450">
            <YAxis
              id="temp"
              min={temperatureSeries.min("temp")}
              max={temperatureSeries.max("temp")}
              width="0"
              type="linear"
              format=",.2f"
            />
            <Charts>
              <LineChart
                style={styles}
                axis="temp"
                series={temperatureSeries}
                columns={["temp", "ambient"]}
              />

              <LineChart
                style={styles}
                axis="flow"
                series={flowSeries}
                columns={["flow"]}
              />
            </Charts>
            <YAxis
              id="flow"
              min={flowSeries.min("flow")}
              max={flowSeries.max("flow")}
              width="0"
              type="linear"
              format=",.1f"
            />
          </ChartRow>
        </ChartContainer>
      </Resizable>
    </div>
  );
}
