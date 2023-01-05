import React, { useState, useEffect } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { styled, alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import Typography from "@mui/material/Typography";

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
import Montage from "../components/Montage";
import ReportHypnogram from "../components/ReportHypnogram";
import ReportSleepApnea from "../components/ReportSleepApnea";
import ReportCharts from "../components/ReportCharts";

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

function Report2Content() {
  //Select Montage
  const [formChannelOpen, setFormChannelOpen] = useState(false);

  //Montage dialog
  const [channels, setChannels] = useState([]);
  const [sleepApnea, setSleepApnea] = useState([]);
  const [sleepStage, setSleepStage] = useState([]);

  const [checked, setChecked] = useState([]);
  const channelsChecked = intersection(checked, channels);
  const sleepApneaChecked = intersection(checked, sleepApnea);
  const sleepStageChecked = intersection(checked, sleepStage);

  //Charts Data
  const [sleepApneaCharts, setSleepApneaCharts] = useState({});
  const [sleepStageCharts, setSleepStageCharts] = useState({});

  //Select Montage
  async function fetchData(channelLabel) {
    let chartsLabel = [];
    let chartsData = [];
    let charts = [];
    await fetch("/lineCharts/P0003_24062022_025830.edf/" + channelLabel)
      .then((res) => res.json())
      .then((data) => {
        charts.push({
          chartLabel: data.channelLabel,
          chartData: data.chartsData[0].data,
        });
      });
    setSleepApneaCharts(charts);
  }

  const handleMontageOpen = () => {
    setFormChannelOpen(true);
  };
  const handleMontageClose = () => {
    setFormChannelOpen(false);
  };
  const handleMontageSelect = () => {
    setFormChannelOpen(false);

    // Sleep Apnea Data
    if (sleepApnea.length > 0) {
      for (let i = 0; i < sleepApnea.length; i++) {
        fetchData(sleepApnea[i]);
      }
    }

    // Sleep Stage Data
    if (sleepStage.length > 0) {
      for (let i = 0; i < sleepStage.length; i++) {
        fetchData(sleepApnea[i]);
      }
    }
  };

  //Montage dialog
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

  useEffect(() => {
    fetch("/montage/P0003_24062022_025830.edf")
      .then((res) => res.json())
      .then((data) => {
        setChannels(data.signal_labels);
      });
  }, []);

  return (
    <div>
      <AppBar />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100%",
          overflow: "auto",
        }}
      >
        <CssBaseline />
        <Container sx={{ mt: 1, mb: 1, height: "100%" }}>
          <Grid container spacing={1} sx={{ height: "100%" }}>
            {/* Option bar */}
            <Grid item xs={12}>
              <Paper sx={{ px: 2, display: "flex", flexDirection: "column" }}>
                {/* Setting */}
                <Grid
                  sx={{ px: 2 }}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      onClick={handleMontageOpen}
                      size="small"
                    >
                      MONTAGE
                    </Button>
                    <Dialog open={formChannelOpen} onClose={handleMontageClose}>
                      <DialogTitle>Montage</DialogTitle>
                      <DialogContent>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                        >
                          {/* channels */}
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
                                        disabled={
                                          sleepApneaChecked.length === 0
                                        }
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
                                        disabled={
                                          sleepStageChecked.length === 0
                                        }
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
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      variant="contained"
                      onClick={handleMontageOpen}
                      size="small"
                    >
                      <NavigateBeforeIcon
                        sx={{ display: { xs: "none", md: "flex" } }}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" justifyContent="center">
                      <h3>01/01/1985 20.29.59 - 01/01/1985 20.31.59</h3>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      variant="contained"
                      onClick={handleMontageOpen}
                      size="small"
                    >
                      <NavigateNextIcon
                        sx={{ display: { xs: "none", md: "flex" } }}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Box display="flex" justifyContent="flex-end">
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
            </Grid>
            {/* Hypnogram */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  py: 1,
                  pl: 5,
                  pr: 10,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ReportHypnogram />
              </Paper>
            </Grid>
            {/* Sleep Apnea */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  py: 1,
                  pl: 5,
                  pr: 10,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: sleepApneaColorBody,
                  height: "32vh",
                }}
              >
                <ReportCharts />
              </Paper>
            </Grid>
            {/* Sleep Stage */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  pt: 2,
                  pl: 5,
                  pr: 10,
                  pb: 2,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: sleepStageColorBody,
                  height: "32vh",
                }}
              >
                <ReportCharts />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default function Report2() {
  return <Report2Content />;
}
