/**
 * Formatiert ein Datum automatisch mit Punkten: TT.MM.JJJJ
 * @param value - Der eingegebene Wert
 * @returns Formatierter Datumswert
 */
export function formatDateInput(value: string): string {
  // Entferne alle nicht-numerischen Zeichen außer Punkten
  const numbersOnly = value.replace(/[^\d]/g, '');
  
  // Begrenze auf maximal 8 Ziffern (TTMMJJJJ)
  const limitedNumbers = numbersOnly.substring(0, 8);
  
  // Formatiere automatisch mit Punkten
  let formatted = '';
  
  if (limitedNumbers.length >= 1) {
    formatted += limitedNumbers.substring(0, 2); // Tag
    if (limitedNumbers.length >= 3) {
      formatted += '.' + limitedNumbers.substring(2, 4); // Monat
      if (limitedNumbers.length >= 5) {
        formatted += '.' + limitedNumbers.substring(4, 8); // Jahr
      }
    }
  }
  
  return formatted;
}

/**
 * Validiert ein formatiertes Datum (TT.MM.JJJJ)
 * @param dateString - Das zu validierende Datum als String
 * @returns true wenn gültig, false wenn ungültig
 */
export function validateDateString(dateString: string): boolean {
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

/**
 * Behandelt Tastatureingaben für Datumsfelder
 * @param event - KeyboardEvent
 * @param currentValue - Aktueller Wert des Feldes
 * @returns Neuer formatierter Wert oder null wenn keine Änderung
 */
export function handleDateKeyPress(event: React.KeyboardEvent<HTMLInputElement>, currentValue: string): string | null {
  const { key } = event;
  
  // Erlaube Backspace, Delete, Tab, Escape, Enter
  if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(key)) {
    return null; // Keine Formatierung nötig
  }
  
  // Erlaube nur Ziffern
  if (!/^\d$/.test(key)) {
    event.preventDefault();
    return null;
  }
  
  // Verhindere Eingabe wenn bereits 10 Zeichen (TT.MM.JJJJ)
  if (currentValue.length >= 10) {
    event.preventDefault();
    return null;
  }
  
  return null; // Lasse normale Eingabe zu, Formatierung erfolgt in onChange
}