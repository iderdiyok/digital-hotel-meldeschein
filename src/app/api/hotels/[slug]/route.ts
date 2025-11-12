import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

const DATA_FILE = path.join(process.cwd(), 'data', 'hotels.json');

async function readHotels() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export async function GET(request: NextRequest, context: Props) {
  try {
    // In newer Next versions context.params may be a Promise
    const paramsObj = (context.params instanceof Promise) ? await context.params : context.params;
    const { slug } = paramsObj;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Hotel-Slug ist erforderlich' }, { status: 400 });
    }

    const hotels = await readHotels();
  const hotel = hotels.find((h: { slug?: string; id?: string }) => h.slug === slug || h.id === slug);
    if (!hotel) {
      return NextResponse.json({ success: false, error: 'Hotel nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: hotel });
  } catch (error) {
    console.error('Error fetching hotel by slug:', error);
    return NextResponse.json({ success: false, error: 'Fehler beim Laden der Hoteldaten' }, { status: 500 });
  }
}