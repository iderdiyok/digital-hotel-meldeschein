import nodemailer from 'nodemailer';
import { generateVercelPDF, generateFallbackHTML } from './pdf-vercel';

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
      console.log('📄 Starte Vercel-kompatible PDF-Generierung...');
      pdfBuffer = await generateVercelPDF(submission);
      
      if (pdfBuffer) {
        console.log('✅ PDF erfolgreich generiert (' + Math.round(pdfBuffer.length / 1024) + ' KB)');
      } else {
        console.log('⚠️ PDF-Generierung fehlgeschlagen, verwende HTML-Fallback');
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
        pass: process.env.SMTP_PASS || 'ihr-smtp-passwort'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // E-Mail Optionen
    const mailOptions: any = {
      from: `"Hotel Harburger Hof" <${process.env.SMTP_USER || 'meldeschein@hotel-harburger-hof.de'}>`,
      to: process.env.HOTEL_EMAIL,
      cc: process.env.HOTEL_EMAIL || 'info@hhhof.de',
      subject: emailSubject,
      text: emailText,
      html: pdfBuffer ? `
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
      ` : generateFallbackHTML(submission)
    };
    
    // PDF als Anhang hinzufügen, falls vorhanden
    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Meldeschein_${submission.firstName}_${submission.lastName}_${submission.id.split('_')[1] || 'new'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ];
      console.log('📎 PDF-Anhang hinzugefügt');
    } else {
      console.log('📧 Verwende HTML-only E-Mail (kein PDF-Anhang)');
    }

    // E-Mail versenden
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ E-MAIL ERFOLGREICH GESENDET:", result.messageId);
    
    return {
      success: true,
      message: pdfBuffer ? 
        "E-Mail mit PDF-Anhang erfolgreich versendet" : 
        "E-Mail erfolgreich versendet (HTML-Format, kein PDF aufgrund von Vercel-Beschränkungen)",
      recipient: mailOptions.to,
      messageId: result.messageId,
      pdfAttached: !!pdfBuffer,
      pdfSize: pdfBuffer ? Math.round(pdfBuffer.length / 1024) + ' KB' : null
    };
    
  } catch (error) {
    console.error("🚨 E-MAIL VERSAND FEHLGESCHLAGEN:", error);
    return {
      success: false,
      error: "E-Mail konnte nicht versendet werden: " + (error instanceof Error ? error.message : 'Unbekannter Fehler')
    };
  }
}