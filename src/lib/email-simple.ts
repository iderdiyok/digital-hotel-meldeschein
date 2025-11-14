import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';

// Helper function to translate purpose values
const translatePurpose = (purpose: string) => {
  const purposeTranslations: { [key: string]: string } = {
    'business': 'Geschäftsreisen',
    'private': 'Privat'
  };
  return purposeTranslations[purpose] || purpose;
};

// Generate PDF directly from submission data
async function generatePDF(submission: any): Promise<Buffer> {
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

  // Generate PDF with Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  
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
    preferCSSPageSize: true
  });
  
  await browser.close();
  return Buffer.from(pdfBuffer);
}

// SMTP Verbindung testen
export async function testSMTPConnection() {
  try {    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.hotel-harburger-hof.de',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || 'meldeschein@hotel-harburger-hof.de',
        pass: process.env.SMTP_PASS || 'ihr-smtp-passwort'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verbindung testen
    await transporter.verify();
    
    return { success: true, message: 'SMTP Server ist erreichbar' };
    
  } catch (error) {
    console.error('❌ SMTP Verbindung fehlgeschlagen:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unbekannter SMTP Fehler' 
    };
  }
}

// Einfache E-Mail Versendung für Meldescheine mit PDF-Generierung
export async function sendHotelEmail(submission: any) {
  try {
    
    // Kurze, professionelle E-Mail Nachricht
    const emailSubject = `Neuer Meldeschein - ${submission.firstName} ${submission.lastName}`;
    const emailText = `Sehr geehrte Damen und Herren,

im Anhang finden Sie den digitalen Meldeschein für:

Gast: ${submission.firstName} ${submission.lastName}
Check-in: ${submission.checkIn}
Check-out: ${submission.checkOut}
Anzahl Gäste: ${submission.numberOfGuests}

Das PDF-Dokument enthält alle erforderlichen Angaben gemäß Meldegesetz.

Mit freundlichen Grüßen,
Digitales Meldeschein-System
Hotel Harburger Hof`;

    
    // PDF direkt aus Submission-Daten generieren
    let pdfBuffer: Buffer | null = null;
    
    try {
      console.log('📄 Generiere PDF für E-Mail...');
      pdfBuffer = await generatePDF(submission);
      console.log('✅ PDF erfolgreich generiert');
    } catch (pdfError) {
      console.error('❌ PDF-Generierung fehlgeschlagen:', pdfError);
    }
    
    // SMTP Transporter erstellen (Hotel SMTP Server)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.hotel-harburger-hof.de',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true für 465, false für andere Ports
      auth: {
        user: process.env.SMTP_USER || 'meldeschein@hotel-harburger-hof.de',
        pass: process.env.SMTP_PASS || 'ihr-smtp-passwort'
      },
      tls: {
        rejectUnauthorized: false // Für Self-signed Zertifikate
      }
    });

    // E-Mail Optionen mit PDF Anhang
    const mailOptions: any = {
      from: `"Hotel Harburger Hof" <${process.env.SMTP_USER || 'meldeschein@hotel-harburger-hof.de'}>`,
      to: process.env.HOTEL_EMAIL,
      cc: process.env.HOTEL_EMAIL || 'info@hhhof.de',
      subject: emailSubject,
      text: emailText,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Hotel Harburger Hof - Digitaler Meldeschein
          </h2>
          
          <p>Sehr geehrte Damen und Herren,</p>
          
          <p>im Anhang finden Sie den digitalen Meldeschein für:</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Gast:</strong> ${submission.firstName} ${submission.lastName}<br>
            <strong>Check-in:</strong> ${submission.checkIn}<br>
            <strong>Check-out:</strong> ${submission.checkOut}<br>
            <strong>Anzahl Gäste:</strong> ${submission.numberOfGuests}
          </div>
          
          <p>Das PDF-Dokument enthält alle erforderlichen Angaben gemäß Meldegesetz.</p>
          
          <p style="margin-top: 30px;">
            Mit freundlichen Grüßen<br>
            <strong>Digitales Meldeschein-System</strong><br>
            Hotel Harburger Hof
          </p>
          
          <div style="border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 15px; color: #64748b; font-size: 12px;">
            Diese E-Mail wurde automatisch generiert am ${new Date().toLocaleString('de-DE')}
          </div>
        </div>
      `
    };
    
    // PDF als Anhang hinzufügen, falls erfolgreich geladen
    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Meldeschein_${submission.firstName}_${submission.lastName}_${submission.id.split('_')[1]}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ];

    }

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ E-MAIL ERFOLGREICH GESENDET:", result);
    
    return {
      success: true,
      message: "E-Mail mit PDF-Anhang erfolgreich versendet",
      recipient: mailOptions.to,
      messageId: result.messageId,
      pdfAttached: !!pdfBuffer
    };
    
  } catch (error) {
    console.error("🚨 E-MAIL VERSAND FEHLGESCHLAGEN:", error);
    return {
      success: false,
      error: "E-Mail konnte nicht versendet werden: " + (error instanceof Error ? error.message : 'Unbekannter Fehler')
    };
  }
}