import React from "react";
import Image from "next/image";
import logoFA from "../../../public/logo_fa_small.png";
import logoPayroll from "../../../public/logo_payroll_small.png";
import logoAutoKey from "../../../public/logo_autokey_small.png";

const apps = [
  {
    name: "FlowAccount",
    subtitle: "Easy Accounting",
    icon: <Image src={logoFA} alt="FlowAccount" width={30} height={30} />,
  },
  {
    name: "Payroll",
    subtitle: "Manage Pay",
    icon: <Image src={logoPayroll} alt="Payroll" width={30} height={30} />,
  },
  {
    name: "AutoKey",
    subtitle: "AI Document Scanner",
    icon: <Image src={logoAutoKey} alt="AutoKey" width={30} height={30} />,
  },
];

const titleStyle = "font-semibold text-sm text-gray-800";
const subtitleStyle = "text-xs text-gray-500";

const Apps = () => {
  return (
    <div className="flex flex-col gap-1" style={{ width: "220px" }}>
      {apps.map((app) => (
        <div
          key={app.name}
          className="flex items-center p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
            {app.icon}
          </div>
          <div>
            <p className={titleStyle}>{app.name}</p>
            <p className={subtitleStyle}>{app.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Apps;
