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

export const submenu: SubMenuItem[] = [
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
];
