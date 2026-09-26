import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { UNIDADES, unidadPorId } from '@/data/units';
import { tieneApunte } from '@/lib/apuntes';
import UnidadVista from './UnidadVista';

// Export estático: una carpeta por unidad, generada en build.
export function generateStaticParams() {
  return UNIDADES.map((u) => ({ id: u.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const unidad = unidadPorId(id);
  if (!unidad) return {};
  return {
    title: `${unidad.materia} — ${unidad.unidad}`,
    description: `Práctica autoevaluable de ${unidad.unidad}, ${unidad.codigo} ${unidad.materia}.`,
  };
}

export default async function PaginaUnidad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unidad = unidadPorId(id);
  if (!unidad) notFound();
  return <UnidadVista unidad={unidad} conApunte={tieneApunte(unidad.id)} />;
}
