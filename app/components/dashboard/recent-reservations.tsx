// app/components/dashboard/recent-reservations.tsx
import Link from 'next/link';
import { sampleReservations } from '@/lib/sample-data';
import { formatDate } from '@/lib/utils';

const statusStyles = {
  'Angefragt': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Reserviert': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'Notarvorbereitung': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  'Notartermin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Verkauft': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Abgebrochen': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export default function RecentReservations() {
  const recentReservations = sampleReservations.slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white">Aktuelle Reservierungen</h2>
        <Link 
          href="/reservations" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Alle anzeigen →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Objekt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Käufer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Datum
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentReservations.map(reservation => (
              <tr 
                key={reservation.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                  {reservation.property}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                  {reservation.buyer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[reservation.status]}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(reservation.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}