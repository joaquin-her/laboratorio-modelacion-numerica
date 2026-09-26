import Link from 'next/link';
import { UNIDADES } from '@/data/units';

const REPO_URL = 'https://github.com/joaquin-her/laboratorio-modelacion-numerica';

export default function Landing() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <h1>
              Laboratorio<span className="dot">·</span>Errores
            </h1>
            <div className="brand-side">
              <span className="course-tag">Facultad de Ingeniería — UBA</span>
              <a
                className="repo-link"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Repositorio en GitHub"
                title="Repositorio en GitHub"
              >
                <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="hero">
          <h2>Practicá como si fuera el parcial.</h2>
          <p className="hero-lead">
            Guías de ejercicios de materias de ingeniería, resueltas por vos y corregidas al
            instante. Cada ejercicio se responde por opción múltiple o ingresando el valor
            calculado, y se corrige solo, con el desarrollo completo desplegable.
          </p>
          <p className="hero-lead">
            El avance queda guardado en tu navegador: podés cerrar la pestaña y seguir después.
          </p>
        </section>

        <section className="intro">
          <h2>Cómo practicar</h2>
          <ol className="intro-steps">
            <li>
              <span className="num">1</span> Resolvé cada ejercicio en papel o calculadora, como
              en un parcial.
            </li>
            <li>
              <span className="num">2</span> Cargá tu resultado y presioná{' '}
              <strong>Verificar</strong> (o Enter en los campos numéricos).
            </li>
            <li>
              <span className="num">3</span> Vas a ver al instante si está correcto o incorrecto,
              con el desarrollo completo desplegado.
            </li>
          </ol>
          <p className="intro-note">
            Las respuestas numéricas admiten un margen de tolerancia por redondeo de cifras
            significativas: no hace falta que coincidan dígito a dígito. Usá coma o punto decimal
            indistintamente; para valores muy chicos podés escribir notación científica, como{' '}
            <code>8,3e-9</code>.
          </p>
        </section>

        <section className="unidades">
          <h2>Unidades disponibles</h2>
          <ul className="unidad-grid">
            {UNIDADES.map((u) => {
              const ejercicios = u.problemas.reduce((n, p) => n + p.preguntas.length, 0);
              return (
                <li key={u.id}>
                  <Link className="unidad-card" href={`/unidad/${u.id}/`}>
                    <span className="unidad-codigo">
                      {u.codigo} {u.materia}
                    </span>
                    <span className="unidad-nombre">{u.unidad}</span>
                    <span className="unidad-meta">
                      {u.problemas.length} problemas · {ejercicios} ejercicios
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="footer-note">
          <p>Práctica autoevaluable · Facultad de Ingeniería — UBA.</p>
          <p>
            Fórmulas renderizadas con KaTeX (incluido en <code>vendor/</code>, funciona sin
            conexión).
          </p>
        </footer>
      </main>
    </>
  );
}
