import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TextField from "@mui/material/TextField";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import AppBar from "../components/AppBar";
import Hypnogram from "../components/Hypnogram";
import Charts from "../components/Charts";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    padding: 0,
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#F7F7FC",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: 0,
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledImportDataBtn = styled("div")({
  padding: "12px",
});

const Input = styled("input")({
  // display: "none",
});

function ReportContent() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  // Toolbar
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // Form dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [montage, setMontage] = useState(1);
  const [filter, setFilter] = useState("");
  const [amp, setAmp] = useState(5);
  const [wd, setWD] = useState(7);
  const [dateValue, setDateValue] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [edfData, setEdfData] = useState([{}]);
  const [hypnogramData, setHypnogramData] = useState([{}]);
  const [percent_s0, setPercent_s0] = useState("");
  const [percent_s1, setPercent_s1] = useState("");
  const [percent_s2, setPercent_s2] = useState("");
  const [percent_s3, setPercent_s3] = useState("");
  const [percent_s4, setPercent_s4] = useState("");
  const [s0, setS0] = useState("");
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [s3, setS3] = useState("");
  const [s4, setS4] = useState("");
  const [sleep_period, setSleepPeriod] = useState([]);
  const [total_sleep, setTotalSleep] = useState([]);

  const handleMontageChange = (event) => {
    setMontage(event.target.value);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleAmpChange = (event) => {
    setAmp(event.target.value);
  };
  const handleWDChange = (event) => {
    setWD(event.target.value);
  };
  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };
  const handleStartTimeChange = (newValue) => {
    setStartTime(newValue);
  };
  const handleEndTimeChange = (newValue) => {
    setEndTime(newValue);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Option bar */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <br></br>
                {/* Date & Time */}
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                >
                  <Grid item>
                    <Button variant="contained" onClick={handleClickOpen}>
                      <NavigateBeforeIcon
                        sx={{ display: { xs: "none", md: "flex" } }}
                      />
                    </Button>
                  </Grid>
                  <Grid item>
                    <h2>01/01/1985 20.29.59 - 01/01/1985 20.31.59</h2>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={handleClickOpen}>
                      <NavigateNextIcon
                        sx={{ display: { xs: "none", md: "flex" } }}
                      />
                    </Button>
                  </Grid>
                </Grid>
                <br></br>
                {/* Generate report */}
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Button variant="contained" onClick={handleClickOpen}>
                      GENERATE REPORT
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* Charts */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  pt: 2,
                  pl: 5,
                  pr: 10,
                  pb: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Charts />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default function Report() {
  return <ReportContent />;
}
