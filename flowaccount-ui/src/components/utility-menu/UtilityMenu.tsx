import React from "react";
import Apps from "./Apps";
import Settings from "./Settings";

// UtilityMenu component
interface UtilityMenuProps {
  content: "Apps" | "Settings";
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const UtilityMenu: React.FC<UtilityMenuProps> = ({
  content,
  onMouseEnter,
  onMouseLeave,
}) => {
  const gap = 50; // in pixels

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg p-4 z-50"
      style={{ left: `${gap}px`, bottom: `${gap}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex">
        {content === "Apps" && <Apps />}
        {content === "Settings" && <Settings />}
      </div>
    </div>
  );
};

export default UtilityMenu;
