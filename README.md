# 🏨 Digital Hotel Meldeschein - Hotel Harburger Hof# 🏨 Digital Hotel Meldeschein



Ein digitales Meldeschein-System für das Hotel Harburger Hof in Hamburg. Das System ermöglicht es Gästen, ihre Meldedaten online auszufüllen und automatisch per E-Mail an das Hotel zu senden.Eine moderne, DSGVO-konforme Lösung für digitale Meldescheine in Hotels. Ermöglicht es Hotels, Gäste-Registrierungen vollständig digital zu verwalten mit automatischer PDF-Generierung und E-Mail-Versand.



## 🚀 Funktionen## 🌟 Features



### ✅ **Produktive Funktionen (AKTIV)**### ✅ Vollständig implementiert (Grundstruktur)

- **Next.js 15** mit TypeScript und Tailwind CSS

#### **🏠 Hauptfunktionen:**- **Prisma ORM** mit PostgreSQL-Datenbankmodell

- **Tablet-optimierte Startseite** - Benutzerfreundliche Eingangseite- **Zod Validation** für sichere Datenvalidierung

- **Digitales Anmeldeformular** - Gästearegisrierung mit Mitreisenden- **API-Routes** für Hotels und Submissions

- **PDF-Generierung** - Automatische Erstellung optimierter Meldeschein-PDFs- **Responsive Dashboard** für Hotelinhaber

- **E-Mail-Versendung** - SMTP-basierter Versand an Hotel- **Dynamisches Gäste-Formular** mit konfigurierbaren Feldern

- **Digitale Unterschrift** - Canvas-basierte Signatur-Funktion- **Digitale Signatur** mit HTML5 Canvas

- **Datenschutz-Compliance** - Checkbox mit Link zur Datenschutzerklärung- **GitHub Actions** CI/CD Pipeline



#### **🔧 Technische Features:**### 🚧 In Entwicklung

- **Next.js 14** - React-Framework mit TypeScript- NextAuth.js Authentication

- **Responsive Design** - Optimiert für Tablets und Mobilgeräte  - PDF-Generierung mit pdfkit

- **SMTP Integration** - Echte E-Mail-Versendung über Gmail- E-Mail-Versand mit nodemailer

- **PDF Engine** - Puppeteer für professionelle PDF-Erstellung- File-Upload für Hotel-Logos

- **File-basierte Datenbank** - JSON-Storage für einfache Wartung- GDPR-Features (automatische Datenlöschung)



## 📁 **Projekt-Struktur (FINAL)**## 🚀 Schnellstart



```### Voraussetzungen

digital-hotel-meldeschein/- Node.js >= 20.9.0

├── 📄 README.md                    # Diese Dokumentation- PostgreSQL Datenbank

├── 📄 package.json                 # Dependencies & Scripts- npm oder yarn

├── 📄 .env.local                   # SMTP & E-Mail Konfiguration

├── 📄 next.config.js              # Next.js Konfiguration### Installation

├── 📄 tailwind.config.js          # CSS Framework

├── 📄 tsconfig.json               # TypeScript Einstellungen1. **Repository klonen**

│   ```bash

├── 📁 src/app/                     # Next.js App Router   git clone <repository-url>

│   ├── 📄 page.tsx                # ✅ Startseite (Tablet-optimiert)   cd digital-hotel-meldeschein

│   ├── 📄 layout.tsx              # ✅ Layout-Komponente   ```

│   ├── 📄 globals.css             # ✅ Tailwind CSS

│   ├── 📄 favicon.ico             # ✅ Website Icon2. **Dependencies installieren**

│   │   ```bash

│   ├── 📁 form/[slug]/            # Dynamisches Formular   npm install

│   │   └── 📄 page.tsx            # ✅ Hauptformular + Datenschutz-Checkbox   ```

│   │

│   └── 📁 api/                    # Backend API Routes3. **Umgebungsvariablen einrichten**

│       ├── 📁 hotels/[slug]/         ```bash

│       │   └── 📄 route.ts        # ✅ Hotel-Konfiguration   cp .env.example .env

│       └── 📁 submissions/   ```

│           ├── 📄 route.ts        # ✅ Formular-Einreichung

│           └── 📁 [id]/pdf/   Dann bearbeiten Sie die `.env` Datei:

│               └── 📄 route.ts    # ✅ PDF-Generierung (optimiert)   ```bash

│   # Datenbank

├── 📁 src/lib/                    # Utility Functions   DATABASE_URL="postgresql://user:password@localhost:5432/hotel_meldeschein"

│   ├── 📄 email-simple.ts         # ✅ SMTP E-Mail Versendung   

│   └── 📄 data.ts                # ✅ Hotel-Datenabfrage   # NextAuth

│   NEXTAUTH_SECRET="your-secret-key"

├── 📁 data/                       # File-basierte Datenbank   NEXTAUTH_URL="http://localhost:3000"

│   ├── 📄 hotels.json             # ✅ Hotel-Konfiguration   

│   └── 📄 submissions.json        # ✅ Meldeschein-Daten (leer für Produktion)   # E-Mail (SMTP)

│   SMTP_HOST="smtp.gmail.com"

└── 📁 public/                     # Statische Assets   SMTP_PORT="587"

    ├── 📄 logo.png                # ✅ Hotel Logo   SMTP_USER="your-email@gmail.com"

    └── 📄 logo.svg                # ✅ Alternative Logo   SMTP_PASS="your-app-password"

```   ```



## 🔧 **Setup & Konfiguration**4. **Datenbank einrichten**

   ```bash

### **1. Dependencies installieren:**   npx prisma migrate dev

```bash   npx prisma generate

npm install   ```

```

5. **Entwicklungsserver starten**

### **2. E-Mail Konfiguration (.env.local):**   ```bash

```bash   npm run dev

# SMTP Server Details   ```

SMTP_HOST=smtp.gmail.com

SMTP_PORT=4656. **Anwendung öffnen**

SMTP_USER=hotelharburgerhof@gmail.com   ```

SMTP_PASS=lcqz raar llpk gpym   http://localhost:3000

   ```

# Hotel E-Mail Adresse (Empfänger)

HOTEL_EMAIL=Osman.sabani@gmx.de## 📁 Projektstruktur

```

```

### **3. Projekt starten:**src/

```bash├── app/                    # Next.js 13+ App Router

npm run dev│   ├── api/               # API Routes

```│   │   ├── auth/          # Authentication endpoints

→ Website verfügbar unter: http://localhost:3000│   │   ├── hotels/        # Hotel management

│   │   └── submissions/   # Guest submissions

## 📧 **E-Mail Funktionalität**│   ├── dashboard/         # Hotel owner dashboard

│   ├── form/[slug]/      # Dynamic guest forms

- **Empfänger:** Osman.sabani@gmx.de│   └── auth/             # Authentication pages

- **Absender:** hotelharburgerhof@gmail.com├── components/            # React Components

- **Anhang:** PDF-Meldeschein (optimiert für 1 Seite)│   └── ui/               # Reusable UI components

- **Format:** Professionelle HTML-E-Mail + Plain-Text Fallback├── lib/                   # Utility libraries

│   ├── prisma.ts         # Database client

## 🔒 **Datenschutz & Compliance**│   └── validations.ts    # Zod schemas

└── types/                # TypeScript definitions

- **Pflicht-Checkbox:** Benutzer müssen Datenschutzerklärung akzeptieren

- **Datenschutz-Link:** https://www.hhhof.de/privacyprisma/

- **Rechtlicher Hinweis:** Datenverarbeitung nur für Meldepflicht├── schema.prisma         # Database schema

- **Datenminimierung:** Nur erforderliche Daten werden gespeichert└── migrations/           # Database migrations



## 🚀 **Deployment**.github/

└── workflows/

### **Für Produktion bereit:**    └── ci-cd.yml         # GitHub Actions workflow

1. Alle Test-Funktionen entfernt```

2. E-Mail-Konfiguration produktiv

3. PDF-Generierung optimiert## 📊 Datenmodell

4. Datenschutz-Compliance implementiert

5. Responsive Design für Tablets### Core Entities



### **Git Commit vorbereiten:****User** (Hotel Owner)

```bash- id, name, email, password

git add .- Relationship: 1:1 mit Hotel

git commit -m "✅ FINAL: Production-ready Hotel Meldeschein System

**Hotel** (Hotel Configuration)

Features:- name, email, address, phone

- ✅ Tablet-optimierte UI - logoUrl, themeColor, legalText

- ✅ E-Mail: Osman.sabani@gmx.de- fieldsConfig (JSON) - dynamische Feldkonfiguration

- ✅ Datenschutz-Checkbox mit Link- slug (URL-friendly identifier)

- ✅ PDF-Generierung optimiert

- ✅ Test-Funktionen entfernt**Submission** (Guest Registration)

- ✅ Production-ready"- Guest information (firstName, lastName, email, etc.)

```- Stay details (checkIn, checkOut, roomNumber)

- Digital signature (Base64 encoded)

## 📱 **Benutzer-Workflow**- PDF metadata (generated, sent status)



1. **Startseite:** Gast öffnet Tablet → Klick "Meldeschein ausfüllen"## 🔧 Konfiguration

2. **Formular:** Ausfüllen der Daten → Mitreisende hinzufügen → Unterschrift

3. **Datenschutz:** Pflicht-Checkbox akzeptierenHotels können ihre Formulare vollständig anpassen und konfigurieren, welche Felder sichtbar und pflicht sind.

4. **Absenden:** Formular übermitteln

5. **E-Mail:** PDF wird automatisch an Osman.sabani@gmx.de gesendet## 🔐 Sicherheit & DSGVO

6. **Abschluss:** Erfolgsseite mit "Zur Startseite" Button

- HTTPS Enforcement

---- Input Validation mit Zod

- Password Hashing mit bcrypt

**🏨 Hotel Harburger Hof - Digitaler Meldeschein**  - DSGVO-konforme Datenverarbeitung

*Schloßmühlendamm 16, 21073 Hamburg*  - Automatische Datenlöschung (geplant)

*Tel: +49(0)40 - 32 31 07 - 0*
## 🛣️ Status

Grundstruktur implementiert - bereit für Weiterentwicklung mit Node.js 20+

---

**Made with ❤️ for the hospitality industry**
