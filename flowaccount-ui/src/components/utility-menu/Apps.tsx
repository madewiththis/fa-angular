import React from "react";
import Image from "next/image";

const apps = [
  { name: "FlowAccount", icon: "/fa_logo_dark.png" },
  { name: "Payroll", icon: "/payroll_logo.png" }, // Placeholder icon
  { name: "AutoKey", icon: "/autokey_logo.png" }, // Placeholder icon
];

const Apps = () => {
  return (
    <div className="p-4 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Apps</h2>
      <div className="grid grid-cols-3 gap-4">
        {apps.map((app) => (
          <div
            key={app.name}
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <div className="w-12 h-12 relative mb-2">
              <Image
                src={app.icon}
                alt={`${app.name} logo`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <span className="text-sm text-center">{app.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
