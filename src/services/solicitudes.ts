import { signInAnonymously } from 'firebase/auth';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { FormValues, Solicitud } from '@/types';
import { OTRO_SERVICIO } from '@/types';
import { sanitizeText, sanitizePhone } from '@/utils/validators';

/** Auth anónima perezosa: reusa la sesión si ya existe, si no la crea. */
export async function ensureAuth(): Promise<void> {
  if (!auth.currentUser) await signInAnonymously(auth);
}

/** "YYYY-MM-DD" (fecha local del input) → Timestamp a mediodía local. */
function isoToTimestamp(iso: string): Timestamp {
  const [y, m, d] = iso.split('-').map(Number);
  // Mediodía evita que un corrimiento de zona horaria cambie el día.
  return Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0));
}

/**
 * Escribe la solicitud en Firestore con estado "nueva".
 * Sanitiza todo antes de persistir. Asegura auth anónima primero.
 */
export async function enviarSolicitud(values: FormValues): Promise<void> {
  await ensureAuth();

  const esOtro = values.tipo_servicio === OTRO_SERVICIO;

  const doc: Solicitud = {
    modelo_telefono: sanitizeText(values.modelo_telefono),
    cliente_nombre: sanitizeText(values.cliente_nombre, 80),
    cliente_email: values.cliente_email.trim().toLowerCase(),
    cliente_telefono: sanitizePhone(values.cliente_telefono),
    // Validación garantiza que no está vacío al llegar aquí.
    tipo_servicio: values.tipo_servicio as Solicitud['tipo_servicio'],
    tipo_servicio_detalle: esOtro ? sanitizeText(values.tipo_servicio_detalle) : '',
    fecha_entrega_solicitada: isoToTimestamp(values.fecha_entrega_solicitada),
    estado: 'nueva',
    creado_en: serverTimestamp(),
  };

  await addDoc(collection(db, 'solicitudes'), doc);
}
