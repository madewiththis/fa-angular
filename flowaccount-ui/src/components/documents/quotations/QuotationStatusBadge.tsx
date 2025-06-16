import React from "react";

export type QuotationStatus =
  | "Awaiting"
  | "Issued"
  | "Partials"
  | "Deposited"
  | "Approved"
  | "Rejected";

interface QuotationStatusBadgeProps {
  status: QuotationStatus;
}

const statusConfig = {
  Awaiting: {
    backgroundColor: "#F3F3F5",
    textColor: "#374151",
    borderColor: "#D1D5DB",
    label: "Awaiting",
  },
  Issued: {
    backgroundColor: "#E6F5FC",
    textColor: "#374151",
    borderColor: "#BFDBFE",
    label: "Issued",
  },
  Partials: {
    backgroundColor: "#FDEDF5",
    textColor: "#374151",
    borderColor: "#F9A8D4",
    label: "Partials",
  },
  Deposited: {
    backgroundColor: "#F3E8FF",
    textColor: "#374151",
    borderColor: "#C4B5FD",
    label: "Deposited",
  },
  Approved: {
    backgroundColor: "#FFF6DF",
    textColor: "#374151",
    borderColor: "#FDE68A",
    label: "Approved",
  },
  Rejected: {
    backgroundColor: "#FEEEF0",
    textColor: "#374151",
    borderColor: "#FECACA",
    label: "Rejected",
  },
};

export default function QuotationStatusBadge({
  status,
}: QuotationStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border w-full max-w-full justify-center"
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        borderColor: config.borderColor,
      }}
    >
      {config.label}
    </span>
  );
}
