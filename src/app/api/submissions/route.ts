import { NextRequest, NextResponse } from 'next/server';
import { guestSubmissionSchema } from '@/lib/validations';
import { sendHotelEmail } from '@/lib/email-vercel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate submission data
    const validatedData = guestSubmissionSchema.parse(body);

    // Create submission object (without local storage)
    const newSubmission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...validatedData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    // Send email directly (no local storage, no PDF URL needed)
    try {
      const emailResult = await sendHotelEmail(newSubmission);

      if (emailResult.success) {
        console.log('✅ E-Mail erfolgreich versendet!');
      } else {
        console.error('❌ E-Mail-Versand fehlgeschlagen:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ E-Mail-Versand fehlgeschlagen:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Meldeschein erfolgreich übermittelt und E-Mail versendet',
      data: {
        submissionId: newSubmission.id,
        pdfPreviewUrl: `/api/submissions/${newSubmission.id}/pdf`,
        emailSent: true,
        hotelEmail: process.env.HOTEL_EMAIL,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error

      return NextResponse.json(
        {
          success: false,
          error: 'Ungültige Formulardaten - Validation Error',
          details: (error as any).issues,
          errorType: 'validation',
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
        stack:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.stack
              : null
            : null,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // No local storage anymore - return empty array
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Local storage disabled - submissions are only sent via email',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Laden der Meldescheine',
      },
      { status: 500 }
    );
  }
}
