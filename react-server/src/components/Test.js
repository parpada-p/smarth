import React from "react";
import moment from "moment";
import { format } from "d3-format";
import _ from "underscore";

// Pond
import { TimeSeries, TimeRange, avg, percentile, median, Index } from "pondjs";
// Charts library
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler,
  Baseline,
  LabelAxis,
  ValueAxis,
  Brush,
  Legend,
  AreaChart,
} from "react-timeseries-charts";

const data = require("./bike.json");
const style = styler([
  { key: "distance", color: "#e2e2e2" },
  { key: "altitude", color: "#e2e2e2" },
  { key: "cadence", color: "red" },
  { key: "power", color: "green", width: 1, opacity: 0.5 },
  { key: "temperature", color: "#cfc793" },
  { key: "speed", color: "steelblue", width: 1, opacity: 0.5 },
]);
const baselineStyles = {
  speed: {
    stroke: "steelblue",
    opacity: 0.5,
    width: 0.25,
  },
  power: {
    stroke: "green",
    opacity: 0.5,
    width: 0.25,
  },
};
const speedFormat = format(".1f");

const handleTrackerChanged = (t) => {
  this.setState({ tracker: t });
};

// Handles when the brush changes the timerange
const handleTimeRangeChange = (timerange) => {
  const { channels } = this.state;

  if (timerange) {
    this.setState({ timerange, brushrange: timerange });
  } else {
    this.setState({
      timerange: channels["altitude"].range(),
      brushrange: null,
    });
  }
};

const handleChartResize = (width) => {
  this.setState({ width });
};

const handleActiveChange = (channelName) => {
  const channels = this.state.channels;
  channels[channelName].show = !channels[channelName].show;
  this.setState({ channels });
};

//   mode
const renderMode = () => {
  const linkStyle = {
    fontWeight: 600,
    color: "grey",
    cursor: "default",
  };

  const linkStyleActive = {
    color: "steelblue",
    cursor: "pointer",
  };

  return (
    <div className="col-md-6" style={{ fontSize: 14, color: "#777" }}>
      <span
        style={this.state.mode !== "multiaxis" ? linkStyleActive : linkStyle}
        onClick={() => this.setState({ mode: "multiaxis" })}
      >
        Multi-axis
      </span>
      <span> | </span>
      <span
        style={this.state.mode !== "channels" ? linkStyleActive : linkStyle}
        onClick={() => this.setState({ mode: "channels" })}
      >
        Channels
      </span>
      <span> | </span>
      <span
        style={this.state.mode !== "rollup" ? linkStyleActive : linkStyle}
        onClick={() => this.setState({ mode: "rollup" })}
      >
        Rollups
      </span>
    </div>
  );
};
const renderModeOptions = () => {
  const linkStyle = {
    fontWeight: 600,
    color: "grey",
    cursor: "default",
  };

  const linkStyleActive = {
    color: "steelblue",
    cursor: "pointer",
  };

  if (this.state.mode === "multiaxis") {
    return <div />;
  } else if (this.state.mode === "channels") {
    return <div />;
  } else if (this.state.mode === "rollup") {
    return (
      <div className="col-md-6" style={{ fontSize: 14, color: "#777" }}>
        <span
          style={this.state.rollup !== "1m" ? linkStyleActive : linkStyle}
          onClick={() => this.setState({ rollup: "1m" })}
        >
          1m
        </span>
        <span> | </span>
        <span
          style={this.state.rollup !== "5m" ? linkStyleActive : linkStyle}
          onClick={() => this.setState({ rollup: "5m" })}
        >
          5m
        </span>
        <span> | </span>
        <span
          style={this.state.rollup !== "15m" ? linkStyleActive : linkStyle}
          onClick={() => this.setState({ rollup: "15m" })}
        >
          15m
        </span>
      </div>
    );
  }
  return <div />;
};

//   chart
const renderChart = () => {
  if (this.state.mode === "multiaxis") {
    return this.renderChannelsChart();
  } else if (this.state.mode === "channels") {
    return this.renderChannelsChart();
  } else if (this.state.mode === "rollup") {
    return this.renderChannelsChart();
  }
  return <div>No chart</div>;
};
const renderChannelsChart = () => {
  const {
    timerange,
    displayChannels,
    channels,
    maxTime,
    minTime,
    minDuration,
  } = this.state;

  const durationPerPixel = timerange.duration() / 800 / 1000;
  const rows = [];

  for (let channelName of displayChannels) {
    const charts = [];
    let series = channels[channelName].series;
    _.forEach(channels[channelName].rollups, (rollup) => {
      if (rollup.duration < durationPerPixel * 2) {
        series = rollup.series.crop(timerange);
      }
    });

    charts.push(
      <LineChart
        key={`line-${channelName}`}
        axis={`${channelName}_axis`}
        series={series}
        columns={[channelName]}
        style={style}
        breakLine
      />
    );
    charts.push(
      <Baseline
        key={`baseline-${channelName}`}
        axis={`${channelName}_axis`}
        style={baselineStyles.speed}
        value={channels[channelName].avg}
      />
    );

    // Get the value at the current tracker position for the ValueAxis
    let value = "--";
    if (this.state.tracker) {
      const approx =
        (+this.state.tracker - +timerange.begin()) /
        (+timerange.end() - +timerange.begin());
      const ii = Math.floor(approx * series.size());
      const i = series.bisect(new Date(this.state.tracker), ii);
      const v = i < series.size() ? series.at(i).get(channelName) : null;
      if (v) {
        value = parseInt(v, 10);
      }
    }

    // Get the summary values for the LabelAxis
    const summary = [
      { label: "Max", value: speedFormat(channels[channelName].max) },
      { label: "Avg", value: speedFormat(channels[channelName].avg) },
    ];

    rows.push(
      <ChartRow
        height="100"
        visible={channels[channelName].show}
        key={`row-${channelName}`}
      >
        <LabelAxis
          id={`${channelName}_axis`}
          label={channels[channelName].label}
          values={summary}
          min={0}
          max={channels[channelName].max}
          width={140}
          type="linear"
          format=",.1f"
        />
        <Charts>{charts}</Charts>
        <ValueAxis
          id={`${channelName}_valueaxis`}
          value={value}
          detail={channels[channelName].units}
          width={80}
          min={0}
          max={35}
        />
      </ChartRow>
    );
  }

  return (
    <ChartContainer
      timeRange={this.state.timerange}
      format="relative"
      showGrid={false}
      enablePanZoom
      maxTime={maxTime}
      minTime={minTime}
      minDuration={minDuration}
      trackerPosition={this.state.tracker}
      onTimeRangeChanged={this.handleTimeRangeChange}
      onChartResize={(width) => this.handleChartResize(width)}
      onTrackerChanged={this.handleTrackerChanged}
    >
      {rows}
    </ChartContainer>
  );
};

// brush
const renderBrush = () => {
  const { channels } = this.state;
  console.log(channels.altitude.series);
  return (
    <ChartContainer
      timeRange={channels.altitude.series.range()}
      format="relative"
      trackerPosition={this.state.tracker}
    >
      <ChartRow height="100" debug={false}>
        <Brush
          timeRange={this.state.brushrange}
          allowSelectionClear
          onTimeRangeChanged={this.handleTimeRangeChange}
        />
        <YAxis
          id="axis1"
          label="Altitude (ft)"
          min={0}
          max={channels.altitude.max}
          width={70}
          type="linear"
          format="d"
        />
        <Charts>
          <AreaChart
            axis="axis1"
            style={style.areaChartStyle()}
            columns={{ up: ["altitude"], down: [] }}
            series={channels.altitude.series}
          />
        </Charts>
      </ChartRow>
    </ChartContainer>
  );
};

const Charts_Cycling = (props) => {
  const { ready, channels, displayChannels } = this.state;

  if (!ready) {
    return <div>{`Building rollups...`}</div>;
  }
  const chartStyle = {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#DDD",
    paddingTop: 10,
    marginBottom: 10,
  };

  const brushStyle = {
    boxShadow: "inset 0px 2px 5px -2px rgba(189, 189, 189, 0.75)",
    background: "#FEFEFE",
    paddingTop: 10,
  };

  // Generate the legend
  const legend = displayChannels.map((channelName) => ({
    key: channelName,
    label: channels[channelName].label,
    disabled: !channels[channelName].show,
  }));

  return (
    <div>
      {/* mode & options */}
      <div className="row">
        <span>Multi-axis</span>
        <span> | </span>
        <span>Channels</span>
        <span> | </span>
        <span>Rollups</span>
      </div>
      <div className="row">
        <div className="col-md-12">
          <hr />
        </div>
      </div>
      {/* chart */}
      <div className="row">
        <div className="col-md-12" style={chartStyle}>
          <Resizable>
            {ready ? this.renderChart() : <div>Loading.....</div>}
          </Resizable>
        </div>
      </div>
      {/* brush */}
      <div className="row">
        <div className="col-md-12" style={brushStyle}>
          <Resizable>{ready ? this.renderBrush() : <div />}</Resizable>
        </div>
      </div>
    </div>
  );
};

export default Charts_Cycling;
