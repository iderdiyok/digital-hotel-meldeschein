import { z } from 'zod';

// Hilfsfunktion für Datumsvalidierung
function isValidDateString(dateString: string): boolean {
  // Prüfe Format TT.MM.JJJJ
  const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = dateString.match(dateRegex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Grundlegende Validierung
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > new Date().getFullYear() + 100) return false;
  
  // Erstelle ein Date-Objekt zur weiteren Validierung
  const date = new Date(year, month - 1, day);
  
  // Prüfe ob das Datum tatsächlich existiert (z.B. 31.02. wäre ungültig)
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
}

// Custom Zod validator für Datum
const dateStringValidator = z.string().min(10, "Datum muss vollständig sein (TT.MM.JJJJ)").refine(isValidDateString, {
  message: "Ungültiges Datum - bitte Format TT.MM.JJJJ verwenden",
});

// Zod schema für Hotel-Konfiguration (used in /api/hotels/route.ts)
export const hotelConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  logoUrl: z.string().optional(),
  logoSelectable: z.boolean().optional(),
  themeColor: z.string().optional(),
  legalText: z.string().optional(),
  slug: z.string().min(1),
  fieldsConfig: z.record(
    z.object({
      required: z.boolean().optional(),
      visible: z.boolean().optional(),
    })
  ).optional(),
  isActive: z.boolean().optional(),
});

// Zod schema für Guest Submission (used in /api/submissions/route.ts)
export const guestSubmissionSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: dateStringValidator,
  nationality: z.string().min(1),
  address: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  numberOfGuests: z.number().int().min(1),
  purpose: z.string().optional(),
  coTravellers: z.array(
    z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      dateOfBirth: dateStringValidator,
      nationality: z.string().min(1),
    })
  ).optional(),
  signature: z.string().nullable().optional(),
  hotelId: z.string().optional(),
});
