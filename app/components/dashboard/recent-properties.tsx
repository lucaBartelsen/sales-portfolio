// app/components/dashboard/recent-properties.tsx
import Image from 'next/image';
import Link from 'next/link';
import { sampleProperties } from '@/lib/sample-data';
import { formatCurrency, calculatePricePerSqm } from '@/lib/utils';

export default function RecentProperties() {
  const recentProperties = sampleProperties.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white">Neueste Objekte</h2>
        <Link 
          href="/properties" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Alle anzeigen →
        </Link>
      </div>
      <div className="p-6 space-y-4">
        {recentProperties.map(property => (
          <Link 
            key={property.id} 
            href={`/properties/${property.id}`}
            className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image 
                src={property.images[0]} 
                alt={property.address}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {property.address}, {property.unit_number}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {property.rooms} Zimmer • {property.size_m2} m² • {property.floor}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold dark:text-white">{formatCurrency(property.total_price)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(calculatePricePerSqm(property.total_price, property.size_m2))}/m²
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}