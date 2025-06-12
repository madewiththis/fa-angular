import type { ReactNode } from "react";
import { submenu, SubMenuItem } from "./menuData";

interface SubMenuProps {
  submenu?: SubMenuItem[];
  title: string;
}

export default function SubMenu({ submenu: submenuProp, title }: SubMenuProps) {
  const items = submenuProp || submenu;
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-8">
      <div className="font-bold text-2xl text-gray-700 mb-8 flex items-center gap-2">
        {title}
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center gap-4 px-2 py-3 rounded-lg transition-all text-gray-600 hover:bg-gray-100 hover:text-blue-600 text-lg"
          >
            <span className="text-blue-400">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
