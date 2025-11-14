import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { hotelConfigSchema } from '@/lib/validations';

const DATA_FILE = path.join(process.cwd(), 'data', 'hotels.json');

type HotelType = {
  id: string;
  name: string;
  email?: string;
  address?: string;
  phone?: string;
  logoUrl?: string;
  logoSelectable?: boolean;
  themeColor?: string;
  legalText?: string;
  slug: string;
  fieldsConfig?: Record<string, { required?: boolean; visible?: boolean }>;
  isActive?: boolean;
};

async function readHotels(): Promise<HotelType[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as HotelType[];
}

async function writeHotels(data: HotelType[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const hotels = await readHotels();
    return NextResponse.json({ success: true, data: hotels });
  } catch (error) {
    console.error('Error reading hotels.json:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Laden der Hoteldaten' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = hotelConfigSchema.parse(body);

    const hotels = await readHotels();
    const validatedAny = validated as Partial<HotelType> & { id?: string };
    const idx = hotels.findIndex(
      h => h.slug === validatedAny.slug || h.id === validatedAny.id
    );
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: 'Hotel nicht gefunden' },
        { status: 404 }
      );
    }

    hotels[idx] = { ...hotels[idx], ...validated };
    await writeHotels(hotels);

    return NextResponse.json({
      success: true,
      message: 'Hotel-Konfiguration erfolgreich aktualisiert',
      data: hotels[idx],
    });
  } catch (error) {
    console.error('Error updating hotels.json:', error);
    // Zod validation errors include `issues` property
    try {
      const e: any = error;
      if (e && typeof e === 'object' && 'issues' in e) {
        return NextResponse.json(
          { success: false, error: 'Ungültige Daten', details: e },
          { status: 400 }
        );
      }
    } catch (err) {
      /* fallthrough to generic error */
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Aktualisieren der Hotel-Konfiguration',
      },
      { status: 500 }
    );
  }
}
