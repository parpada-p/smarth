import React, { Component, useState, useEffect } from "react";
import CanvasJSReact from "../canvasjs-3.7.1/canvasjs.stock.react";
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default function ChartCanvasJS(props) {
  console.log(props.charts);

  const [isLoaded, setIsLoaded] = useState(false);
  const [dataPoints1, setDataPoints1] = useState([]);
  const [dataPoints2, setDataPoints2] = useState([]);
  const [dataPoints3, setDataPoints3] = useState([]);

  useEffect(() => {
    fetch("https://canvasjs.com/data/docs/ltcusd2018.json")
      .then((res) => res.json())
      .then((data) => {
        var dps1 = [];
        var dps2 = [];
        var dps3 = [];
        for (var i = 0; i < data.length; i++) {
          dps1.push({
            x: new Date(data[i].date),
            y: [
              Number(data[i].open),
              Number(data[i].high),
              Number(data[i].low),
              Number(data[i].close),
            ],
          });
          dps2.push({
            x: new Date(data[i].date),
            y: Number(data[i].volume_usd),
          });
          dps3.push({ x: new Date(data[i].date), y: Number(data[i].close) });
        }

        setIsLoaded(true);
        setDataPoints1(dps1);
        setDataPoints2(dps2);
        setDataPoints3(dps3);
      });
  }, []);

  const options = {
    theme: "light2",
    charts: [
      {
        axisX: {
          crosshair: {
            enabled: false,
            snapToDataPoint: true,
          },
        },
        axisY: {
          title: "EKG",
          prefix: "",
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: "Signal Data",
            yValueFormatString: "#,###.##",
            type: "line",
            dataPoints: dataPoints3,
          },
        ],
      },
      {
        axisX: {
          crosshair: {
            enabled: false,
            snapToDataPoint: true,
          },
        },
        axisY: {
          title: "EOG-L",
          prefix: "",
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: "Signal Data",
            yValueFormatString: "#,###.##",
            type: "line",
            dataPoints: dataPoints2,
          },
        ],
      },
      {
        axisX: {
          crosshair: {
            enabled: false,
            snapToDataPoint: true,
          },
        },
        axisY: {
          title: "EOG-R",
          prefix: "",
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: "Signal Data",
            yValueFormatString: "#,###.##",
            type: "line",
            dataPoints: dataPoints3,
          },
        ],
      },
    ],
    navigator: {
      data: [
        {
          type: "line",
          dataPoints: dataPoints3,
        },
      ],
      slider: {
        minimum: new Date("2018-01-01"),
        maximum: new Date("2018-02-01"),
      },
    },
    rangeSelector: {
      selectedRangeButtonIndex: 2,
      buttonStyle: {
        labelFontSize: 16,
      },
      buttons: [
        {
          range: 1,
          rangeType: "month",
          label: "1Month",
        },
        {
          range: 6,
          rangeType: "month",
          label: "6Months",
        },
        {
          rangeType: "all",
          label: "All",
        },
      ],
      inputFields: {
        style: {
          fontSize: 16,
        },
      },
    },
  };
  const containerProps = {
    width: "100%",
    height: "560px",
    margin: "auto",
  };

  return (
    <div>
      <CanvasJSStockChart containerProps={containerProps} options={options} />
    </div>
  );
}
