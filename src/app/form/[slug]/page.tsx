'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

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
}

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
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
  const slug = params.slug as string;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    checkIn: '',
    checkOut: '',
    numberOfGuests: 1,
    purpose: '',
    coTravellers: [],
    privacyAccepted: false,
  });
  
  const [signature, setSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchHotelData();
    }
  }, [slug]);

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
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      
      // Wenn numberOfGuests geändert wird, passe coTravellers an
      if (name === 'numberOfGuests') {
        const numberOfGuests = parseInt(value);
        const requiredCoTravellers = Math.max(0, numberOfGuests - 1); // -1 weil Hauptreisender nicht in coTravellers ist
        
        if (requiredCoTravellers > prev.coTravellers.length) {
          // Füge neue leere Mitreisende hinzu
          const newCoTravellers = [...prev.coTravellers];
          for (let i = prev.coTravellers.length; i < requiredCoTravellers; i++) {
            newCoTravellers.push({ firstName: '', lastName: '', dateOfBirth: '' });
          }
          updated.coTravellers = newCoTravellers;
        } else if (requiredCoTravellers < prev.coTravellers.length) {
          // Entferne überschüssige Mitreisende
          updated.coTravellers = prev.coTravellers.slice(0, requiredCoTravellers);
        }
      }
      
      return updated;
    });
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
    
    if (!signature) {
      setError('Bitte fügen Sie Ihre digitale Unterschrift hinzu');
      return;
    }
    
    // Validiere, dass alle Mitreisende ausgefüllt sind
    const incompleteTravellers = formData.coTravellers.some(
      traveller => !traveller.firstName || !traveller.lastName || !traveller.dateOfBirth
    );
    
    if (incompleteTravellers) {
      setError('Bitte füllen Sie alle Angaben für alle Mitreisende aus');
      return;
    }
    
    // Validiere Hauptreisende-Pflichtfelder
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.address || !formData.checkIn || !formData.checkOut) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }
    
    // Validiere Datenschutz-Zustimmung
    if (!formData.privacyAccepted) {
      setError('Bitte akzeptieren Sie die Datenschutzerklärung');
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
        // Speichere die Submission-ID für PDF-Link
        setSubmittedId(data.data.submissionId);
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
              Vielen Dank!
            </h1>
            <p className="text-gray-600 mb-4">
              Ihr digitaler Meldeschein wurde erfolgreich übermittelt und per E-Mail an das Hotel gesendet.
            </p>
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded mb-6">
              <p className="mb-1">📧 E-Mail gesendet an:</p>
              <p className="font-mono text-xs">Osman.sabani@gmx.de</p>
            </div>
            
            {/* Schließen Button */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                🏠 Zur Startseite
              </button>
              
              {/* Optional: PDF anzeigen */}
              {submittedId && (
                <button
                  onClick={() => window.open(`/api/submissions/${submittedId}/pdf`, '_blank')}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                >
                  📄 PDF Meldeschein anzeigen
                </button>
              )}
              
              <p className="text-xs text-gray-400">
                Sie können dieses Fenster nun schließen
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (fieldName: string, field: { required: boolean; visible: boolean }) => {
    if (!field.visible || fieldName === 'coTravellers') return null;

    const fieldLabels: Record<string, string> = {
      firstName: 'Vorname',
      lastName: 'Nachname',
      dateOfBirth: 'Geburtsdatum',
      address: 'Adresse',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      numberOfGuests: 'Anzahl Gäste',
      purpose: 'Zweck des Aufenthalts',
    };

    const label = fieldLabels[fieldName] || fieldName;
    const value = formData[fieldName as keyof Omit<FormData, 'coTravellers'>];
    
    return (
      <div key={fieldName} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {fieldName === 'numberOfGuests' ? (
          <input
            type="number"
            name={fieldName}
            value={typeof value === 'boolean' ? '' : value}
            onChange={handleInputChange}
            required={field.required}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : fieldName === 'purpose' ? (
          <select
            name={fieldName}
            value={typeof value === 'boolean' ? '' : value}
            onChange={handleInputChange}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Bitte wählen</option>
            <option value="business">Geschäftlich</option>
            <option value="leisure">Urlaub</option>
            <option value="family">Familienbesuch</option>
            <option value="other">Sonstiges</option>
          </select>
        ) : (
          <input
            type={fieldName.includes('Date') || fieldName.includes('In') || fieldName.includes('Out') ? 'date' : 
                  fieldName === 'email' ? 'email' : 'text'}
            name={fieldName}
            value={typeof value === 'boolean' ? '' : value}
            onChange={handleInputChange}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: hotel.themeColor + '10' }}>
            <h1 className="text-2xl font-bold text-gray-900">
              {hotel.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Digitaler Meldeschein
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
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
                <h3 className="text-lg font-semibold text-gray-900">
                  👥 Mitreisende
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Basierend auf der Anzahl Gäste ({formData.numberOfGuests}) werden {Math.max(0, formData.numberOfGuests - 1)} Mitreisende angezeigt
                </p>
              </div>
              
              {formData.coTravellers.length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">
                  Keine Mitreisende (nur Hauptreisende/r)
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.coTravellers.map((traveller, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Mitreisende/r #{index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vorname <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={traveller.firstName}
                            onChange={(e) => handleCoTravellerChange(index, 'firstName', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nachname <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={traveller.lastName}
                            onChange={(e) => handleCoTravellerChange(index, 'lastName', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Geburtsdatum <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={traveller.dateOfBirth}
                            onChange={(e) => handleCoTravellerChange(index, 'dateOfBirth', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
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
                Digitale Unterschrift <span className="text-red-500">*</span>
              </h3>
              <div className="border-2 border-gray-300 rounded-md p-4">
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
                    Bitte unterschreiben Sie in dem Feld oben
                  </p>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Löschen
                  </button>
                </div>
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
                  <span className="text-red-500">*</span> Ich habe die{' '}
                  <a 
                    href="https://www.hhhof.de/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Datenschutzerklärung
                  </a>{' '}
                  gelesen und akzeptiere diese. Ich bin damit einverstanden, dass meine Daten zur Erfüllung der gesetzlichen Meldepflicht verarbeitet werden.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: hotel.themeColor }}
              >
                {submitting ? 'Wird übermittelt...' : 'Meldeschein übermitteln'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}