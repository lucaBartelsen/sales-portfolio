// app/documents/page.tsx
export default function DocumentsPage() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold dark:text-white mb-4">Dokumentenverwaltung</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Die Dokumentenverwaltung wird hier angezeigt. Diese Seite ermöglicht:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
        <li>Upload und Verwaltung von Dokumenten</li>
        <li>Kategorisierung nach Projekten</li>
        <li>Versionskontrolle</li>
        <li>Zugriffsberechtigungen</li>
      </ul>
    </div>
  );
}