import { NextRequest, NextResponse } from 'next/server';
import { readSubmissions } from '@/lib/data';
import puppeteer from 'puppeteer';

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(request: NextRequest, context: Props) {
  try {
    // In newer Next versions context.params may be a Promise
    const paramsObj = (context.params instanceof Promise) ? await context.params : context.params;
    const { id } = paramsObj;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Submission ID ist erforderlich' }, { status: 400 });
    }

    const submissions = await readSubmissions();
    const submission = submissions.find((s: any) => s.id === id);
    
    if (!submission) {
      return NextResponse.json({ success: false, error: 'Meldeschein nicht gefunden' }, { status: 404 });
    }

    // Helper function to translate purpose values
    const translatePurpose = (purpose: string) => {
        const purposeTranslations: { [key: string]: string } = {
            'business': 'Geschäftsreisen',
            'private': 'Privat'
        };
        return purposeTranslations[purpose] || purpose;
    };

    // Generate HTML Content for PDF
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
        .field-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 15px;
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
        /* PDF Specific Styles */
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

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Meldeschein_${submission.firstName}_${submission.lastName}.pdf"`
      },
    });
    
  } catch (error) {
    console.error('❌ Fehler bei PDF-Generierung:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Fehler bei der PDF-Generierung: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler')
    }, { status: 500 });
  }
}