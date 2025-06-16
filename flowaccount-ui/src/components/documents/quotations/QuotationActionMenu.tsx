"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { QuotationStatus } from "./QuotationStatusBadge";
import QuotationStatusSection from "./QuotationStatusSection";
import QuotationDocumentSection from "./QuotationDocumentSection";
import QuotationActionsSection from "./QuotationActionsSection";

export type DocumentType = "Standard" | "Partials" | "Deposited";

export interface QuotationActionMenuRef {
  openMenu: (cursorPosition?: { x: number; y: number }) => void;
}

interface QuotationActionMenuProps {
  quotationId: string;
  currentStatus: QuotationStatus;
  onStatusChange: (newStatus: QuotationStatus) => void;
  onCreateDocument: (docType: string, docSubType: DocumentType) => void;
  onMenuToggle?: () => void;
}

const QuotationActionMenu = forwardRef<
  QuotationActionMenuRef,
  QuotationActionMenuProps
>(
  (
    {
      quotationId,
      currentStatus,
      onStatusChange,
      onCreateDocument,
      onMenuToggle,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      openMenu: (cursorPosition?: { x: number; y: number }) =>
        handleToggleMenu(cursorPosition),
    }));

    // Spacing constants
    const spacing = {
      menuPadding: "p-3",
      sectionGap: "space-y-1",
      buttonGap: "gap-1.5",
      gridGap: "gap-1.5",
      statusButtonPadding: "px-3 py-1.5",
      actionButtonPadding: "px-2.5 py-1",
      docButtonPadding: "px-2.5 py-1",
      sectionMargin: "mb-2",
      borderSpacing: "pt-2",
    };

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleToggleMenu = (cursorPosition?: { x: number; y: number }) => {
      onMenuToggle?.();
      if (!isOpen) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const menuHeight = 320; // Approximate height of the menu
        const menuWidth = 384; // 96 * 4 = 384px (w-96)

        let leftPosition: number;
        let topPosition: number;

        if (cursorPosition) {
          // Position menu centered horizontally on cursor
          leftPosition = cursorPosition.x - menuWidth / 2;
          topPosition = cursorPosition.y + 10; // 10px below cursor
        } else if (buttonRef.current) {
          // Original button-based positioning
          const rect = buttonRef.current.getBoundingClientRect();

          // Position the menu so its right edge is 10px to the left of the button
          leftPosition = rect.left - menuWidth - 10;

          // Position menu so its top is aligned with the button top
          topPosition = rect.top;
        } else {
          // Fallback positioning
          leftPosition = 10;
          topPosition = 10;
        }

        // Ensure menu doesn't go off the left edge
        if (leftPosition < 10) {
          leftPosition = 10; // 10px margin from left edge
        }

        // Ensure menu doesn't go off the right edge
        if (leftPosition + menuWidth > viewportWidth - 10) {
          leftPosition = viewportWidth - menuWidth - 10; // 10px margin from right edge
        }

        // Ensure menu doesn't go off the top edge
        if (topPosition < 10) {
          topPosition = 10; // 10px margin from top
        }

        // Ensure menu doesn't go off the bottom edge
        if (topPosition + menuHeight > viewportHeight - 10) {
          topPosition = viewportHeight - menuHeight - 10; // 10px margin from bottom
        }

        setMenuPosition({
          top: topPosition,
          left: leftPosition,
        });
      }
      setIsOpen(!isOpen);
    };

    // Document creation availability logic
    const canCreateDocuments =
      currentStatus === "Awaiting" || currentStatus === "Approved";

    const handleCreateDocument = (
      docType: string,
      docSubType: DocumentType
    ) => {
      // Here you would implement the actual document creation logic
      console.log(
        `Creating ${docSubType} ${docType} for quotation ${quotationId}`
      );

      onCreateDocument(docType, docSubType);

      // Auto-update status based on document type
      if (docSubType === "Standard") {
        onStatusChange("Issued");
      } else if (docSubType === "Partials") {
        onStatusChange("Partials");
      } else if (docSubType === "Deposited") {
        onStatusChange("Deposited");
      }

      setIsOpen(false);
    };

    return (
      <>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => handleToggleMenu()}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div
            ref={menuRef}
            className="fixed bg-gray-100 rounded-3xl shadow-lg p-1 z-[100] w-96"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <div className={spacing.sectionGap}>
              {/* Status Changes Section */}
              <QuotationStatusSection
                currentStatus={currentStatus}
                onStatusChange={onStatusChange}
                onClose={() => setIsOpen(false)}
                spacing={{
                  menuPadding: spacing.menuPadding,
                  statusButtonPadding: spacing.statusButtonPadding,
                }}
              />

              {/* Document Creation Section */}
              <QuotationDocumentSection
                canCreateDocuments={canCreateDocuments}
                onCreateDocument={handleCreateDocument}
                onClose={() => setIsOpen(false)}
                spacing={{
                  menuPadding: spacing.menuPadding,
                  sectionGap: spacing.sectionGap,
                  buttonGap: spacing.buttonGap,
                  docButtonPadding: spacing.docButtonPadding,
                }}
              />

              {/* Additional Actions Section */}
              <QuotationActionsSection
                quotationId={quotationId}
                onClose={() => setIsOpen(false)}
                spacing={{
                  menuPadding: spacing.menuPadding,
                  sectionGap: spacing.sectionGap,
                  gridGap: spacing.gridGap,
                  actionButtonPadding: spacing.actionButtonPadding,
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }
);

QuotationActionMenu.displayName = "QuotationActionMenu";

export default QuotationActionMenu;
