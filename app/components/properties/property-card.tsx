// app/components/properties/property-card.tsx
import Image from 'next/image';
import { Bed, Square, Calendar, ChevronRight, TrendingUp, Euro } from 'lucide-react';
import { Property } from '@/types/index';
import { formatCurrency, calculateRentalYield } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const pricePerSqm = Math.round(property.total_price / property.size_m2);
  const rentPerSqm = Math.round(property.monthly_rent_cold / property.size_m2);
  const rentalYield = calculateRentalYield(property.monthly_rent_cold, property.total_price);

  return (
    <div 
      className="property-card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image 
          src={property.images[0]} 
          alt={property.address}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          <span className="px-2 py-1 bg-white/95 backdrop-blur text-xs font-semibold rounded shadow-sm">
            {property.energy_class}
          </span>
          {property.status === 'reserved' && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded shadow-sm">
              Reserviert
            </span>
          )}
          {property.status === 'sold' && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded shadow-sm">
              Verkauft
            </span>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded shadow-sm">
            {property.asset_class || 'Standard'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
            {property.year_built}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        {/* Adresse und Grunddaten */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg dark:text-white leading-tight mb-1">
            {property.address}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {property.unit_number} • {property.floor} • {property.project}
          </p>
        </div>
        
        {/* Hauptkennzahlen in Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <Bed className="w-4 h-4 mx-auto mb-1 text-gray-400" />
            <p className="text-sm font-semibold dark:text-gray-300">{property.rooms}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Zimmer</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <Square className="w-4 h-4 mx-auto mb-1 text-gray-400" />
            <p className="text-sm font-semibold dark:text-gray-300">{property.size_m2} m²</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Wohnfläche</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {rentalYield.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rendite</p>
          </div>
        </div>

        {/* Finanzielle Kennzahlen */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Kaufpreis:</span>
            <span className="font-semibold dark:text-white">{formatCurrency(property.total_price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">€/m²:</span>
            <span className="font-medium dark:text-white">{formatCurrency(pricePerSqm)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Kaltmiete/m²:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formatCurrency(rentPerSqm)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-600">
            <span className="text-sm text-gray-600 dark:text-gray-400">Monatl. Miete:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(property.monthly_rent_cold)}
            </span>
          </div>
        </div>
        
        {/* Action Button */}
        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
          <span className="text-sm font-medium">Details ansehen</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}