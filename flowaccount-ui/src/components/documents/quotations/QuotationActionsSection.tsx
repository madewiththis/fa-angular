"use client";

import React from "react";
import EditIcon from "@mui/icons-material/EditSquare";
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
  const ActionButton = ({
    icon: Icon,
    label,
    onClick,
    isDestructive = false,
  }: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDestructive?: boolean;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors border ${
          isDestructive
            ? "text-red-600 hover:bg-red-50 border-red-200"
            : "text-gray-700 hover:bg-gray-100 border-gray-200"
        }`}
      >
        <Icon sx={{ fontSize: 18 }} />
      </button>
      <span
        className={`text-xs ${
          isDestructive ? "text-red-600" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className={`bg-white rounded-3xl ${spacing.menuPadding}`}>
      <div
        className={`grid grid-cols-5 ${spacing.gridGap} justify-items-center`}
      >
        <ActionButton
          icon={EditIcon}
          label="Edit"
          onClick={() => {
            console.log(`Edit quotation ${quotationId}`);
            onClose();
          }}
        />

        <ActionButton
          icon={PrintIcon}
          label="Print"
          onClick={() => {
            console.log(`Print quotation ${quotationId}`);
            onClose();
          }}
        />

        <ActionButton
          icon={LocalShippingIcon}
          label="Label"
          onClick={() => {
            console.log(`Create shipping label for quotation ${quotationId}`);
            onClose();
          }}
        />

        <ActionButton
          icon={IosShareIcon}
          label="Share"
          onClick={() => {
            console.log(`Share quotation ${quotationId}`);
            onClose();
          }}
        />

        <ActionButton
          icon={FileDownloadIcon}
          label="Download"
          onClick={() => {
            console.log(`Download quotation ${quotationId}`);
            onClose();
          }}
        />

        <ActionButton
          icon={FileCopyIcon}
          label="Duplicate"
          onClick={() => {
            console.log(`Duplicate quotation ${quotationId}`);
            onClose();
          }}
        />

        <ActionButton
          icon={DeleteIcon}
          label="Delete"
          onClick={() => {
            console.log(`Delete quotation ${quotationId}`);
            onClose();
          }}
          isDestructive={true}
        />
      </div>
    </div>
  );
};

export default QuotationActionsSection;
