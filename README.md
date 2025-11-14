# 🏨 Digital Hotel Meldeschein

Eine moderne, DSGVO-konforme Lösung für digitale Meldescheine in Hotels. Ermöglicht es Hotels, Gäste-Registrierungen vollständig digital zu verwalten mit automatischer PDF-Generierung und E-Mail-Versand.

## 🔐 Sicherheit / Passwort-Schutz

Die Anwendung verfügt über **HTTP Basic Authentication** für alle `/form/*` Pfade (Meldeschein-Formulare).

### Einrichtung der Authentifizierung

**Lokale Entwicklung:**

```bash
export BASIC_AUTH_USER=hotel
export BASIC_AUTH_PASS=GeheimesPasswort123
npm run dev
```

**Vercel Production:**

1. Gehe zu deinem Vercel-Projekt → **Settings** → **Environment Variables**
2. Füge hinzu:
   - `BASIC_AUTH_USER` = `hotel` (oder dein gewünschter Benutzername)
   - `BASIC_AUTH_PASS` = `GeheimesPasswort123` (oder dein gewünschtes Passwort)
3. Deploy die Anwendung

**Test der Authentifizierung:**

```bash
# Mit korrekten Credentials
curl --user hotel:GeheimesPasswort123 https://deine-domain.vercel.app/form/hotel-name

# Ohne Credentials (sollte 401 zurückgeben)
curl https://deine-domain.vercel.app/form/hotel-name
```

> **Hinweis:** Die Hauptseite `/` bleibt öffentlich zugänglich. Nur die Meldeschein-Formulare unter `/form/*` sind geschützt.

## 🌟 Features

### ✅ Vollständig implementiert

- **Mehrsprachig** - Deutsch/Englisch mit Sprachumschalter
- **Tablet-optimierte Benutzeroberfläche** - Touchscreen-freundlich
- **Digitale Unterschrift** - Canvas-basierte Signatur (Pflichtfeld)
- **PDF-Generierung** - Automatische Erstellung optimierter Meldeschein-PDFs
- **E-Mail-Versendung** - SMTP-basierter Versand mit PDF-Anhang
- **Datenschutz-Compliance** - Pflicht-Checkbox mit Link zur Datenschutzerklärung

### 🔧 Technische Features

- **Next.js 14** mit TypeScript und Tailwind CSS
- **Responsive Design** - Optimiert für Tablets und Mobilgeräte
- **Zod Validation** - Sichere Datenvalidierung
- **Puppeteer PDF** - Professionelle PDF-Erstellung
- **SMTP Integration** - Echte E-Mail-Versendung
- **File-basierte Datenbank** - JSON-Storage für einfache Wartung

## 🚀 Schnellstart

### Installation

```bash
# 1. Repository klonen
git clone <repository-url>
cd digital-hotel-meldeschein

# 2. Dependencies installieren
npm install

# 3. Umgebungsvariablen einrichten
cp .env.example .env.local
```

### .env.local Konfiguration

```bash

# SMTP Server Details Beispiel
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=testmail@gmail.com
SMTP_PASS=pass

# Hotel E-Mail Adresse (Empfänger)
HOTEL_EMAIL=mail@hotel.com
```

### Starten

```bash
npm run dev
```

→ Website verfügbar unter: http://localhost:3000

## � Benutzer-Workflow

1. **Startseite** - Sprachauswahl (DE/EN) → "Meldeschein ausfüllen" klicken
2. **Formular** - Hauptgast-Daten → Mitreisende hinzufügen/entfernen → Digitale Unterschrift
3. **Validierung** - Alle Pflichtfelder + Unterschrift + Datenschutz-Checkbox
4. **Absenden** - PDF wird automatisch an `process.env.HOTEL_EMAIL` gesendet
5. **Erfolgsseite** - Bestätigung mit "Zur Startseite" Button

## 🔒 Sicherheit & DSGVO

- ✅ **Pflichtfeld-Validierung** - Alle Daten inkl. Unterschrift geprüft
- ✅ **Datenschutz-Link** - https://www.hhhof.de/privacy
- ✅ **Datenminimierung** - Nur erforderliche Daten für Meldepflicht
- ✅ **Sichere Übertragung** - Validierung mit Zod
- ✅ **Serverless-kompatibel** - Funktioniert auf Vercel ohne Dateisystem

## 📧 E-Mail System

- **Empfänger:** `process.env.HOTEL_EMAIL`
- **Absender:** Konfiguriert über SMTP_USER
- **Anhang:** PDF-Meldeschein (optimiert für 1 Seite A4)
- **Format:** Professionelle HTML-E-Mail

---
