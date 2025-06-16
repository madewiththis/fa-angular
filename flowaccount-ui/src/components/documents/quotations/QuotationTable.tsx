"use client";

import { useState, useRef, useMemo } from "react";
import DataTable, { Column } from "../../common/DataTable";
import QuotationStatusBadge, { QuotationStatus } from "./QuotationStatusBadge";
import QuotationActionMenu, {
  DocumentType,
  QuotationActionMenuRef,
} from "./QuotationActionMenu";

interface Quotation {
  id: string;
  quotation: string;
  status: QuotationStatus;
  totalAmount: string;
  docDate: string;
  customer: string;
}

interface QuotationTableProps {
  searchValue: string;
  statusFilter: string;
  dateFilter: string;
}

const initialQuotations: Quotation[] = [
  {
    id: "QT202506090001",
    quotation: "QT202506090001",
    status: "Awaiting",
    totalAmount: "250.00",
    docDate: "2024-07-22",
    customer: "Acme Corporation",
  },
  {
    id: "QT202506090002",
    quotation: "QT202506090002",
    status: "Approved",
    totalAmount: "150.00",
    docDate: "2024-07-22",
    customer: "Tech Solutions Ltd",
  },
  {
    id: "QT202506090003",
    quotation: "QT202506090003",
    status: "Issued",
    totalAmount: "350.00",
    docDate: "2024-07-22",
    customer: "Global Industries",
  },
  {
    id: "QT202506090004",
    quotation: "QT202506090004",
    status: "Partials",
    totalAmount: "450.00",
    docDate: "2024-07-22",
    customer: "Digital Ventures",
  },
  {
    id: "QT202506090005",
    quotation: "QT202506090005",
    status: "Deposited",
    totalAmount: "550.00",
    docDate: "2024-07-22",
    customer: "Innovation Inc",
  },
  {
    id: "QT202506090006",
    quotation: "QT202506090006",
    status: "Rejected",
    totalAmount: "200.00",
    docDate: "2024-07-22",
    customer: "Startup Company",
  },
  {
    id: "QT202506090007",
    quotation: "QT202506090007",
    status: "Awaiting",
    totalAmount: "300.00",
    docDate: "2024-07-22",
    customer: "Enterprise Solutions",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function QuotationTable({
  searchValue,
  statusFilter,
  dateFilter,
}: QuotationTableProps) {
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const actionMenuRefs = useRef<Record<string, QuotationActionMenuRef | null>>(
    {}
  );

  // Filter the quotations based on search and status filter
  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      // Status filter
      const matchesStatus =
        statusFilter === "All" || quotation.status === statusFilter;

      // Search filter
      const searchTerm = searchValue.toLowerCase();
      const matchesSearch =
        searchValue === "" ||
        quotation.customer.toLowerCase().includes(searchTerm) ||
        quotation.quotation.toLowerCase().includes(searchTerm) ||
        quotation.id.toLowerCase().includes(searchTerm) ||
        quotation.totalAmount.toLowerCase().includes(searchTerm);

      // Date filter (basic implementation for now)
      const matchesDate =
        dateFilter === "All" ||
        (dateFilter === "Current Month" && isCurrentMonth(quotation.docDate)) ||
        (dateFilter === "Previous Month" &&
          isPreviousMonth(quotation.docDate)) ||
        (dateFilter === "Current Year" && isCurrentYear(quotation.docDate)) ||
        (dateFilter === "Previous Year" && isPreviousYear(quotation.docDate));

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [quotations, searchValue, statusFilter, dateFilter]);

  // Helper functions for date filtering
  const isCurrentMonth = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const isPreviousMonth = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return (
      date.getMonth() === prevMonth.getMonth() &&
      date.getFullYear() === prevMonth.getFullYear()
    );
  };

  const isCurrentYear = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.getFullYear() === now.getFullYear();
  };

  const isPreviousYear = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() - 1;
  };

  const handleStatusChange = (
    quotationId: string,
    newStatus: QuotationStatus
  ) => {
    setQuotations((prev) =>
      prev.map((quote) =>
        quote.id === quotationId ? { ...quote, status: newStatus } : quote
      )
    );
  };

  const handleCreateDocument = (
    quotationId: string,
    docType: string,
    docSubType: DocumentType
  ) => {
    // Here you would implement the actual document creation logic
    console.log(
      `Creating ${docSubType} ${docType} for quotation ${quotationId}`
    );

    // The status change is handled automatically in the QuotationActionMenu component
  };

  const handleRowClick = (quotation: Quotation, event: React.MouseEvent) => {
    const menuRef = actionMenuRefs.current[quotation.id];
    if (menuRef) {
      menuRef.openMenu({ x: event.clientX, y: event.clientY });
    }
  };

  const columns: Column<Quotation>[] = [
    {
      accessor: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" />
        </div>
      ),
      header: (
        <div onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" />
        </div>
      ),
      className: "w-3",
    },
    {
      accessor: "docDate",
      header: "Doc Date",
      className: "w-8",
      cell: (item) => (
        <div className="font-medium">{formatDate(item.docDate)}</div>
      ),
    },
    {
      accessor: "quotation",
      header: "Doc No",
      className: "w-16",
    },
    {
      accessor: "customer",
      header: "Customer/Project",
    },
    {
      accessor: "totalAmount",
      header: "Grand Total",
      className: "text-right w-24 whitespace-nowrap",
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-24",
      cell: (item) => (
        <div className="w-full max-w-full">
          <QuotationStatusBadge status={item.status} />
        </div>
      ),
    },
    {
      accessor: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          <QuotationActionMenu
            ref={(ref) => {
              actionMenuRefs.current[item.id] = ref;
            }}
            quotationId={item.id}
            currentStatus={item.status}
            onStatusChange={(newStatus) =>
              handleStatusChange(item.id, newStatus)
            }
            onCreateDocument={(docType, docSubType) =>
              handleCreateDocument(item.id, docType, docSubType)
            }
          />
        </div>
      ),
      header: "",
      className: "w-12",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredQuotations}
      onRowClick={handleRowClick}
    />
  );
}
