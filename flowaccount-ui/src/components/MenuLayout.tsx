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
import { useState } from "react";

interface MenuLayoutProps {
  mainMenu?: MenuItem[];
  bottomMenu?: MenuItem[];
  submenu?: SubMenuItem[];
  submenuTitle?: string;
  children: ReactNode;
}

export default function MenuLayout({
  mainMenu: mainMenuProp,
  bottomMenu: bottomMenuProp,
  submenu: submenuProp,
  submenuTitle,
  children,
}: MenuLayoutProps) {
  const main = mainMenuProp || mainMenu;
  const bottom = bottomMenuProp || bottomMenu;
  const [selectedMenu, setSelectedMenu] = useState<string>(
    main[0]?.label || ""
  );
  const sub = submenuProp || submenus[selectedMenu] || [];
  return (
    <div className="flex min-h-screen">
      <MainMenu
        mainMenu={main}
        bottomMenu={bottom}
        selectedMenu={selectedMenu}
        onSelectMenu={setSelectedMenu}
      />
      <SubMenu submenu={sub} title={selectedMenu} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
