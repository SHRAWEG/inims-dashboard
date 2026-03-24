import {
  LayoutDashboard,
  Briefcase,
  FileType2,
  MapPin,
  Calendar,
  Users2,
  Users,
  Activity,
  Database,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import navigationData from "./navigation.json";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isSubMenu?: boolean;
  items?: NavItem[];
  permission?: string; // Added permission field
}

export interface NavGroup {
  id: string;
  label: string;
  icon?: string;
  items: NavItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Briefcase,
  FileType2,
  MapPin,
  Calendar,
  Users2,
  Users,
  Activity,
  Database,
  ShieldCheck,
  ShieldAlert,
};

export const getIcon = (iconName: string) => {
  return iconMap[iconName] || LayoutDashboard;
};

interface RawNavItem {
  title: string;
  href: string;
  icon: string;
  isSubMenu?: boolean;
  items?: RawNavItem[];
  permission?: string; // Added permission field
}

interface RawNavGroup {
  id: string;
  label: string;
  icon?: string;
  items: RawNavItem[];
}

const mapNavItem = (item: RawNavItem): NavItem => ({
  ...item,
  icon: getIcon(item.icon),
  items: item.items?.map(mapNavItem),
});

export const navigationConfig = (navigationData as RawNavGroup[]).map((group) => ({
  ...group,
  iconComponent: group.icon ? getIcon(group.icon) : undefined,
  items: group.items.map(mapNavItem),
}));
