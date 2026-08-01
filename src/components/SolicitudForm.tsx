import { useMemo, useState } from 'react';
import type { FormValues, TipoServicio } from '@/types';
import { TIPOS_SERVICIO, OTRO_SERVICIO } from '@/types';
import {
  isValidModelo,
  isValidName,
  isValidEmail,
  isValidPhone,
  sanitizePhone,
  isFutureDate,
  tomorrowISO,
} from '@/utils/validators';
import Field from './ui/Field';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

type Errors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = {
  modelo_telefono: '',
  cliente_nombre: '',
  cliente_email: '',
  cliente_telefono: '',
  tipo_servicio: '',
  tipo_servicio_detalle: '',
  fecha_entrega_solicitada: '',
};

function validate(v: FormValues): Errors {
  const e: Errors = {};
  if (!isValidModelo(v.modelo_telefono))
    e.modelo_telefono = 'Ingresa el modelo (mínimo 2 caracteres).';
  if (!isValidName(v.cliente_nombre))
    e.cliente_nombre = 'Ingresa tu nombre completo (solo letras, 3 a 80).';
  if (!isValidEmail(v.cliente_email))
    e.cliente_email = 'Ingresa un correo válido.';
  if (!isValidPhone(v.cliente_telefono))
    e.cliente_telefono = 'Ingresa un número válido (con código de país si es del extranjero).';
  if (!v.tipo_servicio) e.tipo_servicio = 'Selecciona un tipo de servicio.';
  if (v.tipo_servicio === OTRO_SERVICIO && v.tipo_servicio_detalle.trim().length < 3)
    e.tipo_servicio_detalle = 'Cuéntanos brevemente qué necesitas.';
  if (!isFutureDate(v.fecha_entrega_solicitada))
    e.fecha_entrega_solicitada = 'Elige una fecha futura.';
  return e;
}

interface Props {
  submitting: boolean;
  error: string | null;
  onSubmit: (values: FormValues) => void;
}

export default function SolicitudForm({ submitting, error, onSubmit }: Props) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const minDate = useMemo(tomorrowISO, []);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function markTouched(key: keyof FormValues) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  /** Muestra el error solo tras interactuar o intentar enviar. */
  function errFor(key: keyof FormValues): string | undefined {
    return touched[key] || submitAttempted ? errors[key] : undefined;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (isValid) onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field id="modelo" label="Modelo del teléfono" error={errFor('modelo_telefono')}>
        <Input
          id="modelo"
          placeholder="Ej: iPhone 12, Samsung A54"
          value={values.modelo_telefono}
          invalid={!!errFor('modelo_telefono')}
          onChange={(e) => set('modelo_telefono', e.target.value)}
          onBlur={() => markTouched('modelo_telefono')}
          autoComplete="off"
        />
      </Field>

      <Field id="nombre" label="Nombre completo" error={errFor('cliente_nombre')}>
        <Input
          id="nombre"
          placeholder="Tu nombre y apellido"
          value={values.cliente_nombre}
          invalid={!!errFor('cliente_nombre')}
          onChange={(e) => set('cliente_nombre', e.target.value)}
          onBlur={() => markTouched('cliente_nombre')}
          autoComplete="name"
        />
      </Field>

      <Field id="email" label="Correo electrónico" error={errFor('cliente_email')}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          placeholder="tucorreo@ejemplo.cl"
          value={values.cliente_email}
          invalid={!!errFor('cliente_email')}
          onChange={(e) => set('cliente_email', e.target.value)}
          onBlur={() => markTouched('cliente_email')}
          autoComplete="email"
        />
      </Field>

      <Field id="telefono" label="Número de teléfono" error={errFor('cliente_telefono')}>
        <Input
          id="telefono"
          type="tel"
          inputMode="tel"
          placeholder="Ej: +56 9 1234 5678"
          value={values.cliente_telefono}
          invalid={!!errFor('cliente_telefono')}
          onChange={(e) => set('cliente_telefono', sanitizePhone(e.target.value))}
          onBlur={() => markTouched('cliente_telefono')}
          autoComplete="tel"
        />
      </Field>

      <Field id="servicio" label="Tipo de servicio" error={errFor('tipo_servicio')}>
        <Select
          id="servicio"
          value={values.tipo_servicio}
          invalid={!!errFor('tipo_servicio')}
          onChange={(e) => set('tipo_servicio', e.target.value as TipoServicio)}
          onBlur={() => markTouched('tipo_servicio')}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {TIPOS_SERVICIO.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </Field>

      {values.tipo_servicio === OTRO_SERVICIO && (
        <Field
          id="detalle"
          label="Cuéntanos qué necesitas"
          error={errFor('tipo_servicio_detalle')}
        >
          <Input
            id="detalle"
            placeholder="Describe brevemente el problema"
            value={values.tipo_servicio_detalle}
            invalid={!!errFor('tipo_servicio_detalle')}
            onChange={(e) => set('tipo_servicio_detalle', e.target.value)}
            onBlur={() => markTouched('tipo_servicio_detalle')}
            autoComplete="off"
            maxLength={200}
          />
        </Field>
      )}

      <Field
        id="fecha"
        label="Fecha de recepción"
        hint="Día en que traes tu teléfono al taller."
        error={errFor('fecha_entrega_solicitada')}
      >
        <Input
          id="fecha"
          type="date"
          min={minDate}
          value={values.fecha_entrega_solicitada}
          invalid={!!errFor('fecha_entrega_solicitada')}
          onChange={(e) => set('fecha_entrega_solicitada', e.target.value)}
          onBlur={() => markTouched('fecha_entrega_solicitada')}
        />
      </Field>

      {error && (
        <p
          className="rounded-md bg-danger/10 px-3 py-2 text-center text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} disabled={!isValid}>
        {submitting ? 'Enviando…' : error ? 'Reintentar' : 'Enviar solicitud'}
      </Button>
    </form>
  );
}
