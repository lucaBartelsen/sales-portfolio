// app/components/properties/property-detail-view.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Camera, 
  Download, 
  Eye, 
  FileText, 
  TrendingUp, 
  Calculator,
  Building2,
  MapPin,
  Calendar,
  Zap,
  DollarSign,
  PieChart
} from 'lucide-react';
import { Property } from '@/types/index';
import { formatCurrency, formatDate, calculateRentalYield } from '@/lib/utils';
import CashflowChart from './cashflow-chart';
import InvestmentCalculator from './investment-calculator';
import CreateReservationModal from '../reservations/create-reservation-modal';

interface PropertyDetailViewProps {
  property: Property;
  onReservationCreated?: (reservationData: any) => void;
}

export default function PropertyDetailView({ property, onReservationCreated }: PropertyDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'documents' | 'calculator'>('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property>(property);

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: Building2 },
    { id: 'financials', label: 'Finanzen & Charts', icon: TrendingUp },
    { id: 'documents', label: 'Dokumente', icon: FileText },
    { id: 'calculator', label: 'Rechner', icon: Calculator }
  ];

  const documents = [
    'Grundriss.pdf',
    'Energieausweis.pdf', 
    'Teilungserklärung.pdf',
    'Baubeschreibung.pdf',
    'Wirtschaftlichkeitsberechnung.pdf',
    'Mietvertrag_Muster.pdf'
  ];

  const propertyFeatures = [
    { label: 'Wohnfläche', value: `${currentProperty.size_m2} m²`, icon: Building2 },
    { label: 'Zimmer', value: currentProperty.rooms.toString(), icon: Building2 },
    { label: 'Etage', value: currentProperty.floor, icon: Building2 },
    { label: 'Baujahr', value: currentProperty.year_built.toString(), icon: Calendar },
    { label: 'Energieeffizienz', value: currentProperty.energy_class, icon: Zap },
    { label: 'Heizung', value: currentProperty.heating_type || 'N/A', icon: Zap }
  ];

  const financialMetrics = [
    { 
      label: 'Kaufpreis', 
      value: formatCurrency(currentProperty.total_price),
      trend: '+3.2%',
      positive: true
    },
    { 
      label: 'Preis pro m²', 
      value: formatCurrency(Math.round(currentProperty.total_price / currentProperty.size_m2)),
      trend: '+2.8%',
      positive: true
    },
    { 
      label: 'Kaltmiete/Monat', 
      value: formatCurrency(currentProperty.monthly_rent_cold),
      trend: '+4.1%',
      positive: true
    },
    { 
      label: 'Mietrendite p.a.', 
      value: `${calculateRentalYield(currentProperty.monthly_rent_cold, currentProperty.total_price).toFixed(2)}%`,
      trend: '+0.3%',
      positive: true
    }
  ];

  const handleReservationSubmit = (reservationData: any) => {
    // Update the local property status
    setCurrentProperty(prev => ({ ...prev, status: 'reserved' }));
    
    // Call the parent callback
    if (onReservationCreated) {
      onReservationCreated(reservationData);
    }
    
    setShowReservationModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/properties"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                {currentProperty.address}, {currentProperty.unit_number}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">{currentProperty.project}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentProperty.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              currentProperty.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {currentProperty.status === 'available' ? 'Verfügbar' : 
               currentProperty.status === 'reserved' ? 'Reserviert' : 'Verkauft'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image and Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-96">
                <Image 
                  src={currentProperty.images[selectedImage] || currentProperty.images[0]} 
                  alt={currentProperty.address}
                  fill
                  className="object-cover"
                />
                <button className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors">
                  <Camera className="w-5 h-5" />
                  <span>Alle Bilder ({currentProperty.images.length})</span>
                </button>
              </div>
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {currentProperty.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image src={image} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white mb-4">Cashflow-Prognose</h3>
                      <CashflowChart property={currentProperty} />
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white mb-4">Verfügbare Dokumente</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {documents.map(doc => (
                        <div key={doc} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="font-medium dark:text-gray-300">{doc}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'calculator' && (
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white mb-4">Investment-Rechner</h3>
                    <InvestmentCalculator property={currentProperty} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions and Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold dark:text-white">{formatCurrency(currentProperty.total_price)}</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {formatCurrency(Math.round(currentProperty.total_price / currentProperty.size_m2))}/m²
                </p>
              </div>

              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kaltmiete/Monat</span>
                  <span className="font-medium dark:text-white">{formatCurrency(currentProperty.monthly_rent_cold)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mietrendite p.a.</span>
                  <span className="font-medium text-green-600">
                    {calculateRentalYield(currentProperty.monthly_rent_cold, currentProperty.total_price).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hausgeld</span>
                  <span className="font-medium dark:text-white">{formatCurrency(currentProperty.house_fee || 0)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => setShowReservationModal(true)}
                  disabled={currentProperty.status !== 'available'}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {currentProperty.status === 'available' ? (
                    <>
                      <Building2 className="w-5 h-5 mr-2" />
                      Objekt reservieren
                    </>
                  ) : currentProperty.status === 'reserved' ? (
                    'Bereits reserviert'
                  ) : (
                    'Verkauft'
                  )}
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium dark:text-white flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Exposé herunterladen
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold dark:text-white mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Schnellübersicht
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Provisionssatz</span>
                  <span className="font-medium dark:text-white">{currentProperty.commission_percent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Wertsteigerung p.a.</span>
                  <span className="font-medium text-green-600">{currentProperty.value_growth_percent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Mietsteigerung p.a.</span>
                  <span className="font-medium text-green-600">{currentProperty.rent_increase_percent}%</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold dark:text-white mb-4">Kontakt & Beratung</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://ui-avatars.com/api/?name=Max+Mustermann&background=3b82f6&color=fff" 
                    className="w-10 h-10 rounded-full"
                    alt="Berater"
                  />
                  <div>
                    <p className="font-medium dark:text-white">Max Mustermann</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Immobilienberater</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Jetzt kontaktieren
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <CreateReservationModal
          property={currentProperty}
          onClose={() => setShowReservationModal(false)}
          onSubmit={handleReservationSubmit}
        />
      )}
    </>
  );
}