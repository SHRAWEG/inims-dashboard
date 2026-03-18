'use client';

import { PageHeader } from '@/components/common/page-header';
import { useAuth } from '@/hooks/use-auth';
import { useLocale } from '@/hooks/use-locale';
import { Users, Briefcase, Activity } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { locale } = useLocale();
  
  const welcomeText = locale === 'en' ? `Welcome, ${user?.firstName}` : `स्वागत छ, ${user?.firstName}`;

  return (
    <div className="space-y-6">
      <PageHeader title={welcomeText} description="Here is your daily dashboard overview." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-text-primary">Total Users</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-xs text-text-secondary mt-1">across all roles</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-text-primary">Total Sectors</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-xs text-text-secondary mt-1">active sectors</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-text-primary">Total Indicators</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-xs text-text-secondary mt-1">MSNP tracking indicators</p>
        </div>
      </div>
    </div>
  );
}
