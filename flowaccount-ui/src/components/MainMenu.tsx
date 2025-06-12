import InsertChartIcon from "@mui/icons-material/InsertChart";
import { mainMenu, bottomMenu, MenuItem } from "./menuData";

interface MainMenuProps {
  mainMenu?: MenuItem[];
  bottomMenu?: MenuItem[];
}

export default function MainMenu({
  mainMenu: mainMenuProp,
  bottomMenu: bottomMenuProp,
}: MainMenuProps) {
  const main = mainMenuProp || mainMenu;
  const bottom = bottomMenuProp || bottomMenu;
  return (
    <aside className="w-56 flex flex-col justify-between py-8 px-0 bg-gradient-to-b from-blue-500 to-blue-400 text-white shadow-lg">
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white bg-opacity-20 rounded-full p-4 mb-6">
            <InsertChartIcon fontSize="large" sx={{ fill: "white" }} />
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {main.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-medium text-base ${
                item.active
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-10"
              } ${item.active ? "text-white" : "text-white/90"}`}
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
