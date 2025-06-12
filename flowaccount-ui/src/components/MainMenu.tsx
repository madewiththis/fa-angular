import "./MenuStyle.css";
import Image from "next/image";
import { mainMenu, bottomMenu, MenuItem } from "./menuData";
import { useState } from "react";

interface MainMenuProps {
  mainMenu?: MenuItem[];
  bottomMenu?: MenuItem[];
  selectedMenu?: string;
  onSelectMenu?: (label: string) => void;
}

export default function MainMenu({
  mainMenu: mainMenuProp,
  bottomMenu: bottomMenuProp,
  onSelectMenu,
}: MainMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const main = mainMenuProp || mainMenu;
  const bottom = bottomMenuProp || bottomMenu;
  return (
    <aside
      className={`mainmenu${isCollapsed ? " collapsed" : ""}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex flex-col flex-grow justify-between h-full w-full">
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="p-2 mb-2 mt-4">
              <Image
                src="/fa_logo_dark.png"
                alt="FlowAccount Logo"
                width={32}
                height={32}
                priority
              />
            </div>
          </div>
          <nav className="flex flex-col gap-0">
            {main.map((item) => (
              <a
                key={item.label}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMenu?.(item.label);
                }}
                className="menu-item"
              >
                <span>{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-0 mb-4">
          {bottom.map((item) => (
            <a key={item.label} href="#" className="menu-item relative">
              <span>{item.icon}</span>
              <span className="menu-text">{item.label}</span>
              {item.notification && (
                <span className="absolute right-4 top-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
