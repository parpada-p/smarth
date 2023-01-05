import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import SummarizeIcon from "@mui/icons-material/Summarize";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Generate Patient Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function PatientData(props) {
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState([{}]);
  const [patients, setPatients] = useState([]);
  const [predictResult, setPredictResult] = useState([{}]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/patientData")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });

    fetch("/predictResult")
      .then((res) => res.json())
      .then((data) => {
        setPredictResult(data);
      });
  }, [counter]);

  useEffect(() => {
    const searchID = "P000" + props.search;
    const searchName = "Patient_P000" + props.search;

    const patientData = [];
    if (data.patientData !== undefined) {
      for (let i = 0; i < data.patientData.length; i++) {
        if (data.patientData[i].Status == "Complete") {
          patientData.push({
            id: data.patientData[i].PID,
            name: data.patientData[i].PName,
            avg_ahi: predictResult.avgAHI,
            diagnosis: predictResult.diagnosis,
            model_stage: data.patientData[i].Status,
            test_date: data.patientData[i].MeasurementDate,
          });
        } else {
          patientData.push({
            id: data.patientData[i].PID,
            name: data.patientData[i].PName,
            avg_ahi: "-",
            diagnosis: "-",
            model_stage: data.patientData[i].Status,
            test_date: data.patientData[i].MeasurementDate,
          });
        }
      }
    }

    if (props.search === "") {
      setPatients(patientData);
    } else {
      const filteredData = patientData.filter((patient) => {
        return patient.id === searchID && patient.name === searchName;
      });
      setPatients(filteredData);
    }
  }, [data, props.search, props.filter]);

  return (
    <React.Fragment>
      <div>
        {patients.id === "undefined" ? (
          <p>There is no data to display. Please upload data</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>PID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Avg.AHI</StyledTableCell>
                  <StyledTableCell>Diagnosis</StyledTableCell>
                  <StyledTableCell align="center">
                    Model running stage
                  </StyledTableCell>
                  <StyledTableCell>Measurement date</StyledTableCell>
                  <StyledTableCell align="center">Dashboard</StyledTableCell>
                  <StyledTableCell align="center">Report</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>{row.avg_ahi}</StyledTableCell>
                    <StyledTableCell>{row.diagnosis}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.model_stage === "Complete" ? (
                        <Typography color="#43A047">
                          {row.model_stage}
                        </Typography>
                      ) : row.model_stage === "In Progress" ? (
                        <Typography color="#FF0000">
                          {row.model_stage}
                        </Typography>
                      ) : (
                        <Typography color="primary">
                          {row.model_stage}
                        </Typography>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{row.test_date}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.model_stage === "Complete" ? (
                        <Link href={"dashboard/" + row.id}>
                          <SummarizeIcon />
                        </Link>
                      ) : (
                        "-"
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.model_stage === "Complete" ? (
                        <Link href={"report7/" + row.id}>
                          <SsidChartIcon />
                        </Link>
                      ) : (
                        "-"
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </React.Fragment>
  );
}
