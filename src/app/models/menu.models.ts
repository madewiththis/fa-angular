export interface MenuItem {
  label: string;
  icon?: string;
  path?: string;
  isActive?: boolean;
}

export interface SubMenuItem {
  label: string;
  path: string;
  icon?: string;
  isActive?: boolean;
}

export interface MenuData {
  [key: string]: SubMenuItem[];
}
