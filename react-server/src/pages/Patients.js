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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CircleIcon from "@mui/icons-material/Circle";

import AppBar from "../components/AppBar";
import Title from "../components/Title";
import PatientData from "../components/PatientData";

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

function FilterDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [selectedFilter, setSelectedFilter] = React.useState(0);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (event, selectedFilter) => {
    setSelectedFilter(selectedFilter);
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Filter by model running stage</DialogTitle>
      <List>
        <ListItemButton
          onClick={(event) => handleListItemClick(event, "Complete")}
        >
          <CircleIcon fontSize="small" />
          &nbsp;&nbsp;&nbsp;
          <ListItemText primary="Complete" />
        </ListItemButton>
        <ListItemButton
          onClick={(event) => handleListItemClick(event, "In progress")}
        >
          <CircleIcon fontSize="small" size="small" />
          &nbsp;&nbsp;&nbsp;
          <ListItemText primary="In progress" />
        </ListItemButton>
      </List>
    </Dialog>
  );
}

function PatientListContent() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [formUploadOpen, setFormUploadOpen] = useState(false);
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

  // Search
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Filter
  const handleFilterOpen = () => {
    setFilterOpen(true);
  };
  const handleFilterClose = (value) => {
    setFilterOpen(false);
    //setSelectedFilterValue(value);
  };

  // Sort

  // Form upload
  const handleClickOpen = () => {
    setFormUploadOpen(true);
  };
  const handleClose = () => {
    setFormUploadOpen(false);
  };
  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUpload = () => {
    const data = new FormData();
    data.append("file", file);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ imageURL: `http://localhost:5000/${body}` });
      });
    });

    setFormUploadOpen(false);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Filter</MenuItem>
      <MenuItem onClick={handleMenuClose}>Sort by</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <FilterAltIcon />
        </IconButton>
        <p>Filter</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <ImportExportIcon />
        </IconButton>
        <p>Sort</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <FileUploadIcon />
        </IconButton>
        <p>Import Data</p>
      </MenuItem>
    </Menu>
  );

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
          <CssBaseline />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Patient Data */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {/* Title */}
                  <Title>Patients</Title>
                  {/* Toolbar */}
                  <StyledToolbar>
                    {/* Search */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search for patient ..."
                          inputProps={{ "aria-label": "search" }}
                          onChange={handleSearch}
                        />
                      </Search>
                    </Box>
                    {/* [md - xl]: Filter Icon, Sort Icon and Import Data Button */}
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                      <IconButton
                        size="large"
                        aria-label="filter patient data"
                        color="inherit"
                      >
                        <FilterAltIcon onClick={handleFilterOpen} />
                        <FilterDialog
                          open={filterOpen}
                          onClose={handleFilterClose}
                        />
                      </IconButton>
                      <IconButton
                        size="large"
                        aria-label="sort by"
                        color="inherit"
                      >
                        <ImportExportIcon />
                      </IconButton>
                      <StyledImportDataBtn>
                        <label htmlFor="contained-button-file">
                          <Button variant="contained" onClick={handleClickOpen}>
                            Import Data
                          </Button>
                          <Dialog open={formUploadOpen} onClose={handleClose}>
                            <DialogTitle>Import Patient Data</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                To import patient data to this application,
                                please upload EDF file.
                              </DialogContentText>
                              <br />
                              <Input
                                id="importData"
                                type="file"
                                multiple
                                onChange={handleFile}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose}>Cancel</Button>
                              <Button onClick={handleUpload}>Upload</Button>
                            </DialogActions>
                          </Dialog>
                        </label>
                      </StyledImportDataBtn>
                    </Box>
                    {/* [xs - sm]: More Icon */}
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                      <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>
                  </StyledToolbar>
                  {renderMobileMenu}
                  {renderMenu}
                  <PatientData search={search} />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    </Box>
  );
}

export default function PatientList() {
  return <PatientListContent />;
}
