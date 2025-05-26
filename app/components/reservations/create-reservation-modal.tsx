// app/components/reservations/create-reservation-modal.tsx
'use client';

import { useState } from 'react';
import { X, Upload, FileText, User, Mail, Phone, Building2, Calendar, CheckCircle } from 'lucide-react';
import { Property } from '@/types';

interface CreateReservationModalProps {
  property: Property;
  onClose: () => void;
  onSubmit: (reservationData: ReservationFormData) => void;
}

interface ReservationFormData {
  property_id: number;
  property_address: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_company?: string;
  notes: string;
  reservation_date: string;
  uploaded_document?: File;
  contact_method: 'phone' | 'email' | 'meeting' | 'online';
  source: 'website' | 'referral' | 'direct' | 'social' | 'advertisement';
}

export default function CreateReservationModal({ property, onClose, onSubmit }: CreateReservationModalProps) {
  const [currentStep, setCurrentStep] = useState<'customer' | 'details' | 'document' | 'summary'>('customer');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<ReservationFormData>({
    property_id: property.id,
    property_address: `${property.address}, ${property.unit_number}`,
    buyer_first_name: '',
    buyer_last_name: '',
    buyer_email: '',
    buyer_phone: '',
    buyer_company: '',
    notes: '',
    reservation_date: new Date().toISOString().split('T')[0],
    contact_method: 'email',
    source: 'website'
  });

  const steps = [
    { id: 'customer', title: 'Kundendaten', icon: User },
    { id: 'details', title: 'Details', icon: Building2 },
    { id: 'document', title: 'Dokument', icon: FileText },
    { id: 'summary', title: 'Zusammenfassung', icon: CheckCircle }
  ];

  const handleInputChange = (field: keyof ReservationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, uploaded_document: file }));
    } else {
      alert('Bitte laden Sie nur PDF- oder Bilddateien hoch.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const isStepValid = (step: string) => {
    switch (step) {
      case 'customer':
        return formData.buyer_first_name && formData.buyer_last_name && formData.buyer_email && formData.buyer_phone;
      case 'details':
        return formData.reservation_date && formData.contact_method && formData.source;
      case 'document':
        return uploadedFile !== null;
      case 'summary':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const stepOrder = ['customer', 'details', 'document', 'summary'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1] as any);
    }
  };

  const handlePrevious = () => {
    const stepOrder = ['customer', 'details', 'document', 'summary'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1] as any);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit(formData);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white mb-2">Reservierung erfolgreich!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Die Reservierung wurde erstellt und das Objekt wurde auf "Angefragt" gesetzt.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reservierung für: <strong className="dark:text-white">{formData.property_address}</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kunde: <strong className="dark:text-white">{formData.buyer_first_name} {formData.buyer_last_name}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Neue Reservierung</h2>
            <p className="text-gray-500 dark:text-gray-400">{property.address}, {property.unit_number}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const isValid = isStepValid(step.id);
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : isCompleted || isValid
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {currentStep === 'customer' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    value={formData.buyer_first_name}
                    onChange={(e) => handleInputChange('buyer_first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    value={formData.buyer_last_name}
                    onChange={(e) => handleInputChange('buyer_last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Mustermann"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    value={formData.buyer_email}
                    onChange={(e) => handleInputChange('buyer_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="max.mustermann@email.de"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefonnummer *
                  </label>
                  <input
                    type="tel"
                    value={formData.buyer_phone}
                    onChange={(e) => handleInputChange('buyer_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="+49 171 1234567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Firma (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.buyer_company}
                    onChange={(e) => handleInputChange('buyer_company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Firmenname GmbH"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reservierungsdatum *
                  </label>
                  <input
                    type="date"
                    value={formData.reservation_date}
                    onChange={(e) => handleInputChange('reservation_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kontaktmethode *
                  </label>
                  <select
                    value={formData.contact_method}
                    onChange={(e) => handleInputChange('contact_method', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="email">E-Mail</option>
                    <option value="phone">Telefon</option>
                    <option value="meeting">Persönliches Treffen</option>
                    <option value="online">Online-Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kundenquelle *
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Empfehlung</option>
                    <option value="direct">Direktkontakt</option>
                    <option value="social">Social Media</option>
                    <option value="advertisement">Werbung</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notizen
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Zusätzliche Informationen zum Kunden oder zur Reservierung..."
                />
              </div>
            </div>
          )}

          {currentStep === 'document' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold dark:text-white mb-4">
                  Unterschriebenes Reservierungsformular hochladen *
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Bitte laden Sie das vom Kunden unterschriebene Reservierungsformular hoch (PDF oder Bild).
                </p>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : uploadedFile
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Datei entfernen
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium dark:text-white">
                          Datei hier ablegen oder klicken zum Auswählen
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PDF oder Bilddateien bis 10 MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Datei auswählen
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'summary' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Zusammenfassung der Reservierung
              </h3>
              
              {/* Property Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium dark:text-white mb-2 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Objekt
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="dark:text-gray-300">
                    <strong>Adresse:</strong> {formData.property_address}
                  </p>
                  <p className="dark:text-gray-300">
                    <strong>Preis:</strong> {formatCurrency(property.total_price)}
                  </p>
                  <p className="dark:text-gray-300">
                    <strong>Größe:</strong> {property.size_m2} m² • {property.rooms} Zimmer
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium dark:text-white mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Kunde
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="dark:text-gray-300">
                    <strong>Name:</strong> {formData.buyer_first_name} {formData.buyer_last_name}
                  </p>
                  <p className="dark:text-gray-300">
                    <strong>E-Mail:</strong> {formData.buyer_email}
                  </p>
                  <p className="dark:text-gray-300">
                    <strong>Telefon:</strong> {formData.buyer_phone}
                  </p>
                  {formData.buyer_company && (
                    <p className="dark:text-gray-300">
                      <strong>Firma:</strong> {formData.buyer_company}
                    </p>
                  )}
                </div>
              </div>

              {/* Reservation Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium dark:text-white mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="dark:text-gray-300">
                    <strong>Datum:</strong> {new Date(formData.reservation_date).toLocaleDateString('de-DE')}
                  </p>
                  <p className="dark:text-gray-300">
                    <strong>Kontakt:</strong> {formData.contact_method === 'email' ? 'E-Mail' : 
                                              formData.contact_method === 'phone' ? 'Telefon' :
                                              formData.contact_method === 'meeting' ? 'Persönliches Treffen' : 'Online-Meeting'}
                  </p>
                  <p className="dark:text-gray-300">
                    <strong>Quelle:</strong> {formData.source === 'website' ? 'Website' :
                                            formData.source === 'referral' ? 'Empfehlung' :
                                            formData.source === 'direct' ? 'Direktkontakt' :
                                            formData.source === 'social' ? 'Social Media' : 'Werbung'}
                  </p>
                  {formData.notes && (
                    <p className="dark:text-gray-300">
                      <strong>Notizen:</strong> {formData.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Document Info */}
              {uploadedFile && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium dark:text-white mb-2 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Hochgeladenes Dokument
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 'customer'}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
            >
              Zurück
            </button>
            
            <div className="flex space-x-3">
              {currentStep !== 'summary' ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Weiter
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird erstellt...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Reservierung erstellen
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}