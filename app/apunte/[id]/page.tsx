import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { unidadPorId } from '@/data/units';
import { idsConApunte, leerApunte } from '@/lib/apuntes';
import Tema from '@/components/Tema';
import DescargarPdf from '@/components/DescargarPdf';

// Export estático: una carpeta por apunte, generada en build.
export function generateStaticParams() {
  return idsConApunte().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const unidad = unidadPorId(id);
  const apunte = leerApunte(id);
  if (!apunte) return {};
  return {
    title: unidad ? `Apunte — ${unidad.unidad}` : apunte.titulo,
    description: unidad
      ? `Apunte teórico de ${unidad.unidad}, ${unidad.codigo} ${unidad.materia}: métodos, fundamentos y qué repasar para cada problema.`
      : apunte.titulo,
  };
}

export default async function PaginaApunte({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apunte = leerApunte(id);
  if (!apunte) notFound();
  const unidad = unidadPorId(id);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="volver" href="/">
            ← Todas las unidades
          </Link>
          <div className="brand">
            <h1>
              Laboratorio<span className="dot">·</span>Errores
            </h1>
            {unidad && (
              <span className="course-tag">
                {unidad.codigo} {unidad.materia} — {unidad.unidad}
              </span>
            )}
          </div>
          <div className="score-row">
            <span className="score-readout">Apunte teórico</span>
            <span className="apunte-spacer" />
            {unidad && (
              <Link className="btn-ghost" href={`/unidad/${unidad.id}/`}>
                ✎ Practicar
              </Link>
            )}
            <DescargarPdf id={id} className="btn-ghost" />
            <Tema />
          </div>
        </div>
      </header>

      <main className="wrap">
        <article className="apunte" dangerouslySetInnerHTML={{ __html: apunte.html }} />

        <footer className="footer-note">
          {unidad && (
            <p>
              <Link href={`/unidad/${unidad.id}/`}>Practicar {unidad.unidad} →</Link>
            </p>
          )}
          <p>Práctica autoevaluable · Facultad de Ingeniería — UBA.</p>
        </footer>
      </main>
    </>
  );
}
