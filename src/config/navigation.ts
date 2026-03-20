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
} from "lucide-react";
import navigationData from "./navigation.json";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
};

export const getIcon = (iconName: string) => {
  return iconMap[iconName] || LayoutDashboard;
};

interface RawNavItem {
  title: string;
  href: string;
  icon: string;
}

interface RawNavGroup {
  id: string;
  label: string;
  icon?: string;
  items: RawNavItem[];
}

export const navigationConfig = (navigationData as RawNavGroup[]).map((group) => ({
  ...group,
  iconComponent: group.icon ? getIcon(group.icon) : undefined,
  items: group.items.map((item) => ({
    ...item,
    icon: getIcon(item.icon),
  })),
}));
