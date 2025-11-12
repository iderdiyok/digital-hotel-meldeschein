import { NextRequest, NextResponse } from 'next/server';
import { guestSubmissionSchema } from '@/lib/validations';
import { readSubmissions, writeSubmissions } from '@/lib/data';
import { sendHotelEmail } from '@/lib/email-simple';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate submission data
    const validatedData = guestSubmissionSchema.parse(body);
    
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
    
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const pdfUrl = `${baseUrl}/api/submissions/${newSubmission.id}/pdf`;
      
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
    console.error('Error processing submission:', error);
    
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json(
        {
          success: false,
          error: 'Ungültige Formulardaten',
          details: error,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Verarbeiten des Meldescheins',
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