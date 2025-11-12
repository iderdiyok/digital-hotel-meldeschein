import nodemailer from 'nodemailer';

// SMTP Verbindung testen
export async function testSMTPConnection() {
  try {
    console.log('🔗 Teste SMTP Verbindung...');
    
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
    
    console.log('✅ SMTP Verbindung erfolgreich!');
    return { success: true, message: 'SMTP Server ist erreichbar' };
    
  } catch (error) {
    console.error('❌ SMTP Verbindung fehlgeschlagen:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unbekannter SMTP Fehler' 
    };
  }
}

// Einfache E-Mail Versendung für Meldescheine

export async function sendHotelEmail(submission: any, pdfUrl: string) {
  try {
    console.log('📧 === E-MAIL VERSENDUNG GESTARTET ===');
    console.log('📧 Empfänger: Osman.sabani@gmx.de');
    console.log('📧 Gast:', submission.firstName, submission.lastName);
    
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

    console.log('📧 === E-MAIL INHALT (KURZ) ===');
    console.log('Subject:', emailSubject);
    console.log('Text:', emailText);
    
    // PDF von URL laden für Anhang
    console.log('📄 Lade PDF für Anhang...');
    let pdfBuffer: Buffer | null = null;
    
    try {
      // PDF von der lokalen API Route laden
      const pdfResponse = await fetch(pdfUrl);
      if (pdfResponse.ok) {
        const arrayBuffer = await pdfResponse.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
        console.log('✅ PDF erfolgreich geladen:', pdfBuffer.length, 'bytes');
      } else {
        console.log('⚠️ PDF konnte nicht geladen werden, sende nur Link');
      }
    } catch (pdfError) {
      console.log('⚠️ PDF Download Fehler:', pdfError);
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
      to: 'Osman.sabani@gmx.de',
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
      console.log('📎 PDF als Anhang hinzugefügt');
    }

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ E-MAIL WIRKLICH VERSENDET!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📎 PDF Anhang:', pdfBuffer ? 'Ja' : 'Nur Link');
    console.log('📧 === E-MAIL VERSENDUNG ABGESCHLOSSEN ===');
    
    return {
      success: true,
      message: "E-Mail mit PDF-Anhang erfolgreich versendet",
      recipient: "Osman.sabani@gmx.de",
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