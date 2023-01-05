import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const handleFile = (event) => {
  console.log(event.target.files[0]);
};

export default function FileReader() {
  return (
    <label htmlFor="contained-button-file">
      <Input id="importData" type="file" onChange={handleFile} />
      <Button variant="contained" component="span">
        Upload
      </Button>
    </label>
  );
}
