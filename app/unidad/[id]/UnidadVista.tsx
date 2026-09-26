'use client';

/* ============================================================================
   Vista de una unidad: cablea el progreso persistido con el motor.
   ----------------------------------------------------------------------------
   El estado vive acá, no adentro de <Quiz>: así el puntaje de la barra superior
   y el del pie leen exactamente lo mismo que se persiste, sin duplicar cuentas.
   ========================================================================== */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Unidad } from '@/types/quiz';
import { useProgreso } from '@/lib/useProgreso';
import { avanceDe } from '@/lib/avance';
import { UNIDADES } from '@/data/units';
import Quiz from '@/components/Quiz';
import Tema from '@/components/Tema';

export default function UnidadVista({
  unidad,
  conApunte = false,
}: {
  unidad: Unidad;
  /** Si hay apunte teórico, la barra superior ofrece el enlace. */
  conApunte?: boolean;
}) {
  const router = useRouter();
  const { progreso, registrar, reiniciar, listo } = useProgreso(unidad.id);
  const avance = avanceDe(unidad, progreso);

  // Se recuerda la última unidad abierta, igual que hacía el motor viejo.
  useEffect(() => {
    try {
      localStorage.setItem('mode_quizz.unidad', unidad.id);
    } catch {
      /* modo privado o storage deshabilitado: no es crítico */
    }
  }, [unidad.id]);

  function pedirReinicio() {
    const nombre = `${unidad.materia} · ${unidad.unidad}`;
    if (!confirm(`¿Reiniciar el intento de ${nombre}? Se borran las respuestas de esta unidad.`)) {
      return;
    }
    reiniciar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pct = avance.total ? Math.round((avance.respondidas / avance.total) * 100) : 0;

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
            <span className="course-tag">
              {unidad.codigo} {unidad.materia} — {unidad.unidad}
            </span>
          </div>

          {UNIDADES.length > 1 && (
            <div className="unit-row">
              <label className="unit-label" htmlFor="selectorUnidad">
                Unidad
              </label>
              <select
                id="selectorUnidad"
                className="unit-select"
                value={unidad.id}
                onChange={(e) => router.push(`/unidad/${e.target.value}/`)}
              >
                {UNIDADES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.materia} · {u.unidad}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="score-row">
            <span className="score-readout">
              Respondidas <b>{avance.respondidas}</b>/<b>{avance.total}</b>
              <span className="sep">·</span> Correctas <b>{avance.correctas}</b>
            </span>
            <div className="progress-track" role="presentation">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            {conApunte && (
              <Link className="btn-ghost" href={`/apunte/${unidad.id}/`}>
                § Apunte
              </Link>
            )}
            <Tema />
            <button type="button" className="btn-ghost" onClick={pedirReinicio}>
              ↺ Reiniciar
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        <Quiz unidad={unidad} progreso={progreso} onRespuesta={registrar} />

        <section className="summary">
          <div className="big">
            <span>{avance.correctas}</span>/<span>{avance.total}</span>
          </div>
          <p>ejercicios correctos en esta unidad</p>
          <button type="button" className="btn-ghost" onClick={pedirReinicio}>
            ↺ Reiniciar intento
          </button>
        </section>

        <footer className="footer-note">
          <p>
            {unidad.unidad} · {unidad.codigo} {unidad.materia} · {unidad.facultad}.
          </p>
          <p>
            Fórmulas renderizadas con KaTeX (incluido en <code>vendor/</code>, funciona sin
            conexión).
          </p>
        </footer>
      </main>
    </>
  );
}
