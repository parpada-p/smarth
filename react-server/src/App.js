import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// Pages
import SignIn from "./pages/SignIn";
import Patients from "./pages/Patients";
import Dashboard from "./pages/Dashboard";
import Report1 from "./pages/Report1";
import Report2 from "./pages/Report2";
import Report3 from "./pages/Report3";
import Report4 from "./pages/Report4";
import Report5 from "./pages/Report5";
import Report6 from "./pages/Report6";
import Report7 from "./pages/Report7";

import Test from "./pages/Test";
import ChartJS_DataDecimation from "./pages/ChartJS_DataDecimation";
import ChartJS_Gradient from "./pages/ChartJS_Gradient";
import ChartJS_Line from "./pages/ChartJS_Line";
import ChartJS_BarChart from "./components/LineCharts";
import ChartJS_DateFormat from "./pages/ChartJS_DateFormat";
import RechartLine from "./pages/Rechart_Line";
import MUI_Slider from "./pages/MUI_Slider";
import FileReader from "./pages/FileReader";
import TransferList from "./pages/TransferList";
import ScreenCapture from "./pages/ScreenCapture";
import ScreenShot from "./pages/ScreenShot";

function App() {
  const [data, setData] = useState([{}]);

  const Input = styled("input")({
    display: "none",
  });

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/dashboard/:filename" element={<Dashboard />} />
          <Route path="/report1/:filename" element={<Report1 />} />
          <Route path="/report2/:filename" element={<Report2 />} />
          <Route path="/report3/:filename" element={<Report3 />} />
          <Route path="/report4/:filename" element={<Report4 />} />
          <Route path="/report5/:filename" element={<Report5 />} />
          <Route path="/report6/:filename" element={<Report6 />} />
          <Route path="/report7/:filename" element={<Report7 />} />

          <Route path="/test" element={<Test />} />
          <Route path="/decimation" element={<ChartJS_DataDecimation />} />
          <Route path="/line" element={<ChartJS_Line />} />
          <Route path="/gradient" element={<ChartJS_Gradient />} />
          <Route path="/dateformat" element={<ChartJS_DateFormat />} />
          <Route path="/slider" element={<MUI_Slider />} />
          <Route path="/filereader" element={<FileReader />} />
          <Route path="/transferlist" element={<TransferList />} />
          <Route path="/rechartLine" element={<RechartLine />} />

          <Route path="/ScreenCapture" element={<ScreenCapture />} />
          <Route path="/ScreenShot" element={<ScreenShot />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
