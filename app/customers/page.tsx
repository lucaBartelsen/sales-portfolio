export default function CustomersPage() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold dark:text-white mb-4">Kundenverwaltung</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Die Kundenverwaltung wird hier angezeigt. Diese Seite ermöglicht:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
        <li>Verwaltung von Kundendaten</li>
        <li>Kommunikationshistorie</li>
        <li>Interessenprofile</li>
        <li>Kaufhistorie</li>
      </ul>
    </div>
  );
}