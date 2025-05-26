// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Building, 
  CreditCard, 
  Globe, 
  Palette, 
  Save,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar: string;
  language: string;
  timezone: string;
  currency: string;
}

interface NotificationSettings {
  emailNewReservation: boolean;
  emailStatusChange: boolean;
  emailNewProperty: boolean;
  emailWeeklyReport: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'company' | 'appearance'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@propsales.de',
    phone: '+49 171 1234567',
    company: 'PropSales GmbH',
    role: 'Vertrieb',
    avatar: 'https://ui-avatars.com/api/?name=Max+Mustermann&background=3b82f6&color=fff',
    language: 'de',
    timezone: 'Europe/Berlin',
    currency: 'EUR'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNewReservation: true,
    emailStatusChange: true,
    emailNewProperty: false,
    emailWeeklyReport: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginAlerts: true
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
    { id: 'security', label: 'Sicherheit', icon: Shield },
    { id: 'company', label: 'Unternehmen', icon: Building },
    { id: 'appearance', label: 'Darstellung', icon: Palette }
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold dark:text-white mb-4">Einstellungen</h2>
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <button
                onClick={handleSave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  saved 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                <span>{saved ? 'Gespeichert!' : 'Speichern'}</span>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src={userSettings.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full"
                      />
                      <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-700 transition-colors">
                        ✎
                      </button>
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-white">Profilbild</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, PNG oder GIF. Max. 2MB.
                      </p>
                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                        Foto hochladen
                      </button>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vorname
                      </label>
                      <input
                        type="text"
                        value={userSettings.firstName}
                        onChange={(e) => setUserSettings({...userSettings, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nachname
                      </label>
                      <input
                        type="text"
                        value={userSettings.lastName}
                        onChange={(e) => setUserSettings({...userSettings, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        E-Mail-Adresse
                      </label>
                      <input
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={userSettings.phone}
                        onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rolle
                      </label>
                      <select
                        value={userSettings.role}
                        onChange={(e) => setUserSettings({...userSettings, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Vertrieb">Vertrieb</option>
                        <option value="Teamleiter">Teamleiter</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sprache
                      </label>
                      <select
                        value={userSettings.language}
                        onChange={(e) => setUserSettings({...userSettings, language: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="de">Deutsch</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium dark:text-white mb-4">E-Mail-Benachrichtigungen</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNewReservation', label: 'Neue Reservierungen', description: 'Benachrichtigung bei neuen Objektreservierungen' },
                        { key: 'emailStatusChange', label: 'Status-Änderungen', description: 'Updates zu Reservierungs- und Verkaufsstatus' },
                        { key: 'emailNewProperty', label: 'Neue Objekte', description: 'Information über neue verfügbare Immobilien' },
                        { key: 'emailWeeklyReport', label: 'Wöchentlicher Bericht', description: 'Zusammenfassung der Verkaufsaktivitäten' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Push-Benachrichtigungen</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'pushNotifications', label: 'Browser-Benachrichtigungen', description: 'Sofortige Benachrichtigungen im Browser' },
                        { key: 'smsNotifications', label: 'SMS-Benachrichtigungen', description: 'Wichtige Updates per SMS' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Passwort ändern</h4>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Aktuelles Passwort
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={securitySettings.currentPassword}
                            onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Neues Passwort
                        </label>
                        <input
                          type="password"
                          value={securitySettings.newPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Passwort bestätigen
                        </label>
                        <input
                          type="password"
                          value={securitySettings.confirmPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Passwort aktualisieren
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Sicherheitseinstellungen</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium dark:text-white">Zwei-Faktor-Authentifizierung</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Zusätzliche Sicherheit durch SMS oder Authenticator-App
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings.twoFactorEnabled}
                              onChange={(e) => setSecuritySettings({...securitySettings, twoFactorEnabled: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                          {securitySettings.twoFactorEnabled && (
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              Einrichten
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium dark:text-white">Login-Benachrichtigungen</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            E-Mail bei Anmeldungen von neuen Geräten
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginAlerts}
                            onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Aktive Sitzungen</h4>
                    <div className="space-y-3">
                      {[
                        { device: 'MacBook Pro', location: 'Berlin, Deutschland', lastActive: 'Jetzt aktiv', current: true },
                        { device: 'iPhone 13', location: 'Berlin, Deutschland', lastActive: 'Vor 2 Stunden', current: false },
                        { device: 'Chrome Browser', location: 'München, Deutschland', lastActive: 'Vor 1 Tag', current: false }
                      ].map((session, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium dark:text-white">{session.device}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {session.location} • {session.lastActive}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.current && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs">
                                Aktuell
                              </span>
                            )}
                            {!session.current && (
                              <button className="text-sm text-red-600 hover:text-red-700">
                                Beenden
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Unternehmensinformationen</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Firmenname
                        </label>
                        <input
                          type="text"
                          value={userSettings.company}
                          onChange={(e) => setUserSettings({...userSettings, company: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Branche
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                          <option>Immobilien</option>
                          <option>Bauträger</option>
                          <option>Makler</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mitarbeiteranzahl
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                          <option>1-10</option>
                          <option>11-50</option>
                          <option>51-200</option>
                          <option>200+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Währung
                        </label>
                        <select
                          value={userSettings.currency}
                          onChange={(e) => setUserSettings({...userSettings, currency: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="EUR">Euro (EUR)</option>
                          <option value="USD">US-Dollar (USD)</option>
                          <option value="GBP">Britisches Pfund (GBP)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Abonnement & Billing</h4>
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="font-semibold text-blue-900 dark:text-blue-300">Professional Plan</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-400">Aktiv bis 15. März 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                          €99/Monat
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Plan ändern
                        </button>
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          Rechnungen anzeigen
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Team-Mitglieder</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Max Mustermann', email: 'max@propsales.de', role: 'Administrator', status: 'Aktiv' },
                        { name: 'Anna Schmidt', email: 'anna@propsales.de', role: 'Vertrieb', status: 'Aktiv' },
                        { name: 'Thomas Wagner', email: 'thomas@propsales.de', role: 'Teamleiter', status: 'Eingeladen' }
                      ].map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium dark:text-white">{member.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{member.role}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === 'Aktiv' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {member.status}
                            </span>
                            <button className="text-sm text-red-600 hover:text-red-700">
                              Entfernen
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white">
                      Neues Mitglied einladen
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Theme-Einstellungen</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'light', name: 'Hell', preview: 'bg-white border-2' },
                        { id: 'dark', name: 'Dunkel', preview: 'bg-gray-900 border-2' },
                        { id: 'auto', name: 'Automatisch', preview: 'bg-gradient-to-br from-white to-gray-900 border-2' }
                      ].map(theme => (
                        <div key={theme.id} className="relative">
                          <input
                            type="radio"
                            id={theme.id}
                            name="theme"
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={theme.id}
                            className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors peer-checked:ring-2 peer-checked:ring-blue-500"
                          >
                            <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview}`}></div>
                            <p className="font-medium dark:text-white text-center">{theme.name}</p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Layout-Optionen</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium dark:text-white">Kompakte Ansicht</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Reduzierte Abstände für mehr Inhalte auf dem Bildschirm
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium dark:text-white">Sidebar automatisch ausblenden</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sidebar auf kleineren Bildschirmen automatisch minimieren
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium dark:text-white mb-4">Farb-Akzente</h4>
                    <div className="flex space-x-3">
                      {[
                        'bg-blue-500',
                        'bg-green-500', 
                        'bg-purple-500',
                        'bg-red-500',
                        'bg-yellow-500',
                        'bg-indigo-500'
                      ].map((color, idx) => (
                        <button
                          key={idx}
                          className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform ${
                            idx === 0 ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}