// app/components/dashboard/recent-properties.tsx
import Image from 'next/image';
import Link from 'next/link';
import { sampleProperties } from '@/lib/sample-data';
import { formatCurrency, calculatePricePerSqm, calculateRentalYield } from '@/lib/utils';
import { TrendingUp, Square, Euro, Building2 } from 'lucide-react';

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
      <div className="p-4 space-y-3">
        {recentProperties.map(property => {
          const pricePerSqm = calculatePricePerSqm(property.total_price, property.size_m2);
          const rentPerSqm = Math.round(property.monthly_rent_cold / property.size_m2);
          const rentalYield = calculateRentalYield(property.monthly_rent_cold, property.total_price);
          
          return (
            <Link 
              key={property.id} 
              href={`/properties/${property.id}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <div className="flex space-x-4 p-3">
                {/* Bild */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image 
                    src={property.images[0]} 
                    alt={property.address}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                      {property.asset_class || 'Standard'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Header - mit Status rechts */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {property.address}, {property.unit_number}
                        </h3>
                        <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                          property.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {property.status === 'available' ? 'Verfügbar' : 
                           property.status === 'reserved' ? 'Reserviert' : 'Verkauft'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{property.rooms}Zi</span>
                        <span>•</span>
                        <span>{property.size_m2}m²</span>
                        <span>•</span>
                        <span>{property.year_built}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm dark:text-white">{formatCurrency(property.total_price)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(pricePerSqm)}/m²
                      </p>
                    </div>
                  </div>
                  
                  {/* Kennzahlen - kompakter in einer Zeile */}
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Euro className="w-3 h-3 text-green-500" />
                      <span className="text-gray-500 dark:text-gray-400">Miete/m²:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(rentPerSqm)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-500 dark:text-gray-400">Rendite:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {rentalYield.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-purple-500" />
                      <span className="text-gray-500 dark:text-gray-400">Monat:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {formatCurrency(property.monthly_rent_cold)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}