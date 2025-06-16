"use client";

import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchInput() {
  const [searchValue, setSearchValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <TextField
      value={searchValue}
      onChange={handleChange}
      placeholder="Customer/Supplier name, Doc No., Project, Detail"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 18, color: "#666" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        minWidth: 400,
        "& .MuiOutlinedInput-root": {
          borderRadius: "50px",
          backgroundColor: "#f5f5f5",
          border: "none",
          "& fieldset": {
            border: "none",
          },
          "&:hover": {
            backgroundColor: "#eeeeee",
          },
          "&.Mui-focused": {
            backgroundColor: "#eeeeee",
            "& fieldset": {
              border: "2px solid #1976d2",
            },
          },
        },
        "& .MuiInputBase-input": {
          paddingY: 1,
          fontSize: "0.875rem",
          "&::placeholder": {
            color: "#999",
            opacity: 1,
          },
        },
      }}
    />
  );
}
