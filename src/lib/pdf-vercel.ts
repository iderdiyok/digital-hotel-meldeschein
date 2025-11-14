import puppeteer from 'puppeteer';

// Helper function to translate purpose values
const translatePurpose = (purpose: string) => {
  const purposeTranslations: { [key: string]: string } = {
    'business': 'Geschäftsreisen',
    'private': 'Privat'
  };
  return purposeTranslations[purpose] || purpose;
};

// Vercel-kompatible PDF-Generierung mit Fallback
export async function generateVercelPDF(submission: any): Promise<Buffer | null> {
  try {
    console.log('🔄 Starte Vercel-kompatible PDF-Generierung...');
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meldeschein - ${submission.firstName} ${submission.lastName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.4;
            color: #333;
            font-size: 14px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .hotel-name {
            font-size: 22px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 8px;
        }
        .header div {
            font-size: 12px;
            margin-bottom: 3px;
        }
        .header h2 {
            font-size: 20px;
            margin: 10px 0 0 0;
        }
        .section {
            margin-bottom: 16px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #e5e5e5;
        }
        .field {
            margin-bottom: 6px;
        }
        .field-label {
            font-weight: bold;
            color: #555;
            font-size: 12px;
        }
        .field-value {
            margin-top: 2px;
            color: #333;
            font-size: 14px;
        }
        .signature {
            text-align: center;
            margin: 12px 0 8px 0;
        }
        .signature img {
            border: 1px solid #ddd;
            max-width: 250px;
            max-height: 80px;
            height: auto;
        }
        .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 8px;
            border-top: 1px solid #e5e5e5;
            font-size: 10px;
            color: #666;
        }
        .footer p {
            margin: 2px 0;
        }
        .traveller-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 3px;
            padding: 10px;
            margin: 6px 0;
        }
        .traveller-title {
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 6px;
            font-size: 14px;
        }
        .compact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 8px 12px;
        }
        .traveller-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 8px 12px;
        }
        @media print {
            body { 
                margin: 0; 
                padding: 15px;
                font-size: 13px;
            }
            .header { 
                page-break-after: avoid;
                margin-bottom: 15px;
            }
            .section {
                page-break-inside: avoid;
                margin-bottom: 12px;
            }
            .traveller-card {
                page-break-inside: avoid;
                margin: 4px 0;
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="hotel-name">Hotel Harburger Hof</div>
        <div>Schloßmühlendamm 16, 21073 Hamburg</div>
        <div>Tel: +49(0)40 - 32 31 07 - 0 | Email: info@hhhof.de</div>
        <h2>Digitaler Meldeschein</h2>
    </div>

    <div class="section">
        <div class="section-title">📋 Hauptreisende/r</div>
        <div class="compact-grid">
            <div class="field">
                <div class="field-label">Vorname:</div>
                <div class="field-value">${submission.firstName || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Nachname:</div>
                <div class="field-value">${submission.lastName || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Geburtsdatum:</div>
                <div class="field-value">${submission.dateOfBirth || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Staatsangehörigkeit:</div>
                <div class="field-value">${submission.nationality || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Adresse:</div>
                <div class="field-value">${submission.address || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Check-in:</div>
                <div class="field-value">${submission.checkIn || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Check-out:</div>
                <div class="field-value">${submission.checkOut || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Anzahl Gäste:</div>
                <div class="field-value">${submission.numberOfGuests || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Zweck des Aufenthalts:</div>
                <div class="field-value">${translatePurpose(submission.purpose) || '-'}</div>
            </div>
        </div>
    </div>

    ${submission.coTravellers && submission.coTravellers.length > 0 ? `
    <div class="section">
        <div class="section-title">👥 Mitreisende (${submission.coTravellers.length})</div>
        ${submission.coTravellers.map((traveller: any, index: number) => `
                <div class="traveller-card">
            <div class="traveller-title">Mitreisende/r #${index + 1}</div>
            <div class="traveller-grid">
                <div class="field">
                    <div class="field-label">Vorname:</div>
                    <div class="field-value">${traveller.firstName || '-'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Nachname:</div>
                    <div class="field-value">${traveller.lastName || '-'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Geburtsdatum:</div>
                    <div class="field-value">${traveller.dateOfBirth || '-'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Staatsangehörigkeit:</div>
                    <div class="field-value">${traveller.nationality || '-'}</div>
                </div>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section signature">
        <div class="section-title">✍️ Digitale Unterschrift</div>
        ${submission.signature ? `<img src="${submission.signature}" alt="Digitale Unterschrift" />` : '<p>Keine Unterschrift verfügbar</p>'}
    </div>

    <div class="footer">
        <p>Erstellt am: ${new Date(submission.submittedAt).toLocaleString('de-DE')}</p>
        <p>Submission ID: ${submission.id}</p>
        <p>Hotel Harburger Hof - Digitaler Meldeschein</p>
    </div>
</body>
</html>`;

    // Vercel-kompatible Puppeteer-Konfiguration
    let browser;
    
    try {
      // Vercel-spezifische Browser-Konfiguration
      const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
      
      const browserConfig = isVercel ? {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--single-process'
        ],
        timeout: 25000,
        // Vercel verwendet eine andere Chrome-Binary
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
      } : {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        timeout: 30000,
      };
      
      browser = await puppeteer.launch(browserConfig);
      console.log(`✅ Browser erfolgreich gestartet (${isVercel ? 'Vercel' : 'Local'})`);
      
      const page = await browser.newPage();
      
      // Optimierte Page-Einstellungen für Vercel
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: isVercel ? 20000 : 30000
      });
      
      console.log('✅ HTML-Content geladen');
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15px',
          right: '15px',
          bottom: '15px',
          left: '15px'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        timeout: isVercel ? 15000 : 30000
      });
      
      console.log('✅ PDF erfolgreich generiert');
      
      await browser.close();
      return Buffer.from(pdfBuffer);
      
    } catch (puppeteerError) {
      console.error('❌ Puppeteer Fehler:', puppeteerError);
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('❌ Browser schließen fehlgeschlagen:', closeError);
        }
      }
      return null;
    }
    
  } catch (error) {
    console.error('❌ Allgemeiner PDF-Generierungsfehler:', error);
    return null;
  }
}

// Fallback: Einfache HTML-Email-Version falls PDF fehlschlägt
export function generateFallbackHTML(submission: any): string {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
    Hotel Harburger Hof - Digitaler Meldeschein
  </h2>
  
  <h3>📋 Hauptreisende/r</h3>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr><td style="padding: 5px; font-weight: bold;">Vorname:</td><td style="padding: 5px;">${submission.firstName || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Nachname:</td><td style="padding: 5px;">${submission.lastName || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Geburtsdatum:</td><td style="padding: 5px;">${submission.dateOfBirth || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Staatsangehörigkeit:</td><td style="padding: 5px;">${submission.nationality || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Adresse:</td><td style="padding: 5px;">${submission.address || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Check-in:</td><td style="padding: 5px;">${submission.checkIn || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Check-out:</td><td style="padding: 5px;">${submission.checkOut || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Anzahl Gäste:</td><td style="padding: 5px;">${submission.numberOfGuests || '-'}</td></tr>
    <tr><td style="padding: 5px; font-weight: bold;">Zweck:</td><td style="padding: 5px;">${translatePurpose(submission.purpose) || '-'}</td></tr>
  </table>

  ${submission.coTravellers && submission.coTravellers.length > 0 ? `
  <h3>👥 Mitreisende (${submission.coTravellers.length})</h3>
  ${submission.coTravellers.map((traveller: any, index: number) => `
    <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px;">
      <h4>Mitreisende/r #${index + 1}</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 3px; font-weight: bold;">Vorname:</td><td style="padding: 3px;">${traveller.firstName || '-'}</td></tr>
        <tr><td style="padding: 3px; font-weight: bold;">Nachname:</td><td style="padding: 3px;">${traveller.lastName || '-'}</td></tr>
        <tr><td style="padding: 3px; font-weight: bold;">Geburtsdatum:</td><td style="padding: 3px;">${traveller.dateOfBirth || '-'}</td></tr>
        <tr><td style="padding: 3px; font-weight: bold;">Staatsangehörigkeit:</td><td style="padding: 3px;">${traveller.nationality || '-'}</td></tr>
      </table>
    </div>
  `).join('')}
  ` : ''}

  ${submission.signature ? `
  <h3>✍️ Digitale Unterschrift</h3>
  <img src="${submission.signature}" alt="Digitale Unterschrift" style="max-width: 250px; border: 1px solid #ddd;" />
  ` : ''}

  <div style="border-top: 1px solid #e5e5e5; margin-top: 20px; padding-top: 15px; color: #666; font-size: 12px; text-align: center;">
    <p>Erstellt am: ${new Date(submission.submittedAt).toLocaleString('de-DE')}</p>
    <p>Submission ID: ${submission.id}</p>
    <p>Hotel Harburger Hof - Digitaler Meldeschein</p>
  </div>
</div>
`;
}