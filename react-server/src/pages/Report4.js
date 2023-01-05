import React, { useState, useEffect } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import AppBar from "../components/AppBar";
import ChartsSleepApnea from "../components/ChartsSleepApnea";

import ReportHypnogram from "../components/ReportHypnogram";
import Hypnogram from "../components/Chartjs_Hypnogram";
import LineCharts from "../components/Charts";
import ReportSleepApnea from "../components/ReportSleepApnea";
import ApexCharts from "../components/ApexCharts";
import ChartTimeSeries from "../components/Chart_TimeSeries";
import ReactTimeseriesCharts from "../components/ReactTimeseriesCharts";
import CanvasJS from "../components/CanvasJS";

import { blue } from "@mui/material/colors";
import { lightGreen } from "@mui/material/colors";
import { yellow } from "@mui/material/colors";
import { amber } from "@mui/material/colors";

const channelsColorHeader = blue[500];
const channelsColorChecked = blue[800];
const channelsColorBody = blue[200];
const sleepApneaColorHeader = lightGreen[600];
const sleepApneaColorChecked = lightGreen[900];
const sleepApneaColorBody = lightGreen[200];
const sleepStageColorHeader = yellow[600];
const sleepStageColorChecked = amber[900];
const sleepStageColorBody = yellow[200];

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}
function union(a, b) {
  return [...a, ...not(b, a)];
}

function Report4Content() {
  //Montage dialog
  const [formMontageOpen, setFormMontageOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [sleepApnea, setSleepApnea] = useState([]);
  const [sleepStage, setSleepStage] = useState([]);

  const [checked, setChecked] = useState([]);
  const channelsChecked = intersection(checked, channels);
  const sleepApneaChecked = intersection(checked, sleepApnea);
  const sleepStageChecked = intersection(checked, sleepStage);

  //Charts Data
  const [charts, setCharts] = useState();
  const [sleepApneaCharts, setSleepApneaCharts] = useState();
  const [sleepStageCharts, setSleepStageCharts] = useState();

  //Montage dialog
  const handleMontageOpen = () => {
    setFormMontageOpen(true);
    setCharts(undefined);
  };
  const handleMontageClose = () => {
    setFormMontageOpen(false);
  };

  //Select Montage
  async function fetchData(chartLabel) {
    let chart = [];
    await fetch("/apexcharts/P0003_24062022_025830.edf/" + chartLabel)
      .then((res) => res.json())
      .then((data) => {
        setCharts(data.chartsData);
      });
  }
  const handleMontageSelect = () => {
    setFormMontageOpen(false);
    // Sleep Apnea Data
    if (sleepApnea != []) {
      fetchData(sleepApnea);
      // let chartData = [];
      // for (let i = 0; i < sleepApnea.length; i++) {
      //   fetchData(sleepApnea[i]);
      // }
    }

    // Sleep Stage Data
    if (sleepStage.length > 0) {
      for (let i = 0; i < sleepStage.length; i++) {
        fetchData(sleepStage[i]);
      }
    }
  };

  //Select channel
  const channelsList = (title, items) => (
    <Card>
      <CardHeader
        style={{ backgroundColor: channelsColorHeader }}
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            style={{ color: channelsColorChecked }}
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 400,
          bgcolor: channelsColorBody,
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  style={{ color: channelsColorChecked }}
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );
  const sleepApneaList = (title, items) => (
    <Card style={{ backgroundColor: sleepApneaColorHeader }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            style={{ color: sleepApneaColorChecked }}
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 150,
          bgcolor: sleepApneaColorBody,
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  style={{ color: sleepApneaColorChecked }}
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );
  const sleepStageList = (title, items) => (
    <Card style={{ backgroundColor: sleepStageColorHeader }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            style={{ color: sleepStageColorChecked }}
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 150,
          bgcolor: sleepStageColorBody,
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  style={{ color: sleepStageColorChecked }}
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const numberOfChecked = (items) => intersection(checked, items).length;
  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };
  const handleCheckedChannelsToSleepApnea = () => {
    setSleepApnea(sleepApnea.concat(channelsChecked));
    setChannels(not(channels, channelsChecked));
    setChecked(not(checked, channelsChecked));
  };
  const handleCheckedChannelsToSleepStage = () => {
    setSleepStage(sleepStage.concat(channelsChecked));
    setChannels(not(channels, channelsChecked));
    setChecked(not(checked, channelsChecked));
  };
  const handleCheckedSleepApnea = () => {
    setChannels(channels.concat(sleepApneaChecked));
    setSleepApnea(not(sleepApnea, sleepApneaChecked));
    setChecked(not(checked, sleepApneaChecked));
  };
  const handleCheckedSleepStage = () => {
    setChannels(channels.concat(sleepStageChecked));
    setSleepStage(not(sleepStage, sleepStageChecked));
    setChecked(not(checked, sleepStageChecked));
  };

  useEffect(() => {
    fetch("/montage/P0003_24062022_025830.edf")
      .then((res) => res.json())
      .then((data) => {
        setChannels(data.signal_labels);
      });
  }, []);

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
      <AppBar />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          p: 1,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "inline-block",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#101010" : "grey.100",
            color: (theme) =>
              theme.palette.mode === "dark" ? "grey.300" : "grey.800",
            textAlign: "center",
          }}
        >
          {/* Options */}
          <Paper
            sx={{
              mb: 1,
              px: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Setting */}
            <Grid
              sx={{ px: 2 }}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    onClick={handleMontageOpen}
                    size="small"
                  >
                    MONTAGE
                  </Button>
                  <Dialog open={formMontageOpen} onClose={handleMontageClose}>
                    <DialogTitle>Montage</DialogTitle>
                    <DialogContent>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        {/* all channels */}
                        <Grid item>{channelsList("Channels", channels)}</Grid>
                        {/* selected channels */}
                        <Grid item>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                          >
                            {/* sleep apnea */}
                            <Grid item>
                              <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                              >
                                <Grid item>
                                  <Grid
                                    container
                                    direction="column"
                                    alignItems="center"
                                  >
                                    <Button
                                      sx={{ my: 0.5 }}
                                      variant="contained"
                                      size="small"
                                      onClick={
                                        handleCheckedChannelsToSleepApnea
                                      }
                                      disabled={channelsChecked.length === 0}
                                      aria-label="move selected right"
                                    >
                                      &gt;
                                    </Button>
                                    <Button
                                      color="success"
                                      sx={{ my: 0.5 }}
                                      variant="contained"
                                      size="small"
                                      onClick={handleCheckedSleepApnea}
                                      disabled={sleepApneaChecked.length === 0}
                                      aria-label="move selected sleep apnea"
                                    >
                                      &lt;
                                    </Button>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  {sleepApneaList("Sleep Apnea", sleepApnea)}
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* sleep stage */}
                            <Grid item>
                              <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                              >
                                <Grid item>
                                  <Grid
                                    container
                                    direction="column"
                                    alignItems="center"
                                  >
                                    <Button
                                      sx={{ my: 0.5 }}
                                      variant="contained"
                                      size="small"
                                      onClick={
                                        handleCheckedChannelsToSleepStage
                                      }
                                      disabled={channelsChecked.length === 0}
                                      aria-label="move selected right"
                                    >
                                      &gt;
                                    </Button>
                                    <Button
                                      color="warning"
                                      sx={{ my: 0.5 }}
                                      variant="contained"
                                      size="small"
                                      onClick={handleCheckedSleepStage}
                                      disabled={sleepStageChecked.length === 0}
                                      aria-label="move selected left"
                                    >
                                      &lt;
                                    </Button>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  {sleepStageList("Sleep Stage", sleepStage)}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleMontageClose}>Cancel</Button>
                      <Button onClick={handleMontageSelect}>Select</Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Grid>
              <Grid item xs={2} md={1}>
                <Button
                  variant="contained"
                  onClick={handleMontageOpen}
                  size="small"
                >
                  <NavigateBeforeIcon sx={{ display: { xs: "flex" } }} />
                </Button>
              </Grid>
              <Grid item xs={8} md={4}>
                <Box display="flex" justifyContent="center">
                  <Grid
                    sx={{ px: 2 }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item xs={12} md={5}>
                      <h3>01/01/1985 20.29.59</h3>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <h3> - </h3>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <h3>01/01/1985 20.31.59</h3>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={2} md={1}>
                <Button
                  variant="contained"
                  onClick={handleMontageOpen}
                  size="small"
                >
                  <NavigateNextIcon sx={{ display: { xs: "flex" } }} />
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    onClick={handleMontageOpen}
                    size="small"
                  >
                    GENERATE REPORT
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          {/* Sleep Apnea */}
          <Paper
            sx={{
              px: 1,
              display: "flex",
              flexDirection: "column",
              height: "88%",
            }}
          >
            <ApexCharts charts={charts} />
          </Paper>
          {/* Sleep Stage */}
        </Box>
      </Box>
    </Box>
  );
}

export default function Report4() {
  return <Report4Content />;
}
