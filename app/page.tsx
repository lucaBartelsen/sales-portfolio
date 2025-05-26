// app/page.tsx
'use client';

import { Building2, Clock, TrendingUp, Euro } from 'lucide-react';
import StatsCard from '@/components/dashboard/stats-card';
import RecentProperties from '@/components/dashboard/recent-properties';
import RecentReservations from '@/components/dashboard/recent-reservations';

const stats = [
  { label: 'Verfügbare Objekte', value: '24', icon: Building2, trend: '+12%' },
  { label: 'Reservierungen', value: '8', icon: Clock, trend: '+23%' },
  { label: 'Abschlüsse (Monat)', value: '5', icon: TrendingUp, trend: '+18%' },
  { label: 'Gesamtumsatz', value: '€3.2M', icon: Euro, trend: '+31%' }
];

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Properties */}
      <RecentProperties />

      {/* Recent Reservations */}
      <RecentReservations />
    </div>
  );
}