'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DateInput from '@/components/DateInput';
import { validateDateString } from '@/lib/dateFormatter';

// Temporary interfaces
interface Hotel {
  id: string;
  name: string;
  themeColor: string;
  legalText?: string;
  fieldsConfig: Record<string, { required: boolean; visible: boolean }>;
}

interface Traveller {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  purpose: string;
  coTravellers: Traveller[];
  privacyAccepted: boolean;
}

export default function GuestFormPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { t } = useLanguage();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    checkIn: '',
    checkOut: '',
    numberOfGuests: 1,
    purpose: '',
    coTravellers: [],
    privacyAccepted: false,
  });
  
  const [signature, setSignature] = useState<string | null>(null);
  const [hotelEmail, setHotelEmail] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchHotelData();
    }
  }, [slug]);

  // Canvas initialisieren
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hotels/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setHotel(data.data);
      } else {
        setError('Hotel nicht gefunden');
      }
    } catch (err) {
      setError('Fehler beim Laden der Hoteldaten');
      console.error('Hotel fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    
    if (type === 'number') {
      newValue = parseInt(value);
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Spezielle Funktion für Datumsfelder
  const handleDateChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Co-travellers functions
  const handleCoTravellerChange = (index: number, field: keyof Traveller, value: string) => {
    setFormData(prev => ({
      ...prev,
      coTravellers: prev.coTravellers.map((traveller, i) => 
        i === index ? { ...traveller, [field]: value } : traveller
      )
    }));
  };

  // Spezielle Funktion für Mitreisende-Datumfelder
  const handleCoTravellerDateChange = (index: number, value: string) => {
    handleCoTravellerChange(index, 'dateOfBirth', value);
  };

  // Funktionen für Gäste-Management
  const addCoTraveller = () => {
    // Maximale Anzahl von Gästen begrenzen (z.B. 10)
    if (formData.coTravellers.length < 9) { // 9 Mitreisende + 1 Hauptgast = 10 Gäste max
      setFormData(prev => ({
        ...prev,
        numberOfGuests: prev.numberOfGuests + 1,
        coTravellers: [...prev.coTravellers, { firstName: '', lastName: '', dateOfBirth: '', nationality: '' }]
      }));
    }
  };

  const removeCoTraveller = (index: number) => {
    setFormData(prev => ({
      ...prev,
      numberOfGuests: Math.max(1, prev.numberOfGuests - 1),
      coTravellers: prev.coTravellers.filter((_, i) => i !== index)
    }));
  };

  // Signature pad functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lösche alle vorherigen Fehler
    setError(null);
    setFieldErrors({});
    
    const newFieldErrors: Record<string, string> = {};
    
    // Prüfe ob Canvas existiert und ob etwas gezeichnet wurde
    const canvas = canvasRef.current;
    if (!canvas) {
      setError(t.validation.signatureRequired);
      return;
    }

    // Prüfe ob das Canvas tatsächlich Inhalt hat (nicht nur leer ist)
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError(t.validation.signatureRequired);
      return;
    }

    // Hole Canvas-Daten und prüfe ob es wirklich gezeichnet wurde
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasDrawing = imageData.data.some((pixel, index) => {
      // Prüfe Alpha-Kanal (jeder 4. Wert) - wenn > 0, dann wurde etwas gezeichnet
      return index % 4 === 3 && pixel > 0;
    });

    console.log('Signature validation:', { hasDrawing, signature: !!signature });

    if (!hasDrawing || !signature) {
      setError(t.validation.signatureRequired);
      return;
    }
    
    // Validiere Hauptgast-Pflichtfelder
    if (!formData.firstName) {
      newFieldErrors.firstName = t.validation.fieldErrors.firstName;
    }
    if (!formData.lastName) {
      newFieldErrors.lastName = t.validation.fieldErrors.lastName;
    }
    if (!formData.nationality) {
      newFieldErrors.nationality = t.validation.fieldErrors.nationality;
    }
    if (!formData.address) {
      newFieldErrors.address = t.validation.fieldErrors.address;
    }
    if (!formData.checkIn) {
      newFieldErrors.checkIn = t.validation.fieldErrors.checkIn;
    }
    if (!formData.checkOut) {
      newFieldErrors.checkOut = t.validation.fieldErrors.checkOut;
    }
    
    // Validiere Geburtsdatum
    if (!formData.dateOfBirth) {
      newFieldErrors.dateOfBirth = t.validation.fieldErrors.dateOfBirth;
    } else if (!validateDateString(formData.dateOfBirth)) {
      newFieldErrors.dateOfBirth = t.validation.fieldErrors.dateOfBirth;
    }
    
    // Validiere Mitreisende
    formData.coTravellers.forEach((traveller, index) => {
      if (!traveller.firstName) {
        newFieldErrors[`coTraveller_${index}_firstName`] = t.validation.fieldErrors.firstName;
      }
      if (!traveller.lastName) {
        newFieldErrors[`coTraveller_${index}_lastName`] = t.validation.fieldErrors.lastName;
      }
      if (!traveller.nationality) {
        newFieldErrors[`coTraveller_${index}_nationality`] = t.validation.fieldErrors.nationality;
      }
      if (!traveller.dateOfBirth) {
        newFieldErrors[`coTraveller_${index}_dateOfBirth`] = t.validation.fieldErrors.dateOfBirth;
      } else if (!validateDateString(traveller.dateOfBirth)) {
        newFieldErrors[`coTraveller_${index}_dateOfBirth`] = t.validation.fieldErrors.dateOfBirth;
      }
    });
    
    // Wenn es Feldfehlerfehler gibt, zeige sie an
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }
    
    // Validiere Datenschutz-Zustimmung
    if (!formData.privacyAccepted) {
      setError(t.validation.privacyRequired);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          signature,
          hotelId: hotel?.id,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Submission erfolgreich
        if (data.data?.hotelEmail) {
          setHotelEmail(data.data.hotelEmail);
        }
        setSubmitted(true);
      } else {
        setError(data.error || 'Fehler beim Übermitteln des Meldescheins');
      }
    } catch (err) {
      setError('Fehler beim Übermitteln des Meldescheins');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Hotel nicht gefunden</div>
          <p className="text-gray-600">Die angeforderte Seite existiert nicht.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t.success.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {t.success.message}
            </p>
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded mb-6">
              <p className="mb-1">📧 {t.success.emailSentTo}</p>
              <p className="font-mono text-xs">{hotelEmail || 'Hotel E-Mail'}</p>
            </div>
            
            {/* Schließen Button */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {t.success.backToHome}
              </button>
              
              <p className="text-xs text-gray-400 text-center">
                {t.success.pdfSentInfo}
              </p>
              
              <p className="text-xs text-gray-400 text-center">
                {t.success.closeWindow}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (fieldName: string, field: { required: boolean; visible: boolean }) => {
    if (!field.visible || fieldName === 'coTravellers' || fieldName === 'numberOfGuests') return null;

    const fieldLabels: Record<string, string> = {
      firstName: t.fields.firstName,
      lastName: t.fields.lastName,
      dateOfBirth: t.fields.dateOfBirth,
      nationality: t.fields.nationality,
      address: t.fields.address,
      checkIn: t.fields.arrivalDate,
      checkOut: t.fields.departureDate,
      numberOfGuests: t.fields.numberOfGuests,
      purpose: t.fields.purpose,
    };

    const label = fieldLabels[fieldName] || fieldName;
    const value = formData[fieldName as keyof Omit<FormData, 'coTravellers'>];
    const hasError = fieldErrors[fieldName];
    
    return (
      <div key={fieldName} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {fieldName === 'purpose' ? (
          <select
            name={fieldName}
            value={typeof value === 'boolean' ? '' : value}
            onChange={handleInputChange}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              hasError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">{t.fields.pleaseSelect}</option>
            <option value="private">{t.fields.private}</option>
            <option value="business">{t.fields.business}</option>
          </select>
        ) : fieldName === 'dateOfBirth' ? (
          <DateInput
            name={fieldName}
            value={typeof value === 'boolean' ? '' : String(value)}
            onChange={(newValue) => handleDateChange(fieldName, newValue)}
            placeholder={t.placeholders.dateOfBirth}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              hasError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
        ) : fieldName === 'nationality' ? (
          <input
            type="text"
            name={fieldName}
            value={typeof value === 'boolean' ? '' : String(value)}
            onChange={handleInputChange}
            placeholder={t.placeholders.nationality}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              hasError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
        ) : (
          <input
            type={fieldName.includes('In') || fieldName.includes('Out') ? 'date' : 
                  fieldName === 'email' ? 'email' : 'text'}
            name={fieldName}
            value={typeof value === 'boolean' ? '' : value}
            onChange={handleInputChange}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              hasError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
        )}
        
        {/* Feldspezifische Fehlermeldung */}
        {hasError && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {hasError}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-colors shadow-sm"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{t.form.backToHome}</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: hotel.themeColor + '10' }}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {hotel.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t.form.title}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-6">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Hauptreisende Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                📋 Hauptreisende/r
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(hotel.fieldsConfig).map(([fieldName, field]) =>
                  renderField(fieldName, field)
                )}
              </div>
            </div>

            {/* Mitreisende Section */}
            <div className="mb-8">
              <div className="mb-4 pb-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      👥 {t.form.coTravellers}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t.guests.totalGuests}: {t.guests.mainGuestPlus}{formData.coTravellers.length}{t.guests.coTravellers}
                    </p>
                    {formData.coTravellers.length >= 9 && (
                      <p className="text-xs text-amber-600 mt-1">
                        {t.guests.maxGuestsReached}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addCoTraveller}
                    disabled={formData.coTravellers.length >= 9}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  >
                    <span className="text-lg">+</span>
                    <span>{t.guests.addCoTraveller}</span>
                  </button>
                </div>
              </div>
              
              {formData.coTravellers.length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">
                  {t.guests.noCoTravellers}
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.coTravellers.map((traveller, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">
                          Mitreisende/r #{index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeCoTraveller(index)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        >
                          <span className="text-sm">×</span>
                          <span className="text-sm">{t.guests.removeCoTraveller}</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.fields.firstName} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={traveller.firstName}
                            onChange={(e) => handleCoTravellerChange(index, 'firstName', e.target.value)}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                              fieldErrors[`coTraveller_${index}_firstName`] 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {fieldErrors[`coTraveller_${index}_firstName`] && (
                            <div className="mt-1 text-sm text-red-600 flex items-center">
                              <span className="mr-1">⚠️</span>
                              {fieldErrors[`coTraveller_${index}_firstName`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.fields.lastName} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={traveller.lastName}
                            onChange={(e) => handleCoTravellerChange(index, 'lastName', e.target.value)}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                              fieldErrors[`coTraveller_${index}_lastName`] 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {fieldErrors[`coTraveller_${index}_lastName`] && (
                            <div className="mt-1 text-sm text-red-600 flex items-center">
                              <span className="mr-1">⚠️</span>
                              {fieldErrors[`coTraveller_${index}_lastName`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.fields.dateOfBirth} <span className="text-red-500">*</span>
                          </label>
                          <DateInput
                            value={traveller.dateOfBirth}
                            onChange={(newValue) => handleCoTravellerDateChange(index, newValue)}
                            placeholder={t.placeholders.dateOfBirth}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                              fieldErrors[`coTraveller_${index}_dateOfBirth`] 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {fieldErrors[`coTraveller_${index}_dateOfBirth`] && (
                            <div className="mt-1 text-sm text-red-600 flex items-center">
                              <span className="mr-1">⚠️</span>
                              {fieldErrors[`coTraveller_${index}_dateOfBirth`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.fields.nationality} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder={t.placeholders.nationality}
                            value={traveller.nationality}
                            onChange={(e) => handleCoTravellerChange(index, 'nationality', e.target.value)}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                              fieldErrors[`coTraveller_${index}_nationality`] 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {fieldErrors[`coTraveller_${index}_nationality`] && (
                            <div className="mt-1 text-sm text-red-600 flex items-center">
                              <span className="mr-1">⚠️</span>
                              {fieldErrors[`coTraveller_${index}_nationality`]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signature Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t.signature.title} <span className="text-red-500">*</span>
              </h3>
              <div className={`border-2 rounded-md p-4 ${!signature && error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="border border-gray-200 w-full cursor-crosshair"
                  style={{ touchAction: 'none' }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {t.signature.description}
                  </p>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    {t.signature.clearButton}
                  </button>
                </div>
                {!signature && error && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {t.validation.signatureRequired}
                  </div>
                )}
              </div>
            </div>

            {/* Datenschutz-Checkbox */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacyAccepted"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="privacyAccepted" className="text-sm text-gray-700">
                  <span className="text-red-500">*</span> {t.privacy.text}{' '}
                  <a 
                    href="https://www.hhhof.de/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    {t.privacy.linkText}
                  </a>{' '}
                  {t.privacy.textContinue}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              {/* Fehlermeldung direkt vor Submit Button */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: hotel.themeColor }}
              >
                {submitting ? t.form.submitting : t.form.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}