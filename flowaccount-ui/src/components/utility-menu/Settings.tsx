import React from "react";
import {
  FileText,
  BarChart2,
  Users,
  Box,
  LayoutGrid,
  Building,
  ExternalLink,
} from "lucide-react";

const settingsItems = [
  {
    icon: <LayoutGrid size={20} className="text-gray-500" />,
    title: "MyPlatform",
    subtitle: "Manage Integrations",
    external: true,
    separator: false,
  },
  {
    icon: <Building size={20} className="text-gray-500" />,
    title: "My Company",
    subtitle: "Billing, Plan, Users, Banking",
    external: true,
    separator: false,
  },
  {
    icon: <FileText size={20} className="text-gray-500" />,
    title: "Document",
    subtitle: "Templates, Numbering, Customization",
    external: false,
    separator: true,
  },
  {
    icon: <BarChart2 size={20} className="text-gray-500" />,
    title: "Accounting",
    subtitle: "Methods, Periods, Opening Balance",
    external: false,
    separator: false,
  },
  {
    icon: <Users size={20} className="text-gray-500" />,
    title: "User Settings",
    subtitle: "Profile, Preferences, Manage Users",
    external: true,
    separator: false,
  },
  {
    icon: <Box size={20} className="text-gray-500" />,
    title: "Products Setting",
    subtitle: "Warehouses, Categories, Units",
    external: false,
    separator: false,
  },
];

const titleStyle = "font-semibold text-sm text-gray-800";
const subtitleStyle = "text-xs text-gray-500";

const Settings = () => {
  return (
    <div className="flex flex-col gap-1" style={{ width: "320px" }}>
      {settingsItems.map((item, idx) => (
        <React.Fragment key={item.title}>
          {idx > 0 && settingsItems[idx].separator && (
            <div className="border-t border-gray-200 my-1" />
          )}
          <div className="flex items-center p-2 rounded-xl cursor-pointer hover:bg-gray-100">
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              {item.icon}
            </div>
            <div className="flex-grow">
              <div className="flex items-center">
                <p className={titleStyle}>{item.title}</p>
                {item.external && (
                  <ExternalLink size={14} className="ml-2 text-gray-400" />
                )}
              </div>
              <p className={subtitleStyle}>{item.subtitle}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Settings;
