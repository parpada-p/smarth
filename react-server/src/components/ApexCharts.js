import React from "react";
import Chart from "react-apexcharts";

export default function ApexCharts(props) {
  var data = [];
  if (props.charts != undefined) {
    data = props.charts[0].data;
    console.log(props.charts[0].data);
  }

  var seriesLine = [
    {
      name: "hypnogram",
      data: data,
    },
  ];
  var optionsLine = {
    chart: {
      id: "chartLine",
      type: "line",
      brush: {
        targets: ["EKG", "EOG-L"],
        enabled: true,
      },
      selection: {
        enabled: true,
        // xaxis: {
        //   min: new Date("19 Jun 2017").getTime(),
        //   max: new Date("14 Aug 2017").getTime(),
        // },
      },
    },
    colors: ["#008FFB"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      // type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  var series1 = [
    {
      name: "EKG",
      data: data,
    },
  ];
  var series2 = [
    {
      name: "EOG-L",
      data: data,
    },
  ];
  var options1 = {
    chart: {
      id: "EKG",
      group: "chartData",
      type: "line",
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
    },
    stroke: {
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0,
    },
    // xaxis: {
    //   type: "datetime",
    // },
  };
  var options2 = {
    chart: {
      id: "EOG-L",
      group: "chartData",
      type: "line",
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
    },
    stroke: {
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0,
    },
    // xaxis: {
    //   type: "datetime",
    // },
  };

  return (
    <div id="chart">
      <Chart
        options={optionsLine}
        series={seriesLine}
        type="area"
        height="130"
      />
      <Chart options={options1} series={series1} type="line" height="230" />
      <Chart options={options2} series={series2} type="line" height="230" />
    </div>
  );
}
