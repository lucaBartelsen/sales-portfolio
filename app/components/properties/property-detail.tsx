// app/components/properties/property-detail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Camera, Download, Eye, FileText, TrendingUp } from 'lucide-react';
import { Property } from '@/types/index';
import CreateReservationModal from '../reservations/create-reservation-modal';

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
  onReservationCreated?: (reservationData: any) => void;
}

export default function PropertyDetail({ property, onClose, onReservationCreated }: PropertyDetailProps) {
  const [showReservationModal, setShowReservationModal] = useState(false);
  
  const documents = [
    'Grundriss.pdf',
    'Energieausweis.pdf', 
    'Teilungserklärung.pdf',
    'Baubeschreibung.pdf'
  ];

  const handleReservationSubmit = (reservationData: any) => {
    // Here you would typically send the data to your API
    console.log('Reservation created:', reservationData);
    
    // Call the callback to update the property status
    if (onReservationCreated) {
      onReservationCreated(reservationData);
    }
    
    setShowReservationModal(false);
    onClose(); // Close the property detail modal as well
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold dark:text-white">Objektdetails</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Image Gallery */}
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image 
                src={property.images[0]} 
                alt={property.address}
                fill
                className="object-cover"
              />
              <button className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors">
                <Camera className="w-5 h-5" />
                <span>Alle Bilder (12)</span>
              </button>
            </div>

            {/* Property Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold dark:text-white mb-2">
                  {property.address}, {property.unit_number}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{property.project}</p>
                
                <div className="space-y-3">
                  {[
                    { label: 'Etage', value: property.floor },
                    { label: 'Wohnfläche', value: `${property.size_m2} m²` },
                    { label: 'Zimmer', value: property.rooms },
                    { label: 'Baujahr', value: property.year_built },
                    { label: 'Energieeffizienz', value: property.energy_class }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="font-medium dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold dark:text-white mb-4">Finanzielle Details</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kaufpreis</span>
                    <span className="text-xl font-bold dark:text-white">€{property.total_price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Preis pro m²</span>
                    <span className="font-medium dark:text-white">€{Math.round(property.total_price / property.size_m2).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kaltmiete (geschätzt)</span>
                    <span className="font-medium dark:text-white">€{property.monthly_rent_cold.toLocaleString()}/Monat</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mietrendite</span>
                    <span className="font-medium text-green-600">
                      {((property.monthly_rent_cold * 12 / property.total_price) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={() => setShowReservationModal(true)}
                    disabled={property.status !== 'available'}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {property.status === 'available' ? 'Objekt reservieren' : 
                     property.status === 'reserved' ? 'Bereits reserviert' : 'Verkauft'}
                  </button>
                  <Link 
                    href={`/properties/${property.id}`}
                    onClick={onClose}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Erweiterte Detailansicht
                  </Link>
                  <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium dark:text-white flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" />
                    Exposé herunterladen
                  </button>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="font-semibold dark:text-white mb-4">Dokumente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map(doc => (
                  <div key={doc} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm dark:text-gray-300">{doc}</span>
                    </div>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <CreateReservationModal
          property={property}
          onClose={() => setShowReservationModal(false)}
          onSubmit={handleReservationSubmit}
        />
      )}
    </>
  );
}