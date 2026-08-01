import { FirebaseError } from 'firebase/app';

/**
 * Mensaje amable para fallos de escritura. Nunca expone el error crudo de
 * Firebase. Distingue pérdida de conexión para guiar al usuario.
 */
export function writeErrorMessage(e: unknown): string {
  const offline = typeof navigator !== 'undefined' && !navigator.onLine;
  const networkCode =
    e instanceof FirebaseError &&
    (e.code === 'unavailable' || e.code === 'auth/network-request-failed');
  if (offline || networkCode) {
    return 'Sin conexión. Revisa tu internet e intenta nuevamente.';
  }
  return 'No pudimos enviar tu solicitud. Inténtalo de nuevo.';
}
