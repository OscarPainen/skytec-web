/** Validación y saneamiento de inputs (defensa contra datos basura/XSS). */

/** Nombre: letras (incl. acentos/ñ), espacios y . ' - ; 3 a 80 caracteres. */
const NAME_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]{1,78}[A-Za-zÁÉÍÓÚÜÑáéíóúüñ.]$/;

export function isValidName(name: string): boolean {
  const v = name.trim();
  return v.length >= 3 && v.length <= 80 && NAME_RE.test(v);
}

/** Email de formato razonable (no exhaustivo; el servidor no re-valida). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isValidModelo(modelo: string): boolean {
  return modelo.trim().length >= 2;
}

/**
 * Teléfono internacional (no se fuerza +56: también vienen clientes de otros
 * países). Válido si tiene entre 8 y 15 dígitos (rango E.164). Acepta + al
 * inicio y separadores comunes.
 */
export function isValidPhone(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

/** Deja solo caracteres de teléfono razonables (dígitos, +, espacio, - y ()). */
export function sanitizePhone(input: string): string {
  return input.replace(/[^\d+\s()-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
}

/** Fecha "YYYY-MM-DD" estrictamente futura (mínimo mañana, hora local). */
export function isFutureDate(isoDate: string): boolean {
  if (!isoDate) return false;
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return false;
  const picked = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return picked.getTime() > today.getTime();
}

/** "YYYY-MM-DD" de mañana, para el atributo min del date input. */
export function tomorrowISO(): string {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  const mm = String(t.getMonth() + 1).padStart(2, '0');
  const dd = String(t.getDate()).padStart(2, '0');
  return `${t.getFullYear()}-${mm}-${dd}`;
}

/** Colapsa espacios y recorta. React ya escapa al renderizar (sin sink XSS). */
export function sanitizeText(value: string, maxLen = 200): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLen);
}
