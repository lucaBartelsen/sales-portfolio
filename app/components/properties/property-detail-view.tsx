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
  PieChart,
  Receipt,
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { Property } from '@/types/index';
import { formatCurrency, formatDate, calculateRentalYield } from '@/lib/utils';
import CashflowChart from './cashflow-chart';
import InvestmentCalculator from './investment-calculator';
import TaxAssumptionsTab from './tax-assumptions-tab';
import CreateReservationModal from '../reservations/create-reservation-modal';

interface PropertyDetailViewProps {
  property: Property;
  onReservationCreated?: (reservationData: any) => void;
}

export default function PropertyDetailView({ property, onReservationCreated }: PropertyDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'documents' | 'calculator' | 'taxes'>('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property>(property);

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: Building2 },
    { id: 'financials', label: 'Finanzen & Charts', icon: TrendingUp },
    { id: 'documents', label: 'Dokumente', icon: FileText },
    { id: 'calculator', label: 'Rechner', icon: Calculator },
    { id: 'taxes', label: 'Annahmen & Steuern', icon: Receipt }
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
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
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
                      <h3 className="text-lg font-semibold dark:text-white mb-4">Objektbeschreibung</h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Diese exklusive {currentProperty.rooms}-Zimmer-Wohnung in {currentProperty.project} bietet auf 
                          {currentProperty.size_m2} m² höchsten Wohnkomfort. Die moderne Ausstattung mit {currentProperty.heating_type} 
                          und Energieeffizienzklasse {currentProperty.energy_class} gewährleistet niedrige Nebenkosten. 
                          {currentProperty.outdoor_space && ` Zusätzlich verfügt die Wohnung über ${currentProperty.outdoor_space}.`}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                          Die zentrale Lage bietet optimale Anbindung an öffentliche Verkehrsmittel und Infrastruktur. 
                          Mit einer prognostizierten Wertsteigerung von {currentProperty.value_growth_percent}% p.a. und 
                          Mietsteigerungspotential von {currentProperty.rent_increase_percent}% p.a. stellt diese Immobilie 
                          eine attraktive Kapitalanlage dar.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white mb-4">Ausstattung & Besonderheiten</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium dark:text-white">Wohnung</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• {currentProperty.heating_type}</li>
                            <li>• Energieeffizienzklasse {currentProperty.energy_class}</li>
                            <li>• {currentProperty.floor}</li>
                            {currentProperty.outdoor_space && <li>• {currentProperty.outdoor_space}</li>}
                            <li>• Baujahr {currentProperty.year_built}</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium dark:text-white">Lage & Infrastruktur</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Zentrale Lage in Berlin</li>
                            <li>• Optimale ÖPNV-Anbindung</li>
                            <li>• Einkaufsmöglichkeiten in der Nähe</li>
                            <li>• Gute Verkehrsanbindung</li>
                            <li>• Entwicklungsgebiet</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold dark:text-white mb-4">Cashflow-Prognose</h3>
                      <CashflowChart property={currentProperty} />
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
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
                              <span className={`text-sm font-medium ${
                                metric.positive ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {metric.trend}
                              </span>
                            </div>
                            <p className="text-xl font-bold dark:text-white mt-1">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold dark:text-white mb-4">Kostenaufstellung</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Position</th>
                              <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Betrag</th>
                              <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Anteil</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                              <td className="px-4 py-3 dark:text-white">Kaufpreis</td>
                              <td className="px-4 py-3 text-right font-medium dark:text-white">
                                {formatCurrency(currentProperty.total_price)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">100%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 dark:text-gray-300">Provision ({currentProperty.commission_percent}%)</td>
                              <td className="px-4 py-3 text-right dark:text-gray-300">
                                {formatCurrency(currentProperty.total_price * (currentProperty.commission_percent || 0) / 100)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                                {currentProperty.commission_percent}%
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 dark:text-gray-300">Notar & Grundbuch (ca. 2%)</td>
                              <td className="px-4 py-3 text-right dark:text-gray-300">
                                {formatCurrency(currentProperty.total_price * 0.02)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">2%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 dark:text-gray-300">Grunderwerbsteuer (6%)</td>
                              <td className="px-4 py-3 text-right dark:text-gray-300">
                                {formatCurrency(currentProperty.total_price * 0.06)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">6%</td>
                            </tr>
                            <tr className="bg-blue-50 dark:bg-blue-900/20">
                              <td className="px-4 py-3 font-semibold text-blue-900 dark:text-blue-300">
                                Gesamtinvestition
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-blue-900 dark:text-blue-300">
                                {formatCurrency(currentProperty.total_price * (1 + (currentProperty.commission_percent || 0) / 100 + 0.08))}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                                {((currentProperty.commission_percent || 0) + 8).toFixed(1)}%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white mb-4">Erweiterte Cashflow-Analyse</h3>
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

                {activeTab === 'taxes' && (
                  <TaxAssumptionsTab property={currentProperty} />
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Verwaltungskosten</span>
                  <span className="font-medium dark:text-white">{formatCurrency(currentProperty.management_costs || 500)}</span>
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

            {/* Property Features */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold dark:text-white mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Objektmerkmale
              </h3>
              <div className="space-y-3">
                {propertyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{feature.label}</span>
                    <span className="font-medium dark:text-white">{feature.value}</span>
                  </div>
                ))}
                {currentProperty.outdoor_space && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Außenbereich</span>
                    <span className="font-medium dark:text-white">{currentProperty.outdoor_space}</span>
                  </div>
                )}
                {currentProperty.building_condition && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Zustand</span>
                    <span className="font-medium dark:text-white">{currentProperty.building_condition}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Investment-Analyse
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-400">Mietrendite p.a.</span>
                    <span className="font-bold text-green-700 dark:text-green-400">
                      {calculateRentalYield(currentProperty.monthly_rent_cold, currentProperty.total_price).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    Brutto-Mietrendite ohne Berücksichtigung der Nebenkosten
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700 dark:text-blue-400">Wertsteigerung p.a.</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      {currentProperty.value_growth_percent}%
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                    Prognostizierte jährliche Wertsteigerung
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-700 dark:text-purple-400">Gesamtrendite p.a.</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400">
                      {(calculateRentalYield(currentProperty.monthly_rent_cold, currentProperty.total_price) + (currentProperty.value_growth_percent || 0)).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                    Mietrendite + Wertsteigerung (vereinfacht)
                  </p>
                </div>
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
                  <span className="text-gray-600 dark:text-gray-400">Mietsteigerung p.a.</span>
                  <span className="font-medium text-green-600">{currentProperty.rent_increase_percent}%</span>
                </div>
                {currentProperty.asset_class && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Asset-Klasse</span>
                    <span className="font-medium dark:text-white">{currentProperty.asset_class}</span>
                  </div>
                )}
                {currentProperty.investment_class && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Investment-Klasse</span>
                    <span className="font-medium dark:text-white">{currentProperty.investment_class}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Lage & Region
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium dark:text-white">{currentProperty.address}</p>
                  <p className="text-gray-500 dark:text-gray-400">Berlin, Deutschland</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="dark:text-gray-300">ÖPNV-Anbindung: Sehr gut</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="dark:text-gray-300">Einkaufsmöglichkeiten: 0.5 km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="dark:text-gray-300">Schulen: 1.2 km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="dark:text-gray-300">Stadtmitte: 15 min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Risiko-Bewertung
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Standort-Risiko</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                    Niedrig
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vermietbarkeit</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                    Sehr gut
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Marktliquidität</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full text-xs font-medium">
                    Mittel
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gesamtbewertung</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                    Empfehlenswert
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold dark:text-white mb-4">Kontakt & Beratung</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://ui-avatars.com/api/?name=Max+Mustermann&background=3b82f6&color=fff" 
                    className="w-12 h-12 rounded-full"
                    alt="Berater"
                  />
                  <div>
                    <p className="font-medium dark:text-white">Max Mustermann</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Immobilienberater</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+49 171 1234567</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Jetzt anrufen
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    E-Mail senden
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Kostenlose und unverbindliche Beratung
                </div>
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