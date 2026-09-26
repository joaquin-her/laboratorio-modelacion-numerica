'use client';

/* ============================================================================
   Enlace «Descargar PDF» de un apunte.
   ----------------------------------------------------------------------------
   El PDF lo genera scripts/apuntes-pdf.mjs después del build y queda como
   archivo estático en out/apuntes/<id>.pdf. Es un <a> plano (no next/link), así
   que el basePath se agrega a mano.

   En `npm run dev`, o en un build local sin `npm run pdf`, el archivo no existe:
   antes de descargar se verifica con un HEAD y, si falta, se cae al respaldo
   (imprimir la página, que usa la misma hoja @media print, o ir al apunte).
   ========================================================================== */

import { useRef } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Props {
  id: string;
  className?: string;
  children?: React.ReactNode;
  /** Qué hacer si el PDF no existe: imprimir esta página o abrir el apunte. */
  respaldo?: 'imprimir' | 'apunte';
}

export default function DescargarPdf({ id, className, children, respaldo = 'imprimir' }: Props) {
  const verificado = useRef(false);
  const href = `${basePath}/apuntes/${id}.pdf`;

  async function alHacerClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (verificado.current) return; // ya sabemos que existe: descarga normal
    e.preventDefault();
    const enlace = e.currentTarget;
    let existe = false;
    try {
      const r = await fetch(href, { method: 'HEAD' });
      existe = r.ok && (r.headers.get('content-type') ?? '').includes('pdf');
    } catch {
      /* sin red o sin servidor: se usa el respaldo */
    }
    if (existe) {
      verificado.current = true;
      enlace.click();
    } else if (respaldo === 'imprimir') {
      window.print();
    } else {
      window.location.href = `${basePath}/apunte/${id}/`;
    }
  }

  return (
    <a
      className={className}
      href={href}
      download={`${id}.pdf`}
      onClick={alHacerClick}
      title="Descargar el apunte en PDF"
    >
      {children ?? '⤓ Descargar PDF'}
    </a>
  );
}
