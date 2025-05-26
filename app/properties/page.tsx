// app/properties/page.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import PropertyCard from '@/components/properties/property-card';
import PropertyDetail from '@/components/properties/property-detail';
import { sampleProperties } from '@/lib/sample-data';
import { Property } from '@/types/index';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleReservationCreated = (reservationData: any) => {
    // Update property status to 'reserved' when a reservation is created
    setProperties(prev => 
      prev.map(property => 
        property.id === reservationData.property_id 
          ? { ...property, status: 'reserved' }
          : property
      )
    );

    // You could also add the reservation to a reservations state or send to API
    console.log('Property status updated to reserved for property ID:', reservationData.property_id);
    
    // Show success message (you could use a toast library)
    alert(`Reservierung für ${reservationData.property_address} wurde erfolgreich erstellt!`);
  };

  const filteredProperties = properties.filter(property => 
    searchTerm === '' || 
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="animate-fade-in space-y-6">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Suche nach Adresse, Projekt oder ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span className="dark:text-white">Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Neues Objekt</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>Alle Projekte</option>
                <option>Berlin Mitte Residenz</option>
                <option>Prenzlauer Berg Tower</option>
                <option>Friedrich Luxury Living</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>Alle Status</option>
                <option>Verfügbar</option>
                <option>Reserviert</option>
                <option>Verkauft</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>Preis</option>
                <option>Unter €500k</option>
                <option>€500k - €1M</option>
                <option>Über €1M</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>Zimmer</option>
                <option>1-2 Zimmer</option>
                <option>3-4 Zimmer</option>
                <option>5+ Zimmer</option>
              </select>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property}
              onClick={() => setSelectedProperty(property)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Keine Objekte gefunden
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Versuchen Sie, Ihre Suchkriterien zu ändern oder neue Filter zu verwenden.
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">Objektstatistiken</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {properties.filter(p => p.status === 'available').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Verfügbar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {properties.filter(p => p.status === 'reserved').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Reserviert</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {properties.filter(p => p.status === 'sold').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Verkauft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {properties.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Gesamt</div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onReservationCreated={handleReservationCreated}
        />
      )}
    </>
  );
}