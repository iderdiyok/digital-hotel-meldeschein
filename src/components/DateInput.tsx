'use client';

import React, { useState, useEffect } from 'react';
import { formatDateInput, handleDateKeyPress, validateDateString } from '@/lib/dateFormatter';

// Dynamischer Import für react-date-picker (nur im Browser)
import dynamic from 'next/dynamic';

// Date Picker dynamisch laden, um SSR-Probleme zu vermeiden
const DatePicker = dynamic(() => import('react-date-picker'), { ssr: false });

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
  showCalendar?: boolean;
}

export default function DateInput({ 
  value, 
  onChange, 
  placeholder = "TT.MM.JJJJ", 
  required = false,
  className = "",
  name,
  showCalendar = false
}: DateInputProps) {
  
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Mobile-Erkennung (iPad, iPhone, Android)
    const checkIsMobile = () => {
      return /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent) || 
             window.innerWidth <= 1024; // Auch große Tablets erfassen
    };
    
    setIsMobile(checkIsMobile());
    
    // Reagiere auf Bildschirmgrößenänderungen
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hilfsfunktionen für Datums-Konvertierung
  const convertStringToDate = (dateString: string): Date | null => {
    if (!dateString || dateString.length !== 10) return null;
    const [day, month, year] = dateString.split('.');
    if (!day || !month || !year || year.length !== 4) return null;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const convertDateToString = (date: Date | null): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Für Check-in/Check-out Felder mit Kalender
  if (showCalendar && isClient) {
    // Für Mobile/Tablet: React Date Picker (iOS-sicher)
    if (isMobile) {
      return (
        <div className={className}>
          <DatePicker
            onChange={(date) => {
              // TypeScript-sichere Konvertierung
              if (Array.isArray(date)) return; // Range nicht unterstützt
              onChange(convertDateToString(date));
            }}
            value={convertStringToDate(value)}
            clearIcon={null}
            calendarIcon={'📅'}
            format="dd.MM.yyyy"
            required={required}
          />
        </div>
      );
    }

    // Für Desktop: Auch React Date Picker für Konsistenz
    return (
      <div className={className}>
        <DatePicker
          onChange={(date) => {
            // TypeScript-sichere Konvertierung
            if (Array.isArray(date)) return; // Range nicht unterstützt
            onChange(convertDateToString(date));
          }}
          value={convertStringToDate(value)}
          clearIcon={null}
          calendarIcon={'📅'}
          format="dd.MM.yyyy"
          required={required}
        />
      </div>
    );
  }

  // Fallback während SSR oder wenn showCalendar false ist
  if (!isClient && showCalendar) {
    return (
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    );
  }

  // Für Geburtsdatum etc. - Text-Input mit Formatierung
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = formatDateInput(e.target.value);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleDateKeyPress(e, value);
  };

  // Bestimme den Validierungsstatus
  const isComplete = value.length === 10;
  const isValid = isComplete && validateDateString(value);
  const showValidation = value.length >= 3;

  // Dynamische Styling basierend auf Validierung
  let validationClasses = '';
  if (showValidation) {
    if (isComplete && isValid) {
      validationClasses = 'border-green-500 focus:ring-green-500';
    } else if (isComplete && !isValid) {
      validationClasses = 'border-red-500 focus:ring-red-500';
    } else {
      validationClasses = 'border-yellow-500 focus:ring-yellow-500';
    }
  }

  // Text-Input für alle anderen Fälle (z.B. Geburtsdatum)
  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        maxLength={10}
        className={`${className} font-mono ${validationClasses}`}
        autoComplete="off"
        inputMode="numeric" // Hilft bei Touch-Geräten
      />
      
      {/* Validierungs-Indikator nur bei Text-Input */}
      {showValidation && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isComplete && isValid && (
            <span className="text-green-500 text-lg">✓</span>
          )}
          {isComplete && !isValid && (
            <span className="text-red-500 text-lg">✗</span>
          )}
          {!isComplete && (
            <span className="text-yellow-500 text-sm">...</span>
          )}
        </div>
      )}
    </div>
  );
}