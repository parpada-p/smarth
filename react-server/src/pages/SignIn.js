import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const theme = createTheme({
  palette: {
    background: {
      paper: "#ffffff",
      default: "#1976d2",
    },
  },
});
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    padding: 0,
    minHeight: 0,
    textTransform: "none",
    fontSize: "0.75rem",
    color: "#1976d2",
    textDecoration: "underline",
    textDecorationColor: "rgba(25, 118, 210, 0.4)",
    "&:hover": {
      textDecorationColor: "#1976d2",
    },
  })
);

// Tabs, TabPanel
function handleTabs(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Copyright(props) {
  return (
    <Typography variant="body2" color="common.white" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="http://localhost:3000">
        SMART-H
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  const handleSignUp = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      cfpassword: data.get("cfpassword"),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#ffffff" }}>
            <LocalHospitalIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            color="common.white"
            sx={{ mb: 4 }}
          >
            SMART-H
          </Typography>

          <Paper elevation={0} sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                centered
              >
                <Tab label="Sign In" {...handleTabs(0)} />
                <Tab label="Sign Up" {...handleTabs(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Box component="form" onSubmit={handleSignIn} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  componentsProps={{ typography: { variant: "caption" } }}
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  href="/patients"
                >
                  Sign In
                </Button>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="fullWidth"
                  centered
                  TabIndicatorProps={{
                    sx: { backgroundColor: "white" },
                  }}
                >
                  <Link href="#" variant="caption">
                    Forgot password?
                  </Link>
                  <StyledTab
                    label="Don't have an account? Sign Up"
                    {...handleTabs(1)}
                  />
                </Tabs>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box component="form" onSubmit={handleSignUp} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="cfpassword"
                  label="Confirm Password"
                  type="password"
                  id="cfpassword"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  componentsProps={{ typography: { variant: "caption" } }}
                  control={<Checkbox value="remember" color="primary" />}
                  label="I have read and agree to the Terms of Service"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  href="/signin"
                >
                  Sign Up
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
