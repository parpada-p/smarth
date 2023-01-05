import React, { useState, useEffect, createRef } from "react";
import { useParams } from "react-router-dom";
// import { ScreenCapture } from "react-screen-capture";
import { useScreenshot, createFileName } from "use-react-screenshot";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CircleIcon from "@mui/icons-material/Circle";

import AppBar from "../components/AppBar";
import Hypnogram from "../components/Hypnogram";

function DashboardContent() {
  const { pid } = useParams();
  const [dashboardData, setDashboardData] = useState([{}]);
  const [hypnogramData, setHypnogramData] = useState([{}]);
  const [labels, setLabels] = useState("");
  const [barchartData, setBarChartData] = useState([{}]);
  const [sleep_period, setSleepPeriod] = useState("");
  const [total_sleep, setTotalSleep] = useState("");
  const [start_time, setStartTime] = useState("");
  const [predictResult, setPredictResult] = useState([{}]);
  const [predictResultColor, setPredictResultColor] = useState("#ffffff");

  //Take Screenshot
  const ref = createRef(null);
  const [width, setWidth] = useState(300);
  const [image, takeScreenShot] = useScreenshot();

  const download = (image, { name = "dashboard", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  useEffect(() => {
    fetch("/dashboard/P0003_24062022_025830.edf")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data.dashboard[0]);
      });

    fetch("/predictResult")
      .then((res) => res.json())
      .then((data) => {
        setPredictResult(data);

        let diag = data.diagnosis;
        if (diag == "Normal") {
          setPredictResultColor(
            "linear-gradient(to right bottom, #a2cf6e, #357a38)"
          );
        } else if (diag == "Mild") {
          setPredictResultColor(
            "linear-gradient(to right bottom, #ffcd38, #ff9800)"
          );
        } else if (diag == "Moderate") {
          setPredictResultColor(
            "linear-gradient(to right bottom, #ff9800, #ff5722)"
          );
        } else {
          setPredictResultColor(
            "linear-gradient(to right bottom, #f6685e, #d50000)"
          );
        }
      });
  }, []);

  useEffect(() => {
    if (dashboardData !== undefined) {
      setHypnogramData(dashboardData.data);
      setLabels(dashboardData.labels);

      setBarChartData(dashboardData.barchart_data);

      let sleep_period_str;
      if (dashboardData.sleep_period !== undefined) {
        sleep_period_str = dashboardData.sleep_period.split(":");
        if (sleep_period_str[0].length === 2) {
          setSleepPeriod(
            sleep_period_str[0] + "h " + sleep_period_str[1] + "m"
          );
        } else {
          setSleepPeriod(
            "0" + sleep_period_str[0] + "h " + sleep_period_str[1] + "m"
          );
        }
      }
      let total_sleep_str;
      if (dashboardData.total_sleep !== undefined) {
        total_sleep_str = dashboardData.total_sleep.split(":");
        if (total_sleep_str[0].length === 2) {
          setTotalSleep(total_sleep_str[0] + "h " + total_sleep_str[1] + "m");
        } else {
          setTotalSleep(
            "0" + total_sleep_str[0] + "h " + total_sleep_str[1] + "m"
          );
        }
      }

      setStartTime(dashboardData.start_time);
    }
  }, [dashboardData]);

  return (
    <Box
      maxHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div ref={ref}>
        <AppBar />
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      paddingTop: 2,
                      paddingButtom: 2,
                      paddingLeft: 5,
                      paddingRight: 5,
                      display: "flex",
                      flexDirection: "column",
                      height: 600,
                    }}
                  >
                    <Stack spacing={2} direction="row">
                      <Button variant="contained">SLEEP STAGE GRAPH</Button>
                      <Button variant="contained" disabled>
                        APNEA EVENT GRAPH
                      </Button>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Hypnogram
                      data={hypnogramData}
                      start_time={start_time}
                      labels={labels}
                    />
                  </Paper>
                </Grid>
                {/* Data */}
                <Grid item xs={12} md={4} lg={3}>
                  <Grid container spacing={2}>
                    {/* AHI INDEX */}
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: 120,
                        }}
                      >
                        <Grid container>
                          <Grid item xs={8}>
                            <Typography variant="h5">AHI INDEX</Typography>
                            <Typography variant="caption">
                              (per hour)
                            </Typography>
                            <Typography variant="h5">
                              {predictResult.avgAHI}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}></Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    {/* Diagnosis */}
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: 120,
                        }}
                        style={{
                          background: predictResultColor,
                        }}
                      >
                        <Typography variant="h5">
                          {predictResult.diagnosis}
                        </Typography>
                        <Typography variant="h7">Sleep Apnea</Typography>
                      </Paper>
                    </Grid>
                    {/* Data */}
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: 260,
                        }}
                      >
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid item xs={8}>
                            Sleep period time
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            {sleep_period}
                          </Grid>
                          <Grid item xs={8}>
                            Total sleep time
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            {total_sleep}
                          </Grid>
                          {/* Bar chart */}
                          <Grid sx={{ mb: "1rem" }}>
                            <BarChart
                              width={440}
                              height={30}
                              data={barchartData}
                              maxBarSize={30}
                              layout={"vertical"}
                            >
                              <XAxis
                                type={"number"}
                                orientation={"top"}
                                axisLine={false}
                                tick={false}
                              />
                              <YAxis
                                type={"category"}
                                orientation={"right"}
                                dataKey={"name"}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip />
                              <Bar dataKey="AWAKE" stackId="a" fill="#264653" />
                              <Bar dataKey="REM" stackId="a" fill="#2a9d8f" />
                              <Bar dataKey="N1" stackId="a" fill="#e9c46a" />
                              <Bar dataKey="N2" stackId="a" fill="#f4a261" />
                              <Bar dataKey="N3" stackId="a" fill="#e76f51" />
                            </BarChart>
                          </Grid>
                          {/* Percent data */}
                          {/* AWAKE */}
                          <Grid item xs={2} textAlign="left">
                            <CircleIcon
                              fontSize="small"
                              size="small"
                              sx={{ color: "#264653" }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            AWAKE
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            {barchartData != undefined
                              ? barchartData[0].AWAKE
                              : 0}{" "}
                            %
                          </Grid>
                          {/* REM */}
                          <Grid item xs={2} textAlign="left">
                            <CircleIcon
                              fontSize="small"
                              size="small"
                              sx={{ color: "#2a9d8f" }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            REM
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            {barchartData != undefined
                              ? barchartData[0].REM
                              : 0}{" "}
                            %
                          </Grid>
                          {/* N1 */}
                          <Grid item xs={2} textAlign="left">
                            <CircleIcon
                              fontSize="small"
                              size="small"
                              sx={{ color: "#e9c46a" }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            N1
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            {barchartData != undefined ? barchartData[0].N1 : 0}{" "}
                            %
                          </Grid>
                          {/* N2 */}
                          <Grid item xs={2} textAlign="left">
                            <CircleIcon
                              fontSize="small"
                              size="small"
                              sx={{ color: "#f4a261" }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            N2
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            {barchartData != undefined ? barchartData[0].N2 : 0}{" "}
                            %
                          </Grid>
                          {/* N3 */}
                          <Grid item xs={2} textAlign="left">
                            <CircleIcon
                              fontSize="small"
                              size="small"
                              sx={{ color: "#e76f51" }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            N3
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            {barchartData != undefined ? barchartData[0].N3 : 0}{" "}
                            %
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    {/* Generate report */}
                    <Grid container item xs={12} justifyContent="center">
                      <Button variant="contained" onClick={downloadScreenshot}>
                        GENERATE REPORT
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </div>
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
