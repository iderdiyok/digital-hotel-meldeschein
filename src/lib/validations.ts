import { z } from 'zod';

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
  dateOfBirth: z.string().min(1),
  address: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  numberOfGuests: z.number().int().min(1),
  purpose: z.string().optional(),
  coTravellers: z.array(
    z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      dateOfBirth: z.string().min(1),
    })
  ).optional(),
  signature: z.string().nullable().optional(),
  hotelId: z.string().optional(),
});
