import MainMenu from "./MainMenu";
import SubMenu from "./SubMenu";
import type { ReactNode } from "react";
import {
  mainMenu,
  bottomMenu,
  submenu,
  MenuItem,
  SubMenuItem,
} from "./menuData";

interface MenuLayoutProps {
  mainMenu?: MenuItem[];
  bottomMenu?: MenuItem[];
  submenu?: SubMenuItem[];
  submenuTitle: string;
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
  const sub = submenuProp || submenu;
  return (
    <div className="flex min-h-screen">
      <MainMenu mainMenu={main} bottomMenu={bottom} />
      <SubMenu submenu={sub} title={submenuTitle} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
