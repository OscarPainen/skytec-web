import type { Timestamp, FieldValue } from 'firebase/firestore';

/**
 * CONTRATO DE DATOS — SAGRADO.
 * La app de escritorio (Python) lee exactamente estos campos.
 * No cambiar nombres ni tipos sin coordinar con el proyecto Python.
 * Colección Firestore: solicitudes/{autoId}
 */

/** Tipos de servicio predefinidos (dropdown, no texto libre). */
export const TIPOS_SERVICIO = [
  'Cambio de pantalla',
  'Cambio de batería',
  'Reparación de puerto de carga',
  'Problema de software',
  'Daño por líquido',
  'Otro / a evaluar',
] as const;

export type TipoServicio = (typeof TIPOS_SERVICIO)[number];

/** Valor que dispara el campo de detalle libre. */
export const OTRO_SERVICIO: TipoServicio = 'Otro / a evaluar';

/** Documento tal como se escribe en Firestore. `estado` siempre "nueva" al crear. */
export interface Solicitud {
  modelo_telefono: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string; // internacional; puede o no ser +56
  tipo_servicio: TipoServicio;
  tipo_servicio_detalle: string; // texto libre; solo se llena si tipo_servicio == "Otro / a evaluar", si no ""
  fecha_entrega_solicitada: Timestamp;
  estado: 'nueva';
  creado_en: FieldValue; // serverTimestamp()
}

/** Estado del formulario en el cliente (antes de convertir a Solicitud). */
export interface FormValues {
  modelo_telefono: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  tipo_servicio: TipoServicio | '';
  tipo_servicio_detalle: string;
  fecha_entrega_solicitada: string; // "YYYY-MM-DD" del <input type="date">
}
