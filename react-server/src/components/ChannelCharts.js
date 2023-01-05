import React, { Component, useState, useEffect } from "react";
import dateFormat from "dateformat";
import CanvasJSReact from "../canvasjs-3.7.1/canvasjs.stock.react";
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default function ChannelCharts(props) {
  var yLabels = ["AWAKE", "REM", "N1", "N2", "N3"];

  const [isLoaded, setIsLoaded] = useState(false);
  const [dataPointsH, setDataPointsH] = useState([]);
  const [dataPointsC, setDataPointsC] = useState([]);

  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [dataPoints1, setDataPoints1] = useState([]);
  const [dataPoints2, setDataPoints2] = useState([]);
  const [dataPoints3, setDataPoints3] = useState([]);

  useEffect(() => {
    if (props.hypnogramData != undefined) {
      var data = props.hypnogramData;
      var dpsH = [];
      for (var i = 0; i < props.hypnogramData.length; i++) {
        var dateTemp = new Date(data[i].x * 1000);
        var dateStr = dateFormat(dateTemp, "ddd mmm dd yyyy HH:MM:ss l");

        dpsH.push({
          x: data[i].x,
          y: Number(data[i].y),
          label: dateStr,
        });
      }
      setDataPointsH(dpsH);
    }
  }, [props.hypnogramData]);

  useEffect(() => {
    if (props.min != undefined) {
      setMin(props.min);
    }
  }, [props.min]);

  useEffect(() => {
    if (props.max != undefined) {
      setMax(props.max);
    }
  }, [props.max]);

  useEffect(() => {
    if (props.charts != undefined) {
      var data = props.charts[0].data;
      var dpsC = [];
      for (var i = 0; i < data.length; i++) {
        setMin(data[0].x);
        setMax(data[data.length - 1].x);

        var dateTemp = new Date(data[i].x * 1000);
        var milliseconds = String(data[i].x).split(".");
        var dateStr = "";
        if (milliseconds.length == 1) {
          dateStr = dateFormat(dateTemp, "ddd mmm dd yyyy HH:MM:ss l");
        } else {
          dateStr = dateFormat(
            dateTemp,
            "ddd mmm dd yyyy HH:MM:ss l" + "." + milliseconds[1]
          );
        }

        dpsC.push({
          x: data[i].x,
          y: Number(data[i].y),
          label: dateStr,
        });
      }
      setDataPoints2(dpsC);
      setDataPoints3(dpsC);
    }
  }, [props.charts]);

  useEffect(() => {
    if (dataPoints2 != []) {
      var tempArr = [];
      tempArr.push({
        axisX: {
          crosshair: {
            enabled: false,
            snapToDataPoint: false,
          },
          gridThickness: 0,
          tickLength: 0,
          lineThickness: 0,
          labelFormatter: function () {
            return "";
          },
        },
        axisY: {
          title: "",
          enabled: false,
          prefix: "",
          // tickLength: 0,
          // labelFormatter: function (e) {
          //   return "";
          // },
          minimum: -1,
          maximum: 0,
          interval: 1,
          labelFormatter: function (e) {
            var yCats = yLabels[-e.value];
            return yCats;
          },
        },
        toolTip: {
          enabled: true,
          shared: false,
          contentFormatter: function (e) {
            var yCats = yLabels[-e.entries[0].dataPoint.y];
            return yCats;
          },
        },
        data: [
          {
            // name: "Signal Data",
            // yValueFormatString: "#,###.##",
            type: "stepLine",
            dataPoints: dataPointsH,
          },
        ],
      });
      tempArr.push({
        axisX: {
          crosshair: {
            enabled: false,
            snapToDataPoint: false,
          },
          gridThickness: 0,
          tickLength: 0,
          lineThickness: 0,
          labelFormatter: function () {
            return "";
          },
        },
        axisY: {
          title: "EKG",
          enabled: false,
          prefix: "",
          tickLength: 0,
          labelFormatter: function (e) {
            return "";
          },
        },
        toolTip: { enabled: true, shared: false },
        data: [
          {
            // name: "Signal Data",
            // yValueFormatString: "#,###.##",
            type: "line",
            dataPoints: dataPoints3,
          },
        ],
      });
      tempArr.push({
        axisX: {
          crosshair: {
            enabled: false,
            snapToDataPoint: false,
          },
          gridThickness: 0,
          tickLength: 0,
          lineThickness: 0,
          labelFormatter: function () {
            return "";
          },
        },
        axisY: {
          title: "EKG",
          enabled: false,
          prefix: "",
          tickLength: 0,
          labelFormatter: function (e) {
            return "";
          },
        },
        toolTip: { enabled: true, shared: false },
        data: [
          {
            // name: "Signal Data",
            // yValueFormatString: "#,###.##",
            type: "line",
            dataPoints: dataPoints3,
          },
        ],
      });
      setDataPointsC(tempArr);
    }
  }, [dataPoints2]);

  const options = {
    theme: "light2",
    // charts: [
    //   {
    //     axisX: {
    //       crosshair: {
    //         enabled: false,
    //         snapToDataPoint: false,
    //       },
    //       gridThickness: 0,
    //       tickLength: 0,
    //       lineThickness: 0,
    //       // labelFormatter: function () {
    //       //   return "";
    //       // },
    //     },
    //     axisY: {
    //       title: "EKG",
    //       enabled: false,
    //       prefix: "",
    //       tickLength: 0,
    //       labelFormatter: function (e) {
    //         return "";
    //       },
    //     },
    //     toolTip: { enabled: true, shared: false },
    //     data: [
    //       {
    //         // name: "Signal Data",
    //         // yValueFormatString: "#,###.##",
    //         type: "line",
    //         dataPoints: dataPoints3,
    //       },
    //     ],
    //   },
    //   {
    //     axisX: {
    //       crosshair: {
    //         enabled: false,
    //         snapToDataPoint: true,
    //       },
    //       gridThickness: 0,
    //       tickLength: 0,
    //       lineThickness: 0,
    //       labelFormatter: function () {
    //         return "";
    //       },
    //     },
    //     axisY: {
    //       title: "EOG-L",
    //       prefix: "",
    //       tickLength: 0,
    //       labelFormatter: function (e) {
    //         return "";
    //       },
    //     },
    //     toolTip: {
    //       shared: true,
    //     },
    //     data: [
    //       {
    //         name: "Signal Data",
    //         yValueFormatString: "#,###.##",
    //         type: "line",
    //         dataPoints: dataPoints2,
    //       },
    //     ],
    //   },
    //   {
    //     axisX: {
    //       crosshair: {
    //         enabled: false,
    //         snapToDataPoint: true,
    //       },
    //       gridThickness: 0,
    //       tickLength: 0,
    //       lineThickness: 0,
    //       labelFormatter: function () {
    //         return "";
    //       },
    //     },
    //     axisY: {
    //       title: "EOG-R",
    //       prefix: "",
    //       tickLength: 0,
    //       labelFormatter: function (e) {
    //         return "";
    //       },
    //     },
    //     toolTip: {
    //       shared: true,
    //     },
    //     data: [
    //       {
    //         name: "Signal Data",
    //         yValueFormatString: "#,###.##",
    //         type: "line",
    //         dataPoints: dataPoints3,
    //       },
    //     ],
    //   },
    // ],
    charts: dataPointsC,
    navigator: {
      height: 20,
      verticalAlign: "top",
      data: [
        {
          type: "stepLine",
          dataPoints: dataPointsH,
        },
      ],
      slider: {
        // minimum: min,
        // maximum: max / 2,
      },
      axisX: {
        minimum: min,
        maximum: max,
        gridThickness: 0,
        tickLength: 0,
        lineThickness: 0,
        labelFormatter: function () {
          return "";
        },
        // stripLines: [
        //   {
        //     startValue: new Date(min),
        //     endValue: new Date(max),
        //     color: "#ffccbc",
        //   },
        // ],
      },
      axisY: {
        interval: 1,
        labelFormatter: function (e) {
          console.log(-e.value);
          var yCats = yLabels[-e.value];
          return yCats;
        },
      },
    },
    rangeSelector: {
      enabled: false,
      // selectedRangeButtonIndex: 2,
      // buttonStyle: {
      //   labelFontSize: 16,
      // },
      // buttons: [
      //   {
      //     range: 7680,
      //     rangeType: "numeric",
      //     label: "30 seconds",
      //   },
      //   {
      //     rangeType: "all",
      //     label: "All",
      //   },
      // ],
      // inputFields: {
      //   style: {
      //     fontSize: 16,
      //   },
      // },
    },
  };
  const containerProps = {
    width: "100%",
    height: "560px",
    margin: "auto",
  };

  return (
    <div>
      {props.charts != undefined ? (
        <CanvasJSStockChart containerProps={containerProps} options={options} />
      ) : null}
    </div>
  );
}
