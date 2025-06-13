import "./MenuStyle.css";
import Image from "next/image";
import { mainMenu, bottomMenu, MenuItem } from "./menuData";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import UtilityMenu from "../utility-menu/UtilityMenu";

interface MainMenuProps {
  mainMenu?: MenuItem[];
  bottomMenu?: MenuItem[];
  selectedMenu?: string;
  onSelectMenu?: (label: string) => void;
  isCollapsed: boolean;
  onMainMenuHover?: (label: string | undefined) => void;
  onUtilityMenuHover?: () => void;
  hoveredMenu?: string | null;
}

export default function MainMenu({
  mainMenu: mainMenuProp,
  bottomMenu: bottomMenuProp,
  selectedMenu,
  onSelectMenu,
  isCollapsed,
  onMainMenuHover,
  onUtilityMenuHover,
  hoveredMenu,
}: MainMenuProps) {
  const main = mainMenuProp || mainMenu;
  const bottom = bottomMenuProp || bottomMenu;
  const router = useRouter();
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const utilityItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [hoverBgStyle, setHoverBgStyle] = useState<object>({ opacity: 0 });
  const [activeBgStyle, setActiveBgStyle] = useState<object>({ opacity: 0 });
  const [utilityHoverBgStyle, setUtilityHoverBgStyle] = useState<object>({
    opacity: 0,
  });
  const [hoveredUtilityIndex, setHoveredUtilityIndex] = useState<number | null>(
    null
  );
  const [utilityMenuContent, setUtilityMenuContent] = useState<
    "Apps" | "Settings" | "Profile" | null
  >(null);
  const hideMenuTimer = useRef<NodeJS.Timeout | null>(null);

  const handleUtilityMenuEnter = (label: "Apps" | "Settings" | "Profile") => {
    if (hideMenuTimer.current) {
      clearTimeout(hideMenuTimer.current);
      hideMenuTimer.current = null;
    }
    setUtilityMenuContent(label);
  };

  const handleUtilityMenuLeave = () => {
    hideMenuTimer.current = setTimeout(() => {
      setUtilityMenuContent(null);
    }, 300);
  };

  // You can adjust these values to fine-tune the background position
  const expandedVerticalOffset = 3; // Nudge down on expand (positive value)
  const collapsedVerticalOffset = -2; // Nudge up on collapse (negative value)

  const calculateStyle = useCallback(
    (el: HTMLElement | null, collapsed: boolean) => {
      if (!el) return { opacity: 0, transform: "translateY(0px)", height: 0 };
      const expandedHeight = 56;
      const collapsedHeight = 40;
      const height = collapsed ? collapsedHeight : expandedHeight;
      const offsetTop = collapsed
        ? el.offsetTop +
          (el.offsetHeight - height) / 2 +
          collapsedVerticalOffset
        : el.offsetTop +
          (el.offsetHeight - height) / 2 +
          expandedVerticalOffset;
      return {
        transform: `translateY(${offsetTop}px)`,
        height: height,
        opacity: 1,
      };
    },
    [collapsedVerticalOffset, expandedVerticalOffset]
  );

  useEffect(() => {
    const activeIndex = main.findIndex((item) => item.label === selectedMenu);
    if (activeIndex !== -1) {
      const el = itemRefs.current[activeIndex];
      setActiveBgStyle(calculateStyle(el, isCollapsed));
    } else {
      setActiveBgStyle({ opacity: 0 });
    }
  }, [selectedMenu, main, isCollapsed, calculateStyle]);

  useEffect(() => {
    const hoverIndex = main.findIndex((item) => item.label === hoveredMenu);
    if (hoverIndex !== -1) {
      const el = itemRefs.current[hoverIndex];
      setHoverBgStyle(calculateStyle(el, isCollapsed));
    } else {
      setHoverBgStyle((s) => ({ ...s, opacity: 0 }));
    }
  }, [hoveredMenu, main, isCollapsed, calculateStyle]);

  useEffect(() => {
    if (hoveredUtilityIndex !== null) {
      const el = utilityItemRefs.current[hoveredUtilityIndex];
      setUtilityHoverBgStyle(calculateStyle(el, isCollapsed));
    } else {
      setUtilityHoverBgStyle((s) => ({ ...s, opacity: 0 }));
    }
  }, [hoveredUtilityIndex, isCollapsed, calculateStyle]);

  return (
    <aside className={`mainmenu${isCollapsed ? " collapsed" : ""}`}>
      <div className="flex flex-col h-full w-full">
        <div>
          <div className="flex flex-col items-center mb-4">
            <div
              className="p-2 mb-2 mt-4 cursor-pointer"
              onClick={() => router.push("/")}
              onMouseEnter={() => onMainMenuHover?.(undefined)}
            >
              <Image
                src="/fa_logo_dark.png"
                alt="FlowAccount Logo"
                width={32}
                height={32}
                priority
              />
            </div>
          </div>
          <nav
            className="flex flex-col gap-0 relative"
            onMouseLeave={() => onMainMenuHover?.(undefined)}
          >
            <div
              className="menu-background"
              style={{
                ...hoverBgStyle,
                backgroundColor: "rgba(255,255,255,0.18)",
              }}
            />
            <div
              className="menu-background active-background"
              style={{ ...activeBgStyle, backgroundColor: "rgba(0,0,0,0.15)" }}
            />
            {main.map((item, index) => (
              <a
                key={item.label}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMenu?.(item.label);
                  router.push(`/${item.label.toLowerCase()}`);
                }}
                className="menu-item"
                onMouseEnter={() => onMainMenuHover?.(item.label)}
              >
                <span>{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div
          className="flex-grow"
          onMouseEnter={() => onMainMenuHover?.(undefined)}
        />
        <div className="flex flex-col gap-0 mb-7 relative">
          <div
            className="menu-background"
            style={{
              ...utilityHoverBgStyle,
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          />
          {bottom.map((item, index) => (
            <a
              key={item.label}
              ref={(el) => {
                utilityItemRefs.current[index] = el;
              }}
              href="#"
              className="menu-item relative"
              onMouseEnter={() => {
                onUtilityMenuHover?.();
                setHoveredUtilityIndex(index);
                if (
                  item.label === "Apps" ||
                  item.label === "Settings" ||
                  item.label === "Profile"
                ) {
                  handleUtilityMenuEnter(item.label);
                }
              }}
              onMouseLeave={() => {
                setHoveredUtilityIndex(null);
                if (
                  item.label === "Apps" ||
                  item.label === "Settings" ||
                  item.label === "Profile"
                ) {
                  handleUtilityMenuLeave();
                }
              }}
            >
              <span>{item.icon}</span>
              <span className="menu-text">{item.label}</span>
              {item.notification && (
                <span className="absolute right-4 top-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </a>
          ))}
        </div>
      </div>
      {utilityMenuContent && (
        <UtilityMenu
          content={utilityMenuContent}
          onMouseEnter={() => handleUtilityMenuEnter(utilityMenuContent)}
          onMouseLeave={handleUtilityMenuLeave}
        />
      )}
    </aside>
  );
}
