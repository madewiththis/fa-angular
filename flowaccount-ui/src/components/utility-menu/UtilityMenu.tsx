import React from "react";
import Apps from "./Apps";
import Settings from "./Settings";
import CloseIcon from "@mui/icons-material/Close";

// UtilityMenu component
interface UtilityMenuProps {
  isMainMenuExpanded: boolean;
  onClose: () => void;
}

const UtilityMenu: React.FC<UtilityMenuProps> = ({
  isMainMenuExpanded,
  onClose,
}) => {
  const mainMenuExpandedWidth = 240; // in pixels
  const mainMenuCollapsedWidth = 72; // in pixels
  const gap = 16; // in pixels

  const leftPosition = isMainMenuExpanded
    ? mainMenuExpandedWidth + gap
    : mainMenuCollapsedWidth + gap;

  return (
    <div
      className="fixed bottom-4 bg-white rounded-lg shadow-lg p-4 z-50"
      style={{ left: `${leftPosition}px`, bottom: `${gap}px` }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        <CloseIcon />
      </button>
      <div className="flex">
        <Apps />
        <Settings />
      </div>
    </div>
  );
};

export default UtilityMenu;
