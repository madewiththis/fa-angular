"use client";

import { SubMenuItem } from "./menuData";
import "./MenuStyle.css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";

interface SubMenuProps {
  submenu?: SubMenuItem[];
  title: string;
  onSubMenuClick?: (mainMenuLabel: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isDashboard?: boolean;
}

export default function SubMenu({
  submenu: submenuProp,
  title,
  onSubMenuClick,
  isCollapsed,
  onToggle,
  isDashboard,
}: SubMenuProps) {
  const [animationClass, setAnimationClass] = useState("fade-in");
  const [displayedTitle, setDisplayedTitle] = useState(title);
  const [displayedSubmenu, setDisplayedSubmenu] = useState(submenuProp);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (title !== displayedTitle) {
      setAnimationClass("fade-out");
      const timer = setTimeout(() => {
        setDisplayedTitle(title);
        setDisplayedSubmenu(submenuProp);
        setAnimationClass("fade-in");
      }, 150);
      return () => clearTimeout(timer);
    }
    // This handles the case where the submenu content might update without a title change
    setDisplayedSubmenu(submenuProp);
  }, [title, submenuProp, displayedTitle]);

  const items = displayedSubmenu || [];

  return (
    <aside
      className={`submenu${isCollapsed ? " collapsed" : ""} ${
        isDashboard ? "dashboard-glass" : ""
      }`}
    >
      <div className={animationClass}>
        <div className="h-20 flex flex-col justify-end">
          <div className="submenu-text flex items-center justify-between">
            {!isCollapsed && <span>{displayedTitle}</span>}
            {!isDashboard ? (
              <button
                onClick={onToggle}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              >
                {isCollapsed ? (
                  <ChevronRight sx={{ fontSize: 20, color: "#2d3748" }} />
                ) : (
                  <ChevronLeft sx={{ fontSize: 20, color: "#2d3748" }} />
                )}
              </button>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        </div>
        {!isCollapsed && (
          <nav className="flex flex-col gap-[var(--submenu-item-gap)]">
            {items.map((item: SubMenuItem) => (
              <div key={item.label} className="submenu-item-wrapper">
                <a
                  href="#"
                  className={
                    "sidebar-submenu-item submenu-item flex items-center gap-4"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    onSubMenuClick?.(displayedTitle);
                  }}
                >
                  <span className="text-blue-400">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
                {item.children && (
                  <div className="ml-8 flex flex-col gap-1">
                    {item.children.map((child: SubMenuItem) => (
                      <a
                        key={child.label}
                        href="#"
                        className={
                          "sidebar-submenu-item submenu-item submenu-item-sub submenu-subitem flex items-center gap-3 text-gray-500"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          onSubMenuClick?.(displayedTitle);
                        }}
                      >
                        <span className="text-blue-300">{child.icon}</span>
                        <span>{child.label}</span>
                        <span className="submenu-symbol">›</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
}
