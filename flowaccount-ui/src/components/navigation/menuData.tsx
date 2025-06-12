import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShelvesIcon from "@mui/icons-material/Shelves";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import ServiceToolboxIcon from "@mui/icons-material/Build";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppsIcon from "@mui/icons-material/Apps";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import type { ReactNode } from "react";

export interface MenuItem {
  label: string;
  icon: ReactNode;
  active?: boolean;
  notification?: boolean;
}

export interface SubMenuItem {
  label: string;
  icon: ReactNode;
  children?: SubMenuItem[];
}

export const mainMenu: MenuItem[] = [
  {
    label: "Sell",
    icon: (
      <AttachMoneyIcon
        fontSize="medium"
        sx={{ fontWeight: 400, fill: "white" }}
      />
    ),
    active: true,
  },
  {
    label: "Buy",
    icon: (
      <ShoppingCartIcon
        fontSize="medium"
        sx={{ fontWeight: 400, fill: "white" }}
      />
    ),
  },
  {
    label: "Expenses",
    icon: (
      <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400, fill: "white" }} />
    ),
  },
  {
    label: "Products",
    icon: (
      <ShelvesIcon fontSize="medium" sx={{ fontWeight: 400, fill: "white" }} />
    ),
  },
  {
    label: "Contacts",
    icon: (
      <RecentActorsIcon
        fontSize="medium"
        sx={{ fontWeight: 400, fill: "white" }}
      />
    ),
  },
  {
    label: "Reports",
    icon: (
      <InsertChartIcon
        fontSize="medium"
        sx={{ fontWeight: 400, fill: "white" }}
      />
    ),
  },
  {
    label: "Accounting",
    icon: (
      <ServiceToolboxIcon
        fontSize="medium"
        sx={{ fontWeight: 400, fill: "white" }}
      />
    ),
  },
];

export const bottomMenu: MenuItem[] = [
  {
    label: "Notifications",
    icon: (
      <NotificationsIcon
        fontSize="medium"
        sx={{ fontWeight: 400, fill: "white" }}
      />
    ),
    notification: true,
  },
  {
    label: "Apps",
    icon: (
      <AppsIcon fontSize="medium" sx={{ fontWeight: 400, fill: "white" }} />
    ),
  },
  {
    label: "Settings",
    icon: (
      <SettingsIcon fontSize="medium" sx={{ fontWeight: 400, fill: "white" }} />
    ),
  },
  {
    label: "Profile",
    icon: (
      <AccountCircleIcon
        fontSize="medium"
        sx={{ fontWeight: 400, fill: "white" }}
      />
    ),
  },
];

export const submenus: Record<string, SubMenuItem[]> = {
  Sell: [
    {
      label: "Quotation",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Billing Note",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Tax Invoice",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Receipt",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Cash Sale",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Credit Note",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Debit Note",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
  ],
  Buy: [
    {
      label: "Purchase Order",
      icon: <ShoppingCartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Receiving Inventory",
      icon: <ShelvesIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
  ],
  Contacts: [
    {
      label: "New Contact",
      icon: <RecentActorsIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Clients",
      icon: <RecentActorsIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Suppliers",
      icon: <RecentActorsIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "All",
      icon: <RecentActorsIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
  ],
  Expenses: [
    {
      label: "Expense",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Withholding Tax",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Schedule Payment",
      icon: <ReceiptIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Asset Management",
      icon: <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
      children: [
        {
          label: "Asset List",
          icon: (
            <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />
          ),
        },
        {
          label: "Run Depreciation",
          icon: (
            <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />
          ),
        },
        {
          label: "Asset Category",
          icon: (
            <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />
          ),
        },
      ],
    },
  ],
  Products: [
    {
      label: "Products",
      icon: <ShelvesIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Transfers",
      icon: <ShelvesIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Warehouses",
      icon: <ShelvesIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
  ],
  Reports: [
    {
      label: "Sell",
      icon: <InsertChartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Buy",
      icon: <InsertChartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Expense",
      icon: <InsertChartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Projects",
      icon: <InsertChartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Inventory",
      icon: <InsertChartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Tax",
      icon: <InsertChartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Accounting",
      icon: <InsertChartIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
  ],
  Accounting: [
    {
      label: "Journals",
      icon: <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Chart of Accounts",
      icon: <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Closing Entries",
      icon: <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "Reports",
      icon: <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
    {
      label: "VAT Management",
      icon: <ServiceToolboxIcon fontSize="medium" sx={{ fontWeight: 400 }} />,
    },
  ],
};
