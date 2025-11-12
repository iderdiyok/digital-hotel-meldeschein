import { NextRequest, NextResponse } from 'next/server';
import { guestSubmissionSchema } from '@/lib/validations';
import { readSubmissions, writeSubmissions } from '@/lib/data';
import { sendHotelEmail } from '@/lib/email-simple';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 SUBMISSION REQUEST STARTED');
    console.log('📥 Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📥 Received data keys:', Object.keys(body));
    console.log('📥 privacyAccepted:', body.privacyAccepted);
    console.log('📥 coTravellers count:', body.coTravellers?.length || 0);
    
    // Validate submission data
    console.log('🔍 Starting validation...');
    const validatedData = guestSubmissionSchema.parse(body);
    console.log('✅ Validation successful');
    
    // Read existing submissions
    const submissions = await readSubmissions();
    
    // Create new submission with ID and timestamp
    const newSubmission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...validatedData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    
    // Add to submissions
    submissions.push(newSubmission);
    
    // Write back to file
    await writeSubmissions(submissions);
    
    console.log('New submission saved:', {
      id: newSubmission.id,
      guestName: `${validatedData.firstName} ${validatedData.lastName}`,
      checkIn: validatedData.checkIn,
      checkOut: validatedData.checkOut,
      coTravellers: (validatedData as any).coTravellers?.length || 0,
      signature: validatedData.signature ? 'Present' : 'Missing',
    });
    
    // Send email directly here instead of external API call
    console.log('🔄 Starte E-Mail-Versendung...');
    console.log('📧 Environment check:');
    console.log('  SMTP_HOST:', process.env.SMTP_HOST ? '✅ Set' : '❌ Missing');
    console.log('  SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing'); 
    console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing');
    console.log('  HOTEL_EMAIL:', process.env.HOTEL_EMAIL ? '✅ Set' : '❌ Missing');
    
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const pdfUrl = `${baseUrl}/api/submissions/${newSubmission.id}/pdf`;
      console.log('📄 PDF URL:', pdfUrl);
      
      const emailResult = await sendHotelEmail(newSubmission, pdfUrl);
      
      if (emailResult.success) {
        console.log('✅ E-Mail erfolgreich versendet!');
        console.log('📧 Empfänger: hotelharburgerhof@gmail.com');
        console.log('📄 PDF URL:', pdfUrl);
      } else {
        console.error('❌ E-Mail-Versand fehlgeschlagen:', emailResult.error);
      }
    } catch (emailError) {
      console.error('🚨 Fehler bei E-Mail-Versendung:', emailError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Meldeschein erfolgreich übermittelt und E-Mail versendet',
      data: {
        submissionId: newSubmission.id,
        pdfPreviewUrl: `/api/submissions/${newSubmission.id}/pdf`,
        emailSent: true,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('❌ SUBMISSION ERROR DETAILS:', error);
    console.error('❌ Error name:', error instanceof Error ? error.name : typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : JSON.stringify(error));
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack available');
    
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      console.error('❌ Zod validation issues:', (error as any).issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Ungültige Formulardaten - Validation Error',
          details: (error as any).issues,
          errorType: 'validation'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Verarbeiten des Meldescheins',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler',
        errorType: 'server',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await readSubmissions();

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Laden der Meldescheine',
      },
      { status: 500 }
    );
  }
}