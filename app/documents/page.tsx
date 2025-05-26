// app/documents/page.tsx
'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Folder,
  Star,
  Calendar,
  User,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  category: string;
  project: string;
  created_date: string;
  modified_date: string;
  created_by: string;
  version: string;
  tags: string[];
  is_favorite: boolean;
  access_level: 'public' | 'restricted' | 'private';
}

const sampleDocuments: Document[] = [
  {
    id: 1,
    name: 'Grundriss_Kurfuerstendamm_123_3A.pdf',
    type: 'PDF',
    size: '2.4 MB',
    category: 'Grundrisse',
    project: 'Berlin Mitte Residenz',
    created_date: '2024-01-15',
    modified_date: '2024-01-20',
    created_by: 'Max Mustermann',
    version: '1.2',
    tags: ['Grundriss', 'Wohnung', '3A'],
    is_favorite: true,
    access_level: 'public'
  },
  {
    id: 2,
    name: 'Energieausweis_Prenzlauer_Allee_45.pdf',
    type: 'PDF',
    size: '1.8 MB',
    category: 'Energieausweise',
    project: 'Prenzlauer Berg Tower',
    created_date: '2024-01-12',
    modified_date: '2024-01-18',
    created_by: 'Anna Schmidt',
    version: '1.0',
    tags: ['Energieausweis', 'Zertifikat'],
    is_favorite: false,
    access_level: 'public'
  },
  {
    id: 3,
    name: 'Kaufvertrag_Muster_2024.docx',
    type: 'DOCX',
    size: '156 KB',
    category: 'Verträge',
    project: 'Allgemein',
    created_date: '2024-01-08',
    modified_date: '2024-01-22',
    created_by: 'Thomas Wagner',
    version: '2.1',
    tags: ['Kaufvertrag', 'Muster', 'Legal'],
    is_favorite: true,
    access_level: 'restricted'
  },
  {
    id: 4,
    name: 'Wirtschaftlichkeitsberechnung_Friedrich_Luxury.xlsx',
    type: 'XLSX',
    size: '890 KB',
    category: 'Kalkulationen',
    project: 'Friedrich Luxury Living',
    created_date: '2024-01-10',
    modified_date: '2024-01-21',
    created_by: 'Max Mustermann',
    version: '1.5',
    tags: ['Kalkulation', 'ROI', 'Finanzierung'],
    is_favorite: false,
    access_level: 'private'
  },
  {
    id: 5,
    name: 'Baubeschreibung_Alex_Tower.pdf',
    type: 'PDF',
    size: '3.2 MB',
    category: 'Baubeschreibungen',
    project: 'Alex Tower',
    created_date: '2024-01-05',
    modified_date: '2024-01-15',
    created_by: 'Julia Weber',
    version: '1.0',
    tags: ['Baubeschreibung', 'Ausstattung'],
    is_favorite: false,
    access_level: 'public'
  }
];

const categories = [
  'Alle Kategorien',
  'Grundrisse',
  'Energieausweise', 
  'Verträge',
  'Kalkulationen',
  'Baubeschreibungen',
  'Marketing',
  'Legal'
];

const projects = [
  'Alle Projekte',
  'Berlin Mitte Residenz',
  'Prenzlauer Berg Tower',
  'Friedrich Luxury Living',
  'Alex Tower',
  'Potsdamer Höfe'
];

const accessLevelStyles = {
  'public': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'restricted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'private': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return '📄';
    case 'docx':
    case 'doc':
      return '📝';
    case 'xlsx':
    case 'xls':
      return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return '🖼️';
    default:
      return '📁';
  }
};

export default function DocumentsPage() {
  const [documents] = useState<Document[]>(sampleDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Alle Kategorien');
  const [projectFilter, setProjectFilter] = useState('Alle Projekte');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'Alle Kategorien' || doc.category === categoryFilter;
    const matchesProject = projectFilter === 'Alle Projekte' || doc.project === projectFilter;
    
    return matchesSearch && matchesCategory && matchesProject;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.modified_date).getTime() - new Date(b.modified_date).getTime();
        break;
      case 'size':
        const sizeA = parseFloat(a.size.replace(/[^\d.]/g, ''));
        const sizeB = parseFloat(b.size.replace(/[^\d.]/g, ''));
        comparison = sizeA - sizeB;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE');
  };

  return (
    <>
      <div className="animate-fade-in space-y-6">
        {/* Header with Search and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Suche nach Dokumenten, Tags..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select 
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'text-gray-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'text-gray-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sortieren nach:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Name</option>
              <option value="date">Datum</option>
              <option value="size">Größe</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Documents Display */}
        {viewMode === 'list' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dokument
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kategorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Projekt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Größe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Geändert
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Zugriff
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDocuments.map(doc => (
                    <tr 
                      key={doc.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getFileIcon(doc.type)}</span>
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium dark:text-white">{doc.name}</span>
                              {doc.is_favorite && (
                                <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Version {doc.version} • {doc.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Folder className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm dark:text-gray-300">{doc.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                        {doc.project}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm dark:text-gray-300">{formatDate(doc.modified_date)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">von {doc.created_by}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${accessLevelStyles[doc.access_level]}`}>
                          {doc.access_level === 'public' ? 'Öffentlich' : 
                           doc.access_level === 'restricted' ? 'Eingeschränkt' : 'Privat'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDocument(doc);
                            }}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map(doc => (
              <div 
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDocument(doc)}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{getFileIcon(doc.type)}</span>
                  <div className="flex items-center space-x-2">
                    {doc.is_favorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium dark:text-white mb-2 truncate" title={doc.name}>
                  {doc.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Folder className="w-4 h-4 mr-2" />
                    <span>{doc.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(doc.modified_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{doc.created_by}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{doc.size}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${accessLevelStyles[doc.access_level]}`}>
                    {doc.access_level === 'public' ? 'Öffentlich' : 
                     doc.access_level === 'restricted' ? 'Eingeschränkt' : 'Privat'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold dark:text-white">Dokumentdetails</h2>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* File Preview */}
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-6xl">{getFileIcon(selectedDocument.type)}</span>
                <h3 className="mt-4 text-xl font-semibold dark:text-white">{selectedDocument.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedDocument.type} • {selectedDocument.size}
                </p>
              </div>

              {/* Document Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold dark:text-white">Dokumentinformationen</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kategorie
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedDocument.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Projekt
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedDocument.project}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Version
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedDocument.version}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Zugriffsebene
                      </label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${accessLevelStyles[selectedDocument.access_level]}`}>
                        {selectedDocument.access_level === 'public' ? 'Öffentlich' : 
                         selectedDocument.access_level === 'restricted' ? 'Eingeschränkt' : 'Privat'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold dark:text-white">Zeitstempel</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Erstellt
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(selectedDocument.created_date)} von {selectedDocument.created_by}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Zuletzt geändert
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(selectedDocument.modified_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold dark:text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Herunterladen
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Öffnen
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white flex items-center justify-center">
                  <Edit className="w-5 h-5 mr-2" />
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