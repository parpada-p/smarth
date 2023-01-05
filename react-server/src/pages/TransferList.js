import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { lightGreen } from "@mui/material/colors";
import { yellow } from "@mui/material/colors";
import { amber } from "@mui/material/colors";
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

export default function TransferList() {
  const [checked, setChecked] = useState([]);
  const [channels, setChannels] = useState([0, 1, 2, 3]);
  const [sleepApnea, setSleepApnea] = useState(["A", "B", "C", "D"]);
  const [sleepStage, setSleepStage] = useState(["a", "b", "c", "d"]);

  const channelsChecked = intersection(checked, channels);
  const sleepApneaChecked = intersection(checked, sleepApnea);
  const sleepStageChecked = intersection(checked, sleepStage);

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
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
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
          height: 230,
          bgcolor: "background.paper",
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
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
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
          height: 230,
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
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
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
          height: 230,
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
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
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
                <Grid container direction="column" alignItems="center">
                  <Button
                    sx={{ my: 0.5 }}
                    variant="contained"
                    size="small"
                    onClick={handleCheckedChannelsToSleepApnea}
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
              <Grid item>{sleepApneaList("Sleep Apnea", sleepApnea)}</Grid>
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
                <Grid container direction="column" alignItems="center">
                  <Button
                    sx={{ my: 0.5 }}
                    variant="contained"
                    size="small"
                    onClick={handleCheckedChannelsToSleepStage}
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
              <Grid item>{sleepStageList("Sleep Stage", sleepStage)}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
