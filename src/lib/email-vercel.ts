import nodemailer from 'nodemailer';
import { generatePDF } from './pdf-builder';

// SMTP Verbindung testen
export async function testSMTPConnection() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.hotel-harburger-hof.de',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || 'meldeschein@hotel-harburger-hof.de',
        pass: process.env.SMTP_PASS || 'ihr-smtp-passwort',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verbindung testen
    await transporter.verify();

    return { success: true, message: 'SMTP Server ist erreichbar' };
  } catch (error) {
    console.error('❌ SMTP Verbindung fehlgeschlagen:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter SMTP Fehler',
    };
  }
}

// Vercel-kompatible E-Mail Versendung für Meldescheine
export async function sendHotelEmail(submission: any) {
  try {
    // E-Mail Nachricht
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

    // Vercel-kompatible PDF-Generierung
    let pdfBuffer: Buffer | null = null;

    try {
      console.log('📄 Starte React-PDF Generierung (browserlos)...');
      pdfBuffer = await generatePDF(submission);

      if (pdfBuffer) {
        console.log(
          '✅ PDF erfolgreich generiert (' +
            Math.round(pdfBuffer.length / 1024) +
            ' KB)'
        );
      } else {
        console.log(
          '⚠️ PDF-Generierung fehlgeschlagen, verwende HTML-Fallback'
        );
      }
    } catch (pdfError) {
      console.error('❌ PDF-Generierung fehlgeschlagen:', pdfError);
      pdfBuffer = null;
    }

    // SMTP Transporter erstellen
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.hotel-harburger-hof.de',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || 'meldeschein@hotel-harburger-hof.de',
        pass: process.env.SMTP_PASS || 'ihr-smtp-passwort',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // E-Mail Optionen - immer mit professionellem HTML-Template
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
          
          <p>${pdfBuffer ? 'im Anhang finden Sie den digitalen Meldeschein für:' : 'anbei die Daten des digitalen Meldescheins für:'}</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Gast:</strong> ${submission.firstName} ${submission.lastName}<br>
            <strong>Check-in:</strong> ${submission.checkIn}<br>
            <strong>Check-out:</strong> ${submission.checkOut}<br>
            <strong>Anzahl Gäste:</strong> ${submission.numberOfGuests}<br>
            <strong>Zweck des Aufenthalts:</strong> ${submission.purpose === 'business' ? 'Geschäftsreisen' : submission.purpose === 'private' ? 'Privat' : submission.purpose || '-'}
          </div>
          
          ${
            submission.coTravellers && submission.coTravellers.length > 0
              ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #2563eb; margin-bottom: 10px;">👥 Mitreisende (${submission.coTravellers.length})</h3>
            ${submission.coTravellers
              .map(
                (traveller: any, index: number) => `
              <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px;">
                <strong>Mitreisende/r #${index + 1}</strong><br>
                <strong>Name:</strong> ${traveller.firstName} ${traveller.lastName}<br>
                <strong>Geburtsdatum:</strong> ${traveller.dateOfBirth}<br>
                <strong>Staatsangehörigkeit:</strong> ${traveller.nationality}
              </div>
            `
              )
              .join('')}
          </div>
          `
              : ''
          }
          
          ${
            submission.signature
              ? `
          <div style="margin: 20px 0; text-align: center;">
            <h3 style="color: #2563eb;">✍️ Digitale Unterschrift</h3>
            <img src="${submission.signature}" alt="Digitale Unterschrift" style="max-width: 250px; border: 1px solid #ddd;" />
          </div>
          `
              : ''
          }
          
          <p>${pdfBuffer ? 'Das PDF-Dokument enthält alle erforderlichen Angaben gemäß Meldegesetz.' : 'Alle erforderlichen Angaben gemäß Meldegesetz sind oben aufgeführt.'}</p>
          
          <p style="margin-top: 30px;">
            Mit freundlichen Grüßen<br>
            <strong>Digitales Meldeschein-System</strong><br>
            Hotel Harburger Hof
          </p>
          
          <div style="border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 15px; color: #64748b; font-size: 12px;">
            Diese E-Mail wurde automatisch generiert am ${new Date().toLocaleString('de-DE')}<br>
            ${pdfBuffer ? 'Mit PDF-Anhang' : 'PDF-Generierung auf Vercel nicht verfügbar - alle Daten sind in dieser E-Mail enthalten'}
          </div>
        </div>
      `,
    };

    // PDF als Anhang hinzufügen, falls vorhanden
    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Meldeschein_${submission.firstName}_${submission.lastName}_${submission.id.split('_')[1] || 'new'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ];
      console.log('📎 PDF-Anhang hinzugefügt');
    } else {
      console.log('📧 Verwende HTML-only E-Mail (kein PDF-Anhang)');
    }

    // E-Mail versenden
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ E-MAIL ERFOLGREICH GESENDET:', result.messageId);

    return {
      success: true,
      message: pdfBuffer
        ? 'E-Mail mit PDF-Anhang erfolgreich versendet'
        : 'E-Mail erfolgreich versendet (HTML-Format, kein PDF aufgrund von Vercel-Beschränkungen)',
      recipient: mailOptions.to,
      messageId: result.messageId,
      pdfAttached: !!pdfBuffer,
      pdfSize: pdfBuffer ? Math.round(pdfBuffer.length / 1024) + ' KB' : null,
    };
  } catch (error) {
    console.error('🚨 E-MAIL VERSAND FEHLGESCHLAGEN:', error);
    return {
      success: false,
      error:
        'E-Mail konnte nicht versendet werden: ' +
        (error instanceof Error ? error.message : 'Unbekannter Fehler'),
    };
  }
}
