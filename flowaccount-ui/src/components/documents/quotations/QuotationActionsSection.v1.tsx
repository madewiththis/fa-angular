"use client";

import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import IosShareIcon from "@mui/icons-material/IosShare";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DeleteIcon from "@mui/icons-material/Delete";

interface QuotationActionsSectionProps {
  quotationId: string;
  onClose: () => void;
  spacing: {
    menuPadding: string;
    sectionGap: string;
    gridGap: string;
    actionButtonPadding: string;
  };
}

const QuotationActionsSection: React.FC<QuotationActionsSectionProps> = ({
  quotationId,
  onClose,
  spacing,
}) => {
  return (
    <div className={`bg-white rounded-3xl ${spacing.menuPadding}`}>
      <div className={`grid grid-cols-2 ${spacing.gridGap}`}>
        {/* Left Column */}
        <div className={`flex flex-col ${spacing.sectionGap}`}>
          <button
            onClick={() => {
              console.log(`Print quotation ${quotationId}`);
              onClose();
            }}
            className={`flex items-center gap-2 ${spacing.actionButtonPadding} text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
          >
            <PrintIcon sx={{ fontSize: 16 }} />
            Print
          </button>

          <button
            onClick={() => {
              console.log(`Share quotation ${quotationId}`);
              onClose();
            }}
            className={`flex items-center gap-2 ${spacing.actionButtonPadding} text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
          >
            <IosShareIcon sx={{ fontSize: 16 }} />
            Share
          </button>

          <button
            onClick={() => {
              console.log(`Download quotation ${quotationId}`);
              onClose();
            }}
            className={`flex items-center gap-2 ${spacing.actionButtonPadding} text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
          >
            <FileDownloadIcon sx={{ fontSize: 16 }} />
            Download
          </button>

          <button
            onClick={() => {
              console.log(`Create shipping label for quotation ${quotationId}`);
              onClose();
            }}
            className={`flex items-center gap-2 ${spacing.actionButtonPadding} text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
          >
            <LocalShippingIcon sx={{ fontSize: 16 }} />
            Shipping Label
          </button>
        </div>

        {/* Right Column */}
        <div className={`flex flex-col ${spacing.sectionGap}`}>
          <button
            onClick={() => {
              console.log(`Duplicate quotation ${quotationId}`);
              onClose();
            }}
            className={`flex items-center gap-2 ${spacing.actionButtonPadding} text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
          >
            <FileCopyIcon sx={{ fontSize: 16 }} />
            Duplicate
          </button>

          <button
            onClick={() => {
              console.log(`Delete quotation ${quotationId}`);
              onClose();
            }}
            className={`flex items-center gap-2 ${spacing.actionButtonPadding} text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationActionsSection;
