import React from "react";
import Apps from "./Apps";
import Settings from "./Settings";
import Profile from "./Profile";

// UtilityMenu component
interface UtilityMenuProps {
  content: "Apps" | "Settings" | "Profile";
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const UtilityMenu: React.FC<UtilityMenuProps> = ({
  content,
  onMouseEnter,
  onMouseLeave,
}) => {
  const menuPositions = {
    Profile: { left: 120, bottom: 20 },
    Apps: { left: 120, bottom: 70 },
    Settings: { left: 120, bottom: 20 },
  };

  const currentPosition = menuPositions[content];

  return (
    <div
      className="fixed bg-gray-100 rounded-3xl shadow-lg p-1 z-100"
      style={{
        left: `${currentPosition.left}px`,
        bottom: `${currentPosition.bottom}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white rounded-[20px] p-3">
        <div className="flex">
          {content === "Apps" && <Apps />}
          {content === "Settings" && <Settings />}
          {content === "Profile" && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default UtilityMenu;
