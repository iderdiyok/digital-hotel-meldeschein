'use client';

import React from 'react';
import { formatDateInput, handleDateKeyPress, validateDateString } from '@/lib/dateFormatter';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

export default function DateInput({ 
  value, 
  onChange, 
  placeholder = "TT.MM.JJJJ", 
  required = false,
  className = "",
  name 
}: DateInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = formatDateInput(e.target.value);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleDateKeyPress(e, value);
  };

  // Bestimme den Validierungsstatus
  const isComplete = value.length === 10;
  const isValid = isComplete && validateDateString(value);
  const showValidation = value.length >= 3; // Zeige Validierung nach mindestens 3 Zeichen

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

  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        maxLength={10}
        className={`${className} font-mono ${validationClasses}`}
        autoComplete="off"
      />
      
      {/* Validierungs-Indikator */}
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