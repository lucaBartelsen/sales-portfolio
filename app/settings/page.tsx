// app/settings/page.tsx
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Einstellungen</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium dark:text-white mb-2">Benutzerprofil</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Verwalten Sie Ihre persönlichen Informationen und Präferenzen.
            </p>
          </div>
          <div>
            <h3 className="font-medium dark:text-white mb-2">Benachrichtigungen</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Konfigurieren Sie E-Mail- und In-App-Benachrichtigungen.
            </p>
          </div>
          <div>
            <h3 className="font-medium dark:text-white mb-2">Sicherheit</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Ändern Sie Ihr Passwort und verwalten Sie Sicherheitseinstellungen.
            </p>
          </div>
          <div>
            <h3 className="font-medium dark:text-white mb-2">Firmenverwaltung</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Verwalten Sie Firmeneinstellungen, Benutzer und Abonnements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}