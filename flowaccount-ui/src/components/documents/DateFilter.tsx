"use client";

import React, { useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const dateOptions = [
  { label: "All", description: "All" },
  { label: "Current Month", description: "This month" },
  { label: "Previous Month", description: "Last month" },
  { label: "Date Range", description: "Custom range" },
  { label: "Current Year", description: "This year" },
  { label: "Previous Year", description: "Last year" },
  { label: "As At", description: "As at date" },
  { label: "Fiscal Year", description: "Financial year" },
  { label: "Quarter", description: "Quarterly" },
];

export default function DateFilter() {
  const [selectedDate, setSelectedDate] = useState<string>("All");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedDate(event.target.value);
  };

  return (
    <FormControl size="small">
      <Select
        value={selectedDate}
        onChange={handleChange}
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          minWidth: 140,
          borderRadius: "50px",
          backgroundColor: "#f5f5f5",
          border: "none",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiSelect-select": {
            paddingY: 1,
            paddingX: 2,
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: "#eeeeee",
          },
        }}
        renderValue={(value) => (
          <div className="flex items-center">
            <CalendarMonthIcon
              sx={{ fontSize: 16, color: "#666", marginRight: 0.5 }}
            />
            <Chip
              label={value}
              size="small"
              sx={{
                marginLeft: 1,
                backgroundColor: "#fff3e0",
                color: "#ff8f00",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </div>
        )}
      >
        {dateOptions.map((option) => (
          <MenuItem
            key={option.label}
            value={option.label}
            sx={{
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <div className="flex flex-col">
              <span>{option.label}</span>
              <span className="text-xs text-gray-500 mt-0.5">
                {option.description}
              </span>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
