"use client";

import { useState, useMemo } from "react";
import QuotationTable from "../../../components/documents/quotations/QuotationTable";
import DocumentToolbar from "../../../components/documents/DocumentToolbar";
import { QuotationStatus } from "../../../components/documents/quotations/QuotationStatusBadge";

// Sample data for calculating counts
const initialQuotations = [
  {
    id: "QT202506090001",
    quotation: "QT202506090001",
    status: "Awaiting" as QuotationStatus,
    totalAmount: "250.00",
    docDate: "2024-07-22",
    customer: "Acme Corporation",
  },
  {
    id: "QT202506090002",
    quotation: "QT202506090002",
    status: "Approved" as QuotationStatus,
    totalAmount: "150.00",
    docDate: "2024-07-22",
    customer: "Tech Solutions Ltd",
  },
  {
    id: "QT202506090003",
    quotation: "QT202506090003",
    status: "Issued" as QuotationStatus,
    totalAmount: "350.00",
    docDate: "2024-07-22",
    customer: "Global Industries",
  },
  {
    id: "QT202506090004",
    quotation: "QT202506090004",
    status: "Partials" as QuotationStatus,
    totalAmount: "450.00",
    docDate: "2024-07-22",
    customer: "Digital Ventures",
  },
  {
    id: "QT202506090005",
    quotation: "QT202506090005",
    status: "Deposited" as QuotationStatus,
    totalAmount: "550.00",
    docDate: "2024-07-22",
    customer: "Innovation Inc",
  },
  {
    id: "QT202506090006",
    quotation: "QT202506090006",
    status: "Rejected" as QuotationStatus,
    totalAmount: "200.00",
    docDate: "2024-07-22",
    customer: "Startup Company",
  },
  {
    id: "QT202506090007",
    quotation: "QT202506090007",
    status: "Awaiting" as QuotationStatus,
    totalAmount: "300.00",
    docDate: "2024-07-22",
    customer: "Enterprise Solutions",
  },
];

export default function QuotationPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");

  // Calculate status counts based on search filter (but not status filter)
  const statusCounts = useMemo(() => {
    const searchFilteredData = initialQuotations.filter((quotation) => {
      const searchTerm = searchValue.toLowerCase();
      return (
        searchValue === "" ||
        quotation.customer.toLowerCase().includes(searchTerm) ||
        quotation.quotation.toLowerCase().includes(searchTerm) ||
        quotation.id.toLowerCase().includes(searchTerm) ||
        quotation.totalAmount.toLowerCase().includes(searchTerm)
      );
    });

    const counts: { [key: string]: number } = {
      All: searchFilteredData.length,
    };

    // Count each status
    searchFilteredData.forEach((quotation) => {
      counts[quotation.status] = (counts[quotation.status] || 0) + 1;
    });

    return counts;
  }, [searchValue]);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-4">Quotations</h1>
      <DocumentToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        statusCounts={statusCounts}
      />
      <QuotationTable
        searchValue={searchValue}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
      />
    </div>
  );
}
