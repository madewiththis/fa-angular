"use client";
import MainMenu from "./MainMenu";
import SubMenu from "./SubMenu";
import type { ReactNode } from "react";
import {
  mainMenu,
  bottomMenu,
  submenus,
  MenuItem,
  SubMenuItem,
} from "./menuData";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface MenuLayoutProps {
  mainMenu?: MenuItem[];
  bottomMenu?: MenuItem[];
  submenu?: SubMenuItem[];
  children: ReactNode;
}

export default function MenuLayout({
  mainMenu: mainMenuProp,
  bottomMenu: bottomMenuProp,
  submenu: submenuProp,
  children,
}: MenuLayoutProps) {
  const main = mainMenuProp || mainMenu;
  const bottom = bottomMenuProp || bottomMenu;
  const [selectedMenu, setSelectedMenu] = useState<string>(
    main[0]?.label || ""
  );
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSubMenuCollapsed, setIsSubMenuCollapsed] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const sub = submenuProp || submenus[selectedMenu] || [];
  const router = useRouter();
  const pathname = usePathname();
  const handleSubMenuClick = (mainMenuLabel: string) => {
    router.push(`/${mainMenuLabel.toLowerCase()}`);
  };
  const isDashboard = pathname === "/";

  const handleSubMenuToggle = () => {
    setIsSubMenuCollapsed(!isSubMenuCollapsed);
  };

  useEffect(() => {
    if (isDashboard) {
      setIsCollapsed(false);
    }
    const currentPath = pathname.split("/")[1];
    if (currentPath) {
      const newSelectedMenu = main.find(
        (item) => item.label.toLowerCase() === currentPath
      );
      if (newSelectedMenu) {
        setSelectedMenu(newSelectedMenu.label);
      }
    } else {
      setSelectedMenu(""); // No active section on dashboard
    }
  }, [isDashboard, pathname, main]);

  const clearHideTimeout = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  const startHideSubmenuTimeout = () => {
    hideTimeout.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 300);
  };

  const handleMainMenuHover = (label: string | undefined) => {
    clearHideTimeout();
    if (label) {
      setIsCollapsed(false);
      setHoveredMenu(label);
    } else {
      startHideSubmenuTimeout();
    }
  };

  const handleUtilityMenuHover = () => {
    clearHideTimeout();
    startHideSubmenuTimeout();
    setIsCollapsed(false);
  };

  const handleMenuAreaLeave = () => {
    startHideSubmenuTimeout();
    if (!isDashboard) {
      setIsCollapsed(true);
    }
  };

  // The container for both menus handles mouse enter/leave
  const handleMenuAreaEnter = () => {
    clearHideTimeout();
  };

  const handleSubMenuEnter = () => {
    clearHideTimeout();
  };

  // Determine which submenu to show
  const currentSubmenu = isDashboard
    ? hoveredMenu
      ? submenus[hoveredMenu] || []
      : []
    : hoveredMenu
    ? submenus[hoveredMenu] || []
    : sub;

  const submenuTitle = isDashboard
    ? hoveredMenu || ""
    : hoveredMenu || selectedMenu;

  // Determine if submenu should be shown
  const shouldShowSubmenu = isDashboard ? hoveredMenu !== null : true; // Always show for non-dashboard pages

  return (
    <div className="flex min-h-screen">
      <div
        onMouseEnter={handleMenuAreaEnter}
        onMouseLeave={handleMenuAreaLeave}
        className="flex"
        style={{ position: "relative" }}
      >
        <MainMenu
          mainMenu={main}
          bottomMenu={bottom}
          selectedMenu={selectedMenu}
          onSelectMenu={setSelectedMenu}
          isCollapsed={isCollapsed}
          onMainMenuHover={handleMainMenuHover}
          onUtilityMenuHover={handleUtilityMenuHover}
          hoveredMenu={hoveredMenu}
        />
        <div
          onMouseEnter={handleSubMenuEnter}
          className={`submenu-wrapper ${shouldShowSubmenu ? "visible" : ""} ${
            isDashboard ? "dashboard-overlay" : ""
          }`}
        >
          <SubMenu
            submenu={currentSubmenu}
            title={submenuTitle}
            onSubMenuClick={handleSubMenuClick}
            isCollapsed={isSubMenuCollapsed && !hoveredMenu}
            onToggle={handleSubMenuToggle}
            isDashboard={isDashboard}
          />
        </div>
      </div>
      <main
        className={`flex-1 p-8 w-full max-w-none ${
          isDashboard ? "dashboard-content-pusher" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
