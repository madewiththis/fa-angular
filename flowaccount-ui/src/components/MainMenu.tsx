import Image from "next/image";
import { mainMenu, bottomMenu, MenuItem } from "./menuData";

interface MainMenuProps {
  mainMenu?: MenuItem[];
  bottomMenu?: MenuItem[];
  selectedMenu?: string;
  onSelectMenu?: (label: string) => void;
}

export default function MainMenu({
  mainMenu: mainMenuProp,
  bottomMenu: bottomMenuProp,
  selectedMenu,
  onSelectMenu,
}: MainMenuProps) {
  const main = mainMenuProp || mainMenu;
  const bottom = bottomMenuProp || bottomMenu;
  return (
    <aside className="w-56 flex flex-col justify-between py-8 px-0 sidebar-gradient text-white shadow-lg">
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="logo-glow logo-pulse rounded-full p-4 mb-6 bg-white bg-opacity-10">
            <Image
              src="/fa_logo.png"
              alt="FlowAccount Logo"
              width={56}
              height={56}
              priority
            />
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {main.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectMenu?.(item.label);
              }}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-medium text-base ${
                selectedMenu === item.label
                  ? "bg-white bg-opacity-20 text-white"
                  : "hover:bg-white hover:bg-opacity-10 text-white/90"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {bottom.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-medium text-base hover:bg-white hover:bg-opacity-10 relative"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.notification && (
              <span className="absolute right-4 top-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </a>
        ))}
      </div>
    </aside>
  );
}
