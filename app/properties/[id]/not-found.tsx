// app/properties/[id]/not-found.tsx
import Link from 'next/link';
import { Building2, ArrowLeft } from 'lucide-react';

export default function PropertyNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Objekt nicht gefunden
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Das angeforderte Objekt existiert nicht oder wurde entfernt.
        </p>
        <Link 
          href="/properties"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Objektübersicht</span>
        </Link>
      </div>
    </div>
  );
}