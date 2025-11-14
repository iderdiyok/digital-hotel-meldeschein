export const translations = {
  de: {
    // Home page
    home: {
      title: 'Meldeschein ausfüllen',
      greeting: 'Liebe Gäste,',
      description:
        'bitte füllen Sie den digitalen Meldeschein aus. Dies ist gesetzlich vorgeschrieben und hilft uns dabei, Ihren Aufenthalt ordnungsgemäß zu dokumentieren.',
      thankYou:
        'Vielen Dank für Ihr Verständnis und einen angenehmen Aufenthalt!',
      fillOutButton: 'Meldeschein jetzt ausfüllen',
      contact: '📞 +49(0)40 - 32 31 07 - 0 | ✉️ info@hhhof.de',
      privacyNotice: 'Mit der Nutzung dieses Service akzeptieren Sie unsere',
      privacyLink: 'Datenschutzerklärung',
    },

    // Navigation
    nav: {
      title: 'Hotel Meldeschein',
      language: 'Sprache',
    },

    // Form titles and headers
    form: {
      title: 'Hotel-Registrierungsformular',
      subtitle: 'Bitte füllen Sie alle erforderlichen Felder aus',
      guestData: 'Gästedaten',
      mainGuest: 'Hauptgast',
      coTravellers: 'Mitreisende Gäste',
      stayDetails: 'Aufenthaltsdetails',
      submit: 'Anmeldung absenden',
      submitting: 'Wird gesendet...',
      backToHome: 'Zurück zur Startseite',
    },

    // Form fields
    fields: {
      // Personal data
      firstName: 'Vorname',
      lastName: 'Nachname',
      dateOfBirth: 'Geburtsdatum',
      nationality: 'Staatsangehörigkeit',
      documentType: 'Dokumenttyp',
      documentNumber: 'Dokumentnummer',
      address: 'Adresse',
      city: 'Stadt',
      postalCode: 'Postleitzahl',
      country: 'Land',

      // Contact
      email: 'E-Mail',
      phone: 'Telefon',

      // Stay details
      arrivalDate: 'Ankunftsdatum',
      departureDate: 'Abreisedatum',
      numberOfGuests: 'Anzahl Gäste',
      roomNumber: 'Zimmernummer',
      purpose: 'Zweck des Aufenthalts',

      // Options
      business: 'Geschäftlich',
      private: 'Privat',
      leisure: 'Urlaub',
      family: 'Familienbesuch',
      other: 'Sonstiges',
      pleaseSelect: 'Bitte wählen',
    },

    // Signature
    signature: {
      title: 'Digitale Unterschrift',
      description:
        'Bitte unterschreiben Sie mit Ihrem Finger oder der Maus im Feld unten',
      clearButton: 'Löschen',
    },

    // Privacy
    privacy: {
      text: 'Ich habe die',
      linkText: 'Datenschutzerklärung',
      textContinue:
        'gelesen und akzeptiere diese. Ich bin damit einverstanden, dass meine Daten zur Erfüllung der gesetzlichen Meldepflicht verarbeitet werden.',
    },

    // Validation messages
    validation: {
      required: 'Dieses Feld ist erforderlich',
      invalidEmail: 'Ungültige E-Mail-Adresse',
      invalidDate: 'Ungültiges Datum (TT.MM.JJJJ)',
      invalidPhone: 'Ungültige Telefonnummer',
      signatureRequired: 'Bitte fügen Sie Ihre digitale Unterschrift hinzu',
      incompleteTravellers:
        'Bitte füllen Sie alle Angaben für alle Mitreisende aus',
      requiredFields: 'Bitte füllen Sie alle Pflichtfelder aus',
      privacyRequired: 'Bitte akzeptieren Sie die Datenschutzerklärung',
      // Feldspezifische Fehler
      fieldErrors: {
        firstName: 'Vorname ist erforderlich',
        lastName: 'Nachname ist erforderlich',
        dateOfBirth: 'Ungültiges Geburtsdatum (TT.MM.JJJJ)',
        nationality: 'Staatsangehörigkeit ist erforderlich',
        address: 'Adresse ist erforderlich',
        checkIn: 'Ankunftsdatum ist erforderlich',
        checkOut: 'Abreisedatum ist erforderlich',
      },
    },

    // Success page
    success: {
      title: 'Vielen Dank!',
      message:
        'Ihr digitaler Meldeschein wurde erfolgreich übermittelt und per E-Mail an das Hotel gesendet.',
      submittedAt: 'Übermittelt am',
      backToForm: 'Zurück zum Formular',
      emailSentTo: 'E-Mail gesendet an:',
      backToHome: '🏠 Zur Startseite',
      pdfSentInfo: 'Das PDF wurde per E-Mail an das Hotel gesendet',
      closeWindow: 'Sie können dieses Fenster nun schließen',
    },

    // Common
    common: {
      required: '*',
      optional: '(optional)',
      add: 'Hinzufügen',
      remove: 'Entfernen',
      yes: 'Ja',
      no: 'Nein',
    },

    // Guest management
    guests: {
      addCoTraveller: 'Mitreisende/n hinzufügen',
      removeCoTraveller: 'Entfernen',
      totalGuests: 'Gesamtanzahl Gäste',
      mainGuestPlus: 'Hauptgast + ',
      coTravellers: ' Mitreisende',
      maxGuestsReached: 'Maximale Anzahl von Gästen erreicht (10)',
      noCoTravellers: 'Keine Mitreisende (nur Hauptreisende/r)',
    },

    // Placeholders
    placeholders: {
      firstName: 'Max',
      lastName: 'Mustermann',
      dateOfBirth: 'TT.MM.JJJJ',
      nationality: 'z.B. deutsch, albanisch, etc.',
      documentNumber: 'z.B. T12345678',
      email: 'max.mustermann@email.com',
      phone: '+49 123 456789',
      address: 'Musterstraße 123',
      city: 'Berlin',
      postalCode: '12345',
      roomNumber: '101',
    },
  },

  en: {
    // Home page
    home: {
      title: 'Fill out Registration Form',
      greeting: 'Dear Guests,',
      description:
        'please fill out the digital registration form. This is legally required and helps us properly document your stay.',
      thankYou: 'Thank you for your understanding and have a pleasant stay!',
      fillOutButton: 'Fill out registration form now',
      contact: '📞 +49(0)40 - 32 31 07 - 0 | ✉️ info@hhhof.de',
      privacyNotice: 'By using this service you accept our',
      privacyLink: 'Privacy Policy',
    },

    // Navigation
    nav: {
      title: 'Hotel Registration',
      language: 'Language',
    },

    // Form titles and headers
    form: {
      title: 'Hotel Registration Form',
      subtitle: 'Please fill out all required fields',
      guestData: 'Guest Information',
      mainGuest: 'Main Guest',
      coTravellers: 'Co-Travellers',
      stayDetails: 'Stay Details',
      submit: 'Submit Registration',
      submitting: 'Submitting...',
      backToHome: 'Back to Homepage',
    },

    // Form fields
    fields: {
      // Personal data
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      nationality: 'Nationality',
      documentType: 'Document Type',
      documentNumber: 'Document Number',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',

      // Contact
      email: 'Email',
      phone: 'Phone',

      // Stay details
      arrivalDate: 'Arrival Date',
      departureDate: 'Departure Date',
      numberOfGuests: 'Number of Guests',
      roomNumber: 'Room Number',
      purpose: 'Purpose of Stay',

      // Options
      business: 'Business',
      private: 'Private',
      leisure: 'Vacation',
      family: 'Family Visit',
      other: 'Other',
      pleaseSelect: 'Please select',
    },

    // Signature
    signature: {
      title: 'Digital Signature',
      description: 'Please sign with your finger or mouse in the field below',
      clearButton: 'Clear',
    },

    // Privacy
    privacy: {
      text: 'I have read the',
      linkText: 'Privacy Policy',
      textContinue:
        'and accept it. I agree that my data may be processed to fulfill the legal registration requirements.',
    },

    // Validation messages
    validation: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidDate: 'Invalid date (DD.MM.YYYY)',
      invalidPhone: 'Invalid phone number',
      signatureRequired: 'Please add your digital signature',
      incompleteTravellers:
        'Please fill in all information for all co-travellers',
      requiredFields: 'Please fill in all required fields',
      privacyRequired: 'Please accept the privacy policy',
      // Field-specific errors
      fieldErrors: {
        firstName: 'First name is required',
        lastName: 'Last name is required',
        dateOfBirth: 'Invalid date of birth (DD.MM.YYYY)',
        nationality: 'Nationality is required',
        address: 'Address is required',
        checkIn: 'Check-in date is required',
        checkOut: 'Check-out date is required',
      },
    },

    // Success page
    success: {
      title: 'Thank You!',
      message:
        'Your digital registration has been successfully submitted and sent to the hotel by email.',
      submittedAt: 'Submitted on',
      backToForm: 'Back to Form',
      emailSentTo: 'Email sent to:',
      backToHome: '🏠 Back to Home',
      pdfSentInfo: 'The PDF was sent to the hotel by email',
      closeWindow: 'You can now close this window',
    },

    // Common
    common: {
      required: '*',
      optional: '(optional)',
      add: 'Add',
      remove: 'Remove',
      yes: 'Yes',
      no: 'No',
    },

    // Guest management
    guests: {
      addCoTraveller: 'Add Co-Traveller',
      removeCoTraveller: 'Remove',
      totalGuests: 'Total Guests',
      mainGuestPlus: 'Main Guest + ',
      coTravellers: ' Co-Travellers',
      maxGuestsReached: 'Maximum number of guests reached (10)',
      noCoTravellers: 'No co-travellers (main guest only)',
    },

    // Placeholders
    placeholders: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: 'DD.MM.YYYY',
      nationality: 'e.g. German, Albanian, etc.',
      documentNumber: 'e.g. T12345678',
      email: 'john.doe@email.com',
      phone: '+49 123 456789',
      address: 'Sample Street 123',
      city: 'Berlin',
      postalCode: '12345',
      roomNumber: '101',
    },
  },
} as const;

export type Language = 'de' | 'en';
export type TranslationKeys = typeof translations.de;
