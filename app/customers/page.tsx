// app/customers/page.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Phone, Mail, Eye, Edit, Trash2, User, Calendar, Building2 } from 'lucide-react';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'interested' | 'inactive';
  created_date: string;
  last_contact: string;
  properties_interested: string[];
  budget_min: number;
  budget_max: number;
  preferred_location: string;
  notes: string;
  source: string;
}

const sampleCustomers: Customer[] = [
  {
    id: 1,
    first_name: 'Max',
    last_name: 'Müller',
    email: 'max.mueller@email.de',
    phone: '+49 171 1234567',
    company: 'TechCorp GmbH',
    status: 'active',
    created_date: '2024-01-15',
    last_contact: '2024-01-20',
    properties_interested: ['Kurfürstendamm 123, 3A'],
    budget_min: 500000,
    budget_max: 800000,
    preferred_location: 'Berlin Mitte',
    notes: 'Sucht nach Investitionsobjekt für Altersvorsorge',
    source: 'Website'
  },
  {
    id: 2,
    first_name: 'Anna',
    last_name: 'Schmidt',
    email: 'anna.schmidt@email.de',
    phone: '+49 172 2345678',
    status: 'interested',
    created_date: '2024-01-10',
    last_contact: '2024-01-18',
    properties_interested: ['Prenzlauer Allee 45, 12B', 'Friedrichstraße 78, PH1'],
    budget_min: 1000000,
    budget_max: 2000000,
    preferred_location: 'Prenzlauer Berg',
    notes: 'Erstinvestor, benötigt ausführliche Beratung',
    source: 'Empfehlung'
  },
  {
    id: 3,
    first_name: 'Thomas',
    last_name: 'Wagner',
    email: 'thomas.wagner@email.de',
    phone: '+49 173 3456789',
    company: 'Wagner Immobilien',
    status: 'active',
    created_date: '2024-01-05',
    last_contact: '2024-01-22',
    properties_interested: ['Friedrichstraße 78, PH1'],
    budget_min: 2000000,
    budget_max: 5000000,
    preferred_location: 'Berlin Mitte',
    notes: 'Erfahrener Investor, Portfolio-Erweiterung',
    source: 'Messe'
  }
];

const statusStyles = {
  'active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'interested': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
};

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(sampleCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchTerm === '' || 
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE');
  };

  return (
    <>
      <div className="animate-fade-in space-y-6">
        {/* Header with Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Suche nach Name, E-Mail oder Firma..."
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
                <span>Neuer Kunde</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Alle Status</option>
                <option value="active">Aktiv</option>
                <option value="interested">Interessiert</option>
                <option value="inactive">Inaktiv</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>Budget</option>
                <option>Unter €500k</option>
                <option>€500k - €1M</option>
                <option>€1M - €2M</option>
                <option>Über €2M</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>Quelle</option>
                <option>Website</option>
                <option>Empfehlung</option>
                <option>Messe</option>
                <option>Social Media</option>
              </select>
            </div>
          )}
        </div>

        {/* Customer Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Letzter Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium dark:text-white">
                            {customer.first_name} {customer.last_name}
                          </div>
                          {customer.company && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm dark:text-gray-300">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[customer.status]}`}>
                        {customer.status === 'active' ? 'Aktiv' : 
                         customer.status === 'interested' ? 'Interessiert' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                      {formatCurrency(customer.budget_min)} - {formatCurrency(customer.budget_max)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(customer.last_contact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(customer);
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold dark:text-white">Kundendetails</h2>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">Grunddaten</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedCustomer.first_name} {selectedCustomer.last_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-Mail
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telefon
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedCustomer.phone}</p>
                    </div>
                    {selectedCustomer.company && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Firma
                        </label>
                        <p className="text-gray-900 dark:text-white">{selectedCustomer.company}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Investment Profile */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">Anlageprofil</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Budget
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {formatCurrency(selectedCustomer.budget_min)} - {formatCurrency(selectedCustomer.budget_max)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bevorzugte Lage
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedCustomer.preferred_location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[selectedCustomer.status]}`}>
                        {selectedCustomer.status === 'active' ? 'Aktiv' : 
                         selectedCustomer.status === 'interested' ? 'Interessiert' : 'Inaktiv'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties of Interest */}
              <div>
                <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Interessante Objekte
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.properties_interested.map((property, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="font-medium dark:text-white">{property}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold dark:text-white mb-4">Notizen</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{selectedCustomer.notes}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Aktivitäten
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium dark:text-white">Letzter Kontakt</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(selectedCustomer.last_contact)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium dark:text-white">Kunde erstellt</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(selectedCustomer.created_date)} - Quelle: {selectedCustomer.source}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  E-Mail senden
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Anrufen
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white">
                  Bearbeiten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}