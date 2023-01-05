import React, { Component, useState, useEffect } from "react";
import dateFormat from "dateformat";
import CanvasJSReact from "../canvasjs-3.7.1/canvasjs.stock.react";
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default function ReportCharts6(props) {
  var yLabels = ["AWAKE", "REM", "N1", "N2", "N3"];

  const [isLoaded, setIsLoaded] = useState(false);
  const [dataPointsT, setDataPointsT] = useState([]);
  const [dataPointsH, setDataPointsH] = useState([]);
  const [dataPointsC, setDataPointsC] = useState([]);

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [stripColor, setStripColor] = useState("#ffffff");

  const [dataPointsCh, setDataPointsCh] = useState([]);

  useEffect(() => {
    if (props.predictResultMins != undefined) {
      if (props.predictResultMins == "Apnea") {
        setStripColor("#ffccbc");
      } else {
        setStripColor("#ffffff");
      }
    }
  }, [props.predictResultMins]);

  useEffect(() => {
    if (props.timeData != undefined) {
      var data = props.timeData;
      var dpsT = [];
      for (var i = 0; i < props.timeData.length; i++) {
        var dateTemp = new Date(data[i].x * 1000);
        var dateStr = dateFormat(dateTemp, "ddd mmm dd yyyy HH:MM:ss l");

        dpsT.push({
          x: data[i].x,
          y: Number(data[i].y),
          label: dateStr,
        });
      }
      setDataPointsT(dpsT);
    }
  }, [props.timeData]);

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

        setMin(data[0].x);
        setMax(data[props.hypnogramData.length - 1].x);
      }
      setDataPointsH(dpsH);
    }
  }, [props.hypnogramData]);

  useEffect(() => {
    if (props.charts != undefined) {
      var temp = [];
      for (var j = 0; j < props.charts.length; j++) {
        var channel = props.charts[j].channel;
        var data = props.charts[j].data;
        var dpsCh = [];

        for (var i = 0; i < data.length; i++) {
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

          dpsCh.push({
            x: data[i].x,
            y: Number(data[i].y),
            label: dateStr,
          });
        }

        temp.push({
          channel: channel,
          data: dpsCh,
        });
      }
      setDataPointsCh(temp);
    }
  }, [props.charts]);

  useEffect(() => {
    if (dataPointsCh != []) {
      var tempArr = [];

      // Hypnogram
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
          stripLines: [
            {
              startValue: new Date(min),
              endValue: new Date(max),
              color: stripColor,
            },
          ],
        },
        axisY: {
          title: "",
          enabled: false,
          prefix: "",
          maximum: 1,
          minimum: -4,
          interval: 1,
          labelFormatter: function (e) {
            var yCats = "";
            if (e.value > 0) {
              yCats = "";
            } else {
              yCats = yCats = yLabels[-e.value];
            }

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
            type: "stepLine",
            dataPoints: dataPointsH,
          },
        ],
      });

      // Channel
      for (var i = 0; i < dataPointsCh.length; i++) {
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
            stripLines: [
              {
                startValue: new Date(min),
                endValue: new Date(max),
                color: "#ffccbc",
              },
            ],
          },
          axisY: {
            title: dataPointsCh[i].channel,
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
              type: "line",
              dataPoints: dataPointsCh[i].data,
            },
          ],
        });
      }

      setDataPointsC(tempArr);
    }
  }, [dataPointsCh]);

  const options = {
    theme: "light2",
    charts: dataPointsC,
    navigator: {
      verticalAlign: "top",
      data: [
        {
          type: "stepLine",
          dataPoints: dataPointsT,
        },
      ],
      slider: {
        // minimum: min,
        // maximum: max / 2,
      },
      axisX: {
        minimum: min,
        maximum: max,
      },
      axisY: {
        interval: 1,
        labelFormatter: function (e) {
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
