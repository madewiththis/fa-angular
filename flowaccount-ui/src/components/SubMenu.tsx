import { SubMenuItem } from "./menuData";

interface SubMenuProps {
  submenu?: SubMenuItem[];
  title: string;
}

export default function SubMenu({ submenu: submenuProp, title }: SubMenuProps) {
  const items = submenuProp || [];
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-8">
      <div className="font-bold text-2xl text-gray-700 mb-8 flex items-center gap-2">
        {title}
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((item: SubMenuItem) => (
          <div key={item.label} className="submenu-item-wrapper">
            <a
              href="#"
              className={
                "sidebar-submenu-item submenu-item flex items-center gap-4"
              }
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
                  >
                    <span className="text-blue-300">{child.icon}</span>
                    <span>{child.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
