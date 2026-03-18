'use client';

import { cn } from '@/lib/utils/cn';
import { LayoutDashboard, Users, Briefcase, FileType2, MapPin, Calendar, Users2, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

const mastersNav: NavItem[] = [
  { title: 'Sectors', href: '/sectors', icon: Briefcase },
  { title: 'Types', href: '/types', icon: FileType2 },
  { title: 'Administrative Levels', href: '/administrative-levels', icon: MapPin },
  { title: 'Frequencies', href: '/frequencies', icon: Calendar },
  { title: 'Genders', href: '/genders', icon: Users2 },
  { title: 'Age Groups', href: '/age-groups', icon: Users },
  { title: 'MSNP Indicators', href: '/msnp-indicators', icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation('common');

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
          isActive
            ? 'bg-sidebar-highlight text-sidebar-text-active'
            : 'text-sidebar-text hover:bg-sidebar-hover cursor-pointer'
        )}
      >
        <item.icon className="w-4 h-4" />
        <span className="text-sm font-medium">{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 fixed inset-y-0 left-0 bg-sidebar-bg flex flex-col z-20">
      <div className="flex flex-col px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">INIMS</h1>
        <p className="text-xs text-sidebar-text">Dashboard</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-sidebar-text uppercase tracking-wider mb-2">Main</p>
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-sidebar-text uppercase tracking-wider mb-2">Masters</p>
          <nav className="space-y-1">
            {mastersNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
