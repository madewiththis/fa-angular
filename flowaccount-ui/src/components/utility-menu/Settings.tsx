import React from "react";

const settingsGroups = [
  {
    title: "Document",
    items: ["Templates", "Numbering", "Customization"],
  },
  {
    title: "Accounting",
    items: ["Methods", "Periods", "Opening Balance"],
  },
  {
    title: "User Settings",
    items: ["Profile", "Preferences", "Manage Users"],
  },
  {
    title: "Products Setting",
    items: ["Warehouses", "Categories", "Units"],
  },
  {
    title: "MyPlatform",
    items: ["Manage Integrations"],
  },
  {
    title: "My Company",
    items: ["Billing", "Plan", "Users", "Banking"],
  },
];

const Settings = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-semibold text-gray-800 mb-2">{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-gray-600 hover:text-black cursor-pointer mb-1"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
