// app/components/properties/property-card.tsx
import Image from 'next/image';
import { Bed, Square, Calendar, ChevronRight } from 'lucide-react';
import { Property } from '@/types/index';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div 
      className="property-card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-md transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image 
          src={property.images[0]} 
          alt={property.address}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-medium rounded">
            {property.energy_class}
          </span>
          {property.status === 'reserved' && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
              Reserviert
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg dark:text-white">{property.address}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {property.unit_number} • {property.floor} • {property.project}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <Bed className="w-5 h-5 mx-auto mb-1 text-gray-400" />
            <p className="text-sm dark:text-gray-300">{property.rooms}</p>
          </div>
          <div className="text-center">
            <Square className="w-5 h-5 mx-auto mb-1 text-gray-400" />
            <p className="text-sm dark:text-gray-300">{property.size_m2} m²</p>
          </div>
          <div className="text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-gray-400" />
            <p className="text-sm dark:text-gray-300">{property.year_built}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-2xl font-bold dark:text-white">€{property.total_price.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              €{Math.round(property.total_price / property.size_m2).toLocaleString()}/m²
            </p>
          </div>
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
            <span className="text-sm font-medium">Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}