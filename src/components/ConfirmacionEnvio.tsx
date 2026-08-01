import type { FormValues } from '@/types';
import { OTRO_SERVICIO } from '@/types';
import Button from './ui/Button';

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface Props {
  values: FormValues;
  onReset: () => void;
}

export default function ConfirmacionEnvio({ values, onReset }: Props) {
  const servicio =
    values.tipo_servicio === OTRO_SERVICIO && values.tipo_servicio_detalle
      ? `${values.tipo_servicio}: ${values.tipo_servicio_detalle}`
      : values.tipo_servicio;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <svg
          className="h-7 w-7 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-foreground">¡Solicitud enviada!</h2>
      <p className="mt-2 text-sm text-muted">
        Nos pondremos en contacto contigo para confirmar fecha y precio.
      </p>

      <dl className="mt-6 w-full rounded-lg border border-border bg-surface p-4 text-left text-sm">
        <div className="flex justify-between gap-4 py-1">
          <dt className="text-muted">Modelo</dt>
          <dd className="text-right font-medium text-foreground">
            {values.modelo_telefono}
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-1">
          <dt className="text-muted">Servicio</dt>
          <dd className="text-right font-medium text-foreground">{servicio}</dd>
        </div>
        <div className="flex justify-between gap-4 py-1">
          <dt className="text-muted">Recepción</dt>
          <dd className="text-right font-medium text-foreground">
            {formatFecha(values.fecha_entrega_solicitada)}
          </dd>
        </div>
      </dl>

      <div className="mt-6 w-full">
        <Button type="button" onClick={onReset}>
          Enviar otra solicitud
        </Button>
      </div>
    </div>
  );
}
