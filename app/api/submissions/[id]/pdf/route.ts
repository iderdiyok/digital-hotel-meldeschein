import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(request: NextRequest, context: Props) {
  try {
    // In newer Next versions context.params may be a Promise
    const paramsObj =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = paramsObj;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Submission ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Since we no longer store submissions locally, return a not available response
    // In real implementation, you might want to store submissions temporarily
    // or pass data directly to email function without local file storage
    return NextResponse.json(
      {
        success: false,
        error:
          'PDF-Generierung nicht verfügbar - Submissions werden nicht mehr lokal gespeichert',
        message:
          'Submissions werden nur noch per E-Mail versendet ohne lokale Speicherung',
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('❌ Fehler bei PDF-Generierung:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          'Fehler bei der PDF-Generierung: ' +
          (error instanceof Error ? error.message : 'Unbekannter Fehler'),
      },
      { status: 500 }
    );
  }
}
