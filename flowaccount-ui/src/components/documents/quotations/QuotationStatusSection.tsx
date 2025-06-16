"use client";

import React from "react";
import { QuotationStatus } from "./QuotationStatusBadge";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TaskIcon from "@mui/icons-material/Task";

interface QuotationStatusSectionProps {
  currentStatus: QuotationStatus;
  onStatusChange: (newStatus: QuotationStatus) => void;
  onClose: () => void;
  spacing: {
    menuPadding: string;
    statusButtonPadding: string;
  };
}

const QuotationStatusSection: React.FC<QuotationStatusSectionProps> = ({
  currentStatus,
  onStatusChange,
  onClose,
  spacing,
}) => {
  // Status change availability logic
  const canApprove = currentStatus === "Awaiting";
  const canReject =
    currentStatus === "Awaiting" || currentStatus === "Approved";
  const canMarkAsIssued = currentStatus === "Approved";
  const canReset = currentStatus !== "Awaiting"; // Can only reset when not already awaiting

  const handleStatusChange = (newStatus: QuotationStatus) => {
    onStatusChange(newStatus);
    onClose();
  };

  // Map status to button identifiers for styling
  const getStatusKey = (status: QuotationStatus) => {
    switch (status) {
      case "Approved":
        return "approve";
      case "Rejected":
        return "reject";
      case "Issued":
        return "issued";
      default:
        return "awaiting";
    }
  };

  const currentStatusKey = getStatusKey(currentStatus);

  return (
    <div className={`bg-white rounded-3xl ${spacing.menuPadding}`}>
      <div className="flex justify-between items-center">
        {/* Main Status Segmented Control */}
        <div className="relative flex bg-white rounded-full p-1">
          <button
            onClick={() => canApprove && handleStatusChange("Approved")}
            disabled={!canApprove}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm rounded-full transition-all duration-200 z-10 ${
              currentStatusKey === "approve"
                ? "text-gray-800"
                : canApprove
                ? "cursor-pointer hover:shadow-md hover:scale-105"
                : "text-gray-400 cursor-not-allowed"
            }`}
            style={{
              color:
                currentStatusKey === "approve"
                  ? "#FEA000"
                  : canApprove
                  ? "#FEA000"
                  : undefined,
              backgroundColor:
                currentStatusKey === "approve" ? "#FFF6DF" : "transparent",
              border:
                currentStatusKey === "approve"
                  ? "1px solid #FEA000"
                  : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (canApprove && currentStatusKey !== "approve") {
                e.currentTarget.style.backgroundColor = "#FFF6DF";
                e.currentTarget.style.opacity = "0.8";
              }
            }}
            onMouseLeave={(e) => {
              if (canApprove && currentStatusKey !== "approve") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            {currentStatusKey === "approve" ? "Approved" : "Approve"}
          </button>

          <button
            onClick={() => canReject && handleStatusChange("Rejected")}
            disabled={!canReject}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm rounded-full transition-all duration-200 z-10 ${
              currentStatusKey === "reject"
                ? "text-gray-800"
                : canReject
                ? "cursor-pointer hover:shadow-md hover:scale-105"
                : "text-gray-400 cursor-not-allowed"
            }`}
            style={{
              color:
                currentStatusKey === "reject"
                  ? "#ED5565"
                  : canReject
                  ? "#ED5565"
                  : undefined,
              backgroundColor:
                currentStatusKey === "reject" ? "#FEEEF0" : "transparent",
              border:
                currentStatusKey === "reject"
                  ? "1px solid #ED5565"
                  : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (canReject && currentStatusKey !== "reject") {
                e.currentTarget.style.backgroundColor = "#FEEEF0";
                e.currentTarget.style.opacity = "0.8";
              }
            }}
            onMouseLeave={(e) => {
              if (canReject && currentStatusKey !== "reject") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }
            }}
          >
            <CancelIcon sx={{ fontSize: 16 }} />
            {currentStatusKey === "reject" ? "Rejected" : "Reject"}
          </button>

          <button
            onClick={() => canMarkAsIssued && handleStatusChange("Issued")}
            disabled={!canMarkAsIssued}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm rounded-full transition-all duration-200 z-10 ${
              currentStatusKey === "issued"
                ? "text-gray-800"
                : canMarkAsIssued
                ? "cursor-pointer hover:shadow-md hover:scale-105"
                : "text-gray-400 cursor-not-allowed"
            }`}
            style={{
              color:
                currentStatusKey === "issued"
                  ? "#2998CB"
                  : canMarkAsIssued
                  ? "#2998CB"
                  : undefined,
              backgroundColor:
                currentStatusKey === "issued" ? "#E6F5FC" : "transparent",
              border:
                currentStatusKey === "issued"
                  ? "1px solid #2998CB"
                  : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (canMarkAsIssued && currentStatusKey !== "issued") {
                e.currentTarget.style.backgroundColor = "#E6F5FC";
                e.currentTarget.style.opacity = "0.8";
              }
            }}
            onMouseLeave={(e) => {
              if (canMarkAsIssued && currentStatusKey !== "issued") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.opacity = "1";
              }
            }}
          >
            <TaskIcon sx={{ fontSize: 16 }} />
            {currentStatusKey === "issued" ? "Issued" : "Issue"}
          </button>
        </div>

        {/* Reset Button - Separate */}
        <button
          onClick={() => canReset && handleStatusChange("Awaiting")}
          disabled={!canReset}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
            canReset
              ? "bg-white text-gray-600 hover:text-gray-800 hover:shadow-md hover:scale-105 shadow-sm cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onMouseEnter={(e) => {
            if (canReset) {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
            }
          }}
          onMouseLeave={(e) => {
            if (canReset) {
              e.currentTarget.style.backgroundColor = "white";
            }
          }}
        >
          <RestartAltIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};

export default QuotationStatusSection;
