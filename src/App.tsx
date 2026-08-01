import { useEffect, useState } from 'react';
import type { FormValues } from './types';
import { enviarSolicitud, ensureAuth } from './services/solicitudes';
import { writeErrorMessage } from './utils/errors';
import SolicitudForm from './components/SolicitudForm';
import ConfirmacionEnvio from './components/ConfirmacionEnvio';
import ConnectionStatus from './components/ConnectionStatus';

export default function App() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviada, setEnviada] = useState<FormValues | null>(null);

  // Auth anónima silenciosa al cargar. Si falla (offline), se reintenta al enviar.
  useEffect(() => {
    ensureAuth().catch(() => {});
  }, []);

  async function handleSubmit(values: FormValues) {
    // Offline: Firestore dejaría el addDoc pendiente y el spinner colgado.
    // Cortamos antes; el banner ya avisa y los datos quedan en el form.
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setError('Sin conexión. Revisa tu internet e intenta nuevamente.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await enviarSolicitud(values);
      setEnviada(values); // datos preservados para el resumen
    } catch (e) {
      setError(writeErrorMessage(e)); // datos siguen en el form → botón Reintentar
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <ConnectionStatus />

      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-md px-5 py-4">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Sky<span className="text-primary">tec</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 sm:py-8">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          {enviada ? (
            <ConfirmacionEnvio values={enviada} onReset={() => setEnviada(null)} />
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Solicitud de reparación
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Completa tus datos y te contactamos para confirmar fecha y precio.
                </p>
              </div>
              <SolicitudForm
                submitting={submitting}
                error={error}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </div>
      </main>

      <footer className="mx-auto max-w-md px-5 py-8 text-center text-xs text-muted">
        Servicio Técnico Skytec
      </footer>
    </div>
  );
}
