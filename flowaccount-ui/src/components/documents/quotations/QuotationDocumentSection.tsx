"use client";

import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import { DocumentType } from "./QuotationActionMenu";

interface QuotationDocumentSectionProps {
  canCreateDocuments: boolean;
  onCreateDocument: (docType: string, docSubType: DocumentType) => void;
  onClose: () => void;
  spacing: {
    menuPadding: string;
    sectionGap: string;
    buttonGap: string;
    docButtonPadding: string;
  };
}

const QuotationDocumentSection: React.FC<QuotationDocumentSectionProps> = ({
  canCreateDocuments,
  onCreateDocument,
  onClose,
  spacing,
}) => {
  const handleCreateDocument = (docType: string, docSubType: DocumentType) => {
    onCreateDocument(docType, docSubType);
    onClose();
  };

  return (
    <div className={`bg-white rounded-3xl ${spacing.menuPadding}`}>
      <div className={spacing.sectionGap}>
        {/* Billing Note */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 flex-1 px-2.5`}>
            <DescriptionIcon
              sx={{
                fontSize: 16,
                color: canCreateDocuments ? "#4B5563" : "#9CA3AF",
              }}
            />
            <div
              className={`text-sm font-medium ${
                canCreateDocuments ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Billing Note
            </div>
          </div>
          <div className={`flex ${spacing.buttonGap}`}>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Billing Note", "Standard")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#2998CB", backgroundColor: "#E6F5FC" }
                  : {}
              }
            >
              Full
            </button>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Billing Note", "Partials")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#EC88C1", backgroundColor: "#FDEDF5" }
                  : {}
              }
            >
              Partial
            </button>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Billing Note", "Deposited")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#EC7064", backgroundColor: "#FCF2E6" }
                  : {}
              }
            >
              Deposit
            </button>
          </div>
        </div>

        {/* Delivery Note/Invoice */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 flex-1 px-2.5`}>
            <DescriptionIcon
              sx={{
                fontSize: 16,
                color: canCreateDocuments ? "#4B5563" : "#9CA3AF",
              }}
            />
            <div
              className={`text-sm font-medium ${
                canCreateDocuments ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Delivery Note/Invoice
            </div>
          </div>
          <div className={`flex ${spacing.buttonGap}`}>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Delivery Note/Invoice", "Standard")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#2998CB", backgroundColor: "#E6F5FC" }
                  : {}
              }
            >
              Full
            </button>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Delivery Note/Invoice", "Partials")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#EC88C1", backgroundColor: "#FDEDF5" }
                  : {}
              }
            >
              Partial
            </button>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Delivery Note/Invoice", "Deposited")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#EC7064", backgroundColor: "#FCF2E6" }
                  : {}
              }
            >
              Deposit
            </button>
          </div>
        </div>

        {/* Tax Invoice/Receipt */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 flex-1 px-2.5`}>
            <DescriptionIcon
              sx={{
                fontSize: 16,
                color: canCreateDocuments ? "#4B5563" : "#9CA3AF",
              }}
            />
            <div
              className={`text-sm font-medium ${
                canCreateDocuments ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Tax Invoice/Receipt
            </div>
          </div>
          <div className={`flex ${spacing.buttonGap}`}>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Tax Invoice/Receipt", "Standard")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#2998CB", backgroundColor: "#E6F5FC" }
                  : {}
              }
            >
              Full
            </button>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Tax Invoice/Receipt", "Partials")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#EC88C1", backgroundColor: "#FDEDF5" }
                  : {}
              }
            >
              Partial
            </button>
            <button
              onClick={() =>
                canCreateDocuments &&
                handleCreateDocument("Tax Invoice/Receipt", "Deposited")
              }
              disabled={!canCreateDocuments}
              className={`${
                spacing.docButtonPadding
              } text-xs rounded transition-colors ${
                canCreateDocuments
                  ? "cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={
                canCreateDocuments
                  ? { color: "#EC7064", backgroundColor: "#FCF2E6" }
                  : {}
              }
            >
              Deposit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDocumentSection;
