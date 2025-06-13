import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArticleIcon from "@mui/icons-material/Article";

const apps = [
  {
    name: "FlowAccount",
    subtitle: "Easy Accounting",
    icon: <TrendingUpIcon sx={{ color: "white" }} />,
    color: "bg-blue-500",
  },
  {
    name: "Payroll",
    subtitle: "Manage Pay",
    icon: <AttachMoneyIcon sx={{ color: "white" }} />,
    color: "bg-green-500",
  },
  {
    name: "AutoKey",
    subtitle: "AI Document Scanner",
    icon: <ArticleIcon sx={{ color: "white" }} />,
    color: "bg-red-400",
  },
];

const Apps = () => {
  return (
    <div className="p-4" style={{ width: "320px" }}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Choose Application
      </h2>
      <hr className="mb-4" />
      <div className="flex flex-col gap-4">
        {apps.map((app) => (
          <div
            key={app.name}
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${app.color}`}
            >
              {app.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{app.name}</p>
              <p className="text-sm text-gray-500">{app.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
