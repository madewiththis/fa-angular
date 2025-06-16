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
import TrafficIcon from "@mui/icons-material/Traffic";

const statusOptions = [
  { label: "All", count: 42 },
  { label: "Awaiting", count: 8 },
  { label: "Approved", count: 15 },
  { label: "Issued", count: 12 },
  { label: "Rejected", count: 3 },
  { label: "Partials", count: 2 },
  { label: "Deposited", count: 1 },
  { label: "Deleted", count: 1 },
];

export default function StatusFilter() {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  const getSelectedCount = () => {
    const selected = statusOptions.find(
      (option) => option.label === selectedStatus
    );
    return selected ? selected.count : 0;
  };

  return (
    <FormControl size="small">
      <Select
        value={selectedStatus}
        onChange={handleChange}
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          minWidth: 120,
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
            <TrafficIcon
              sx={{ fontSize: 16, color: "#666", marginRight: 0.5 }}
            />
            <Chip
              label={`${value} (${getSelectedCount()})`}
              size="small"
              sx={{
                marginLeft: 1,
                backgroundColor: value === "All" ? "#e3f2fd" : "#f1f8e9",
                color: value === "All" ? "#1976d2" : "#388e3c",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </div>
        )}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.label}
            value={option.label}
            sx={{
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{option.label}</span>
            <Chip
              label={option.count}
              size="small"
              sx={{
                backgroundColor: "#f0f0f0",
                color: "#666",
                fontSize: "0.7rem",
                height: "20px",
                marginLeft: 1,
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
