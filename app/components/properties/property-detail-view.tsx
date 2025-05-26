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

interface PropertyDetailViewProps {
  property: Property;
}

export default function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'documents' | 'calculator'>('overview');
  const [selectedImage, setSelectedImage] = useState(0);

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
    { label: 'Wohnfläche', value: `${property.size_m2} m²`, icon: Building2 },
    { label: 'Zimmer', value: property.rooms.toString(), icon: Building2 },
    { label: 'Etage', value: property.floor, icon: Building2 },
    { label: 'Baujahr', value: property.year_built.toString(), icon: Calendar },
    { label: 'Energieeffizienz', value: property.energy_class, icon: Zap },
    { label: 'Heizung', value: property.heating_type || 'N/A', icon: Zap }
  ];

  const financialMetrics = [
    { 
      label: 'Kaufpreis', 
      value: formatCurrency(property.total_price),
      trend: '+3.2%',
      positive: true
    },
    { 
      label: 'Preis pro m²', 
      value: formatCurrency(Math.round(property.total_price / property.size_m2)),
      trend: '+2.8%',
      positive: true
    },
    { 
      label: 'Kaltmiete/Monat', 
      value: formatCurrency(property.monthly_rent_cold),
      trend: '+4.1%',
      positive: true
    },
    { 
      label: 'Mietrendite p.a.', 
      value: `${calculateRentalYield(property.monthly_rent_cold, property.total_price).toFixed(2)}%`,
      trend: '+0.3%',
      positive: true
    }
  ];

  return (
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
              {property.address}, {property.unit_number}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{property.project}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            property.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
            property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {property.status === 'available' ? 'Verfügbar' : 
             property.status === 'reserved' ? 'Reserviert' : 'Verkauft'}
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
                src={property.images[selectedImage] || property.images[0]} 
                alt={property.address}
                fill
                className="object-cover"
              />
              <button className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors">
                <Camera className="w-5 h-5" />
                <span>Alle Bilder ({property.images.length})</span>
              </button>
            </div>
            <div className="p-4 flex space-x-2 overflow-x-auto">
              {property.images.map((image, idx) => (
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
                    <h3 className="text-lg font-semibold dark:text-white mb-4">Objektmerkmale</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {propertyFeatures.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.label}</p>
                              <p className="font-medium dark:text-white">{feature.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold dark:text-white mb-4">Lage</h3>
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                      <div>
                        <p className="font-medium dark:text-white">{property.address}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Zentrale Lage mit hervorragender Anbindung an öffentliche Verkehrsmittel.
                          Einkaufsmöglichkeiten, Restaurants und Parks in unmittelbarer Nähe.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white mb-4">Finanzielle Kennzahlen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {financialMetrics.map((metric, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                            <span className={`text-sm font-medium ${
                              metric.positive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {metric.trend}
                            </span>
                          </div>
                          <p className="text-xl font-bold dark:text-white">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold dark:text-white mb-4">Cashflow-Prognose</h3>
                    <CashflowChart property={property} />
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
                  <InvestmentCalculator property={property} />
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
              <p className="text-3xl font-bold dark:text-white">{formatCurrency(property.total_price)}</p>
              <p className="text-gray-500 dark:text-gray-400">
                {formatCurrency(Math.round(property.total_price / property.size_m2))}/m²
              </p>
            </div>

            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Kaltmiete/Monat</span>
                <span className="font-medium dark:text-white">{formatCurrency(property.monthly_rent_cold)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mietrendite p.a.</span>
                <span className="font-medium text-green-600">
                  {calculateRentalYield(property.monthly_rent_cold, property.total_price).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hausgeld</span>
                <span className="font-medium dark:text-white">{formatCurrency(property.house_fee || 0)}</span>
              </div>
            </div>

              <div className="mt-6 space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Objekt reservieren
                </button>
                <Link 
                  href={`/properties/${property.id}`}
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

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold dark:text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Schnellübersicht
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Provisionssatz</span>
                <span className="font-medium dark:text-white">{property.commission_percent}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Wertsteigerung p.a.</span>
                <span className="font-medium text-green-600">{property.value_growth_percent}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Mietsteigerung p.a.</span>
                <span className="font-medium text-green-600">{property.rent_increase_percent}%</span>
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
  );
}