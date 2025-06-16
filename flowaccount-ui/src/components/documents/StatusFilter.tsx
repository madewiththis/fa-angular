"use client";

import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TrafficIcon from "@mui/icons-material/Traffic";

interface StatusCounts {
  [key: string]: number;
}

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  counts?: StatusCounts;
}

export default function StatusFilter({
  value,
  onChange,
  counts,
}: StatusFilterProps) {
  const defaultCounts = {
    All: 42,
    Awaiting: 8,
    Approved: 15,
    Issued: 12,
    Rejected: 3,
    Partials: 2,
    Deposited: 1,
    Deleted: 1,
  };

  const statusCounts = counts || defaultCounts;

  const statusOptions = [
    { label: "All", count: statusCounts["All"] || 0 },
    { label: "Awaiting", count: statusCounts["Awaiting"] || 0 },
    { label: "Approved", count: statusCounts["Approved"] || 0 },
    { label: "Issued", count: statusCounts["Issued"] || 0 },
    { label: "Rejected", count: statusCounts["Rejected"] || 0 },
    { label: "Partials", count: statusCounts["Partials"] || 0 },
    { label: "Deposited", count: statusCounts["Deposited"] || 0 },
    { label: "Deleted", count: statusCounts["Deleted"] || 0 },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  const getSelectedCount = () => {
    const selected = statusOptions.find((option) => option.label === value);
    return selected ? selected.count : 0;
  };

  return (
    <FormControl size="small">
      <Select
        value={value}
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
