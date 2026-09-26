# laboratorio-modelacion-numerica — Laboratorio de Errores

Práctica autoevaluable multi-unidad para materias de ingeniería. Cada ejercicio
se responde por opción múltiple o ingresando el valor calculado, y se corrige al
instante como correcto o incorrecto, con el desarrollo completo desplegable.

Las unidades incluidas son la **Guía 1 — Errores**, la **Guía 2 — Ecuaciones No
Lineales**, la **Guía 3 — Sistemas de Ecuaciones Lineales** y la **Guía 4 —
Sistemas de Ecuaciones No Lineales** de 95.13 Métodos
Matemáticos y Numéricos (Facultad de Ingeniería, UBA). El motor está separado
del contenido: agregar la guía de otra materia es escribir un archivo y
registrarlo.

Construido con Next.js y publicado como sitio estático.

## Cómo usarlo

El sitio es estático: se compila una vez y se sirve como HTML. En desarrollo,

```bash
npm install
npm run dev          # http://localhost:3000
```

y para generar el sitio publicable:

```bash
npm run build        # deja el export estático en out/
npm start            # sirve out/ para probarlo como en producción
```

En la portada están las unidades disponibles; cada una tiene su propia URL
(`/unidad/<id>/`). **El avance se guarda en el navegador**: recargar la página,
cerrar la pestaña o volver más tarde no pierde lo respondido. Cada unidad guarda
su progreso por separado, y **Reiniciar** borra solamente la que estás mirando.

## Publicación

El push a `main` dispara `.github/workflows/deploy.yml`, que compila y publica en
GitHub Pages. El workflow exporta con `NEXT_PUBLIC_BASE_PATH=/<nombre-del-repo>`
porque Pages sirve los project sites bajo esa ruta; para publicar en un dominio
propio o en la raíz, basta con no setear esa variable.

Hay que habilitarlo una vez en **Settings → Pages → Source: GitHub Actions**.

## Contenido

### Guía 1 — Errores

Los 8 problemas de la Guía 1 (26 ejercicios en total) más un ejercicio extra
resuelto en clase sobre condicionamiento de `ln(x − √(x²−1))`.

| Problema | Tema |
|---|---|
| 1 | Expresión correcta de un resultado y cifras significativas |
| 2 | Error del área de un círculo: sustitución directa vs. teoría lineal |
| 3 | Reglas de propagación en suma/resta y producto/cociente |
| 4 | Cálculo de expresiones con sus cotas de error |
| 5 | Incidencia relativa de cada variable en el error |
| 6 | Cancelación catastrófica entre formas algebraicamente equivalentes |
| 7 | Error propagado en una integral tabulada (derivadas por diferencias finitas) |
| 8 | Tensión de rotura de una probeta de hormigón |
| ★ | Extra: logaritmo mal condicionado y su forma racionalizada |

Todos los resultados fueron verificados numéricamente, y los criterios de
redondeo siguen los de la cátedra: una cifra es **correcta** cuando el error no
supera media unidad de su orden, y el resultado se escribe reteniendo el dígito
del orden de la cota (el último es «medianamente significativo»).

### Guía 2 — Ecuaciones No Lineales

Los 8 problemas de la Guía 2 (36 ejercicios en total) más dos problemas extra:
la comparación de los cinco métodos que la cátedra desarrolla en clase, y los
dos planteos de Física que la guía marca como no evaluables.

| Problema | Tema |
|---|---|
| 1 | Bisección: elección del intervalo de arranque y cota de iteraciones |
| 2 | Bisección sobre `x²/4 − sen(x)`: tolerancia absoluta vs. relativa, orden y λ |
| 3 | Punto fijo: condiciones de convergencia, orden lineal y constante asintótica |
| 4 | Newton-Raphson para `x = cos(x)`: intervalo de convergencia y orden cuadrático |
| 5 | Fórmulas iterativas para `∛c`, `arcsen(a)` y `ln(a)` con aritmética limitada |
| 6 | Precisión alcanzable cuando `f` y `f'` se conocen con 4 decimales |
| 7 | Método de la secante: orden supralineal (razón áurea) |
| 8 | Newton-Raphson sobre `0,5 − e^−x` |
| ★ | Extra: comparación de los 5 métodos (λ, p y N) |
| ★ | Extra: electrostática y mecánica, dos modelos que llevan a una ENL |

Las tablas de iteraciones reproducen fila por fila las de la clase del
08/04/2025 (Ejercicios 2.2 y 2.7), incluida su forma de estimar el orden `p` y
la constante `λ` a partir de las últimas tres diferencias entre iteraciones.

### Guía 3 — Sistemas de Ecuaciones Lineales

Los 12 problemas de la Guía 3 (62 ejercicios en total) más el ejercicio de
examen que la cátedra resuelve en la clase de métodos iterativos.

| Problema | Tema |
|---|---|
| 1 | Eliminación de Gauss sin pivoteo sobre una Vandermonde 4×4 |
| 2 | Pivoteo parcial con `t=4`: condicionamiento vs. estabilidad del algoritmo |
| 3 | Gauss con pivoteo, `LU` de Doolittle y refinamiento con `t=3` |
| 4 | `LU` dada con vector de permutaciones: resolver y reconstruir `A` |
| 5 | Refinamiento iterativo y estimación de dígitos significativos (`K`, `p`, `q`) |
| 6 | Matriz casi singular: pivoteo parcial vs. total y número de condición |
| 7 | Jacobi y Gauss-Seidel en un 2×2 general: `ρ(T_GS) = ρ(T_J)²` |
| 8 | Reordenar filas para pasar de `ρ = 354` a `ρ = 0,0028` |
| 9 | Gauss-Seidel con criterio de parada y cota del error de truncamiento |
| 10 | Un sistema no singular donde ambos métodos ciclan (`ρ(T) = 1`) |
| 11 | Matriz rala tridiagonal: la ralitud se conserva al triangular |
| 12 | Reordenar para garantizar convergencia y precisión de 3 dígitos |
| ★ | Extra: examen con autovalores complejos de la matriz de iteración |

La notación y los criterios siguen las clases «SEL Directos» y «SEL
Iterativos»: multiplicadores `m_ik = a_ik / a_kk`, residuo `r = b − A·x̃`
siempre en doble precisión, condicionamiento experimental
`K(A) ≈ (‖δx‖/‖x̃‖)·10^t` con `p = log₁₀K` y `q = t − p`, y convergencia
decidida por el radio espectral de la **matriz de iteración** `T`, no por el
de `A`.

### Guía 4 — Sistemas de Ecuaciones No Lineales

Los 5 problemas de la Guía 4 (33 ejercicios en total). No hay resoluciones de la
cátedra para esta guía: todo se verificó con un script de Python que simula la
aritmética de `t` dígitos con redondeo simétrico en cada operación.

| Problema | Tema |
|---|---|
| 1 | Newton-Raphson 2×2: jacobiano, cuenca de convergencia y orden cuadrático |
| 2 | Newton con 4 dígitos: criterio de corte por componente y reformulación del sistema |
| 3 | Newton con aritmética de 3 dígitos: estancamiento por redondeo |
| 4 | Newton vs. Gauss-Seidel no lineal: elección del despeje y ciclo por redondeo |
| 5 | Newton 3×3 con jacobiano actualizado y fijo: el «orden ≈ 0,5» y `λ = ρ(I − J₀⁻¹J*)` |

Newton para sistemas resuelve en cada paso el SEL `J(Xₖ)·ΔX = −F(Xₖ)`; las
tablas usan `‖ΔX‖∞`, error relativo y la estimación de `p` y `λ` con tres
diferencias consecutivas, como en la Guía 2. En el Problema 5 el enunciado
literal (`x₁x₂x₃ = +4,188`) no tiene solución real cerca del arranque; se
trabaja con `−4,188`, que reproduce el orden ≈ 0,5 que pide la guía, y la
unidad lo explica.

## Estructura

```
app/page.tsx                           Landing: portada y grilla de unidades
app/unidad/[id]/                       Una página por unidad (export estático)
app/apunte/[id]/                       Apunte teórico de una unidad, si existe
content/apuntes/<id-de-unidad>.md      Apuntes en Markdown con fórmulas $…$ y $$…$$
src/lib/apuntes.ts                     Lee y renderiza los apuntes en build (marked + KaTeX)
src/components/                        Motor: render, corrección y puntaje      ← no hace falta tocarlo
src/lib/progress.ts                    Persistencia del progreso en localStorage
src/lib/useProgreso.ts                 Hook que expone el progreso de una unidad
src/lib/avance.ts                      Cálculo de respondidas/correctas/total
src/lib/tex.ts                         KaTeX: `M` (String.raw), `tex`, `inline`
src/types/quiz.ts                      Contrato de contenido: qué es una Unidad
src/data/units/<slug>.ts               Contenido de cada unidad                 ← lo único que se escribe
src/data/units/_plantilla.ts           Molde para copiar al dar de alta una unidad
src/data/units/index.ts                Registro de unidades (orden del selector)
src/styles/styles.css                  Estilos, temas claro/oscuro
public/vendor/katex/                   KaTeX 0.16.11 (MIT), para renderizar offline
```

`src/types/quiz.ts` es la frontera entre el motor y el contenido: una unidad
nueva sólo tiene que satisfacer el tipo `Unidad`, y los errores de forma los
atrapa el compilador en vez de aparecer en runtime. Los ids de cada pregunta se
namespacean con el id de la unidad (`metodos-numericos-guia-1__q4a1`), así dos
guías pueden numerar sus preguntas igual sin pisarse.

## Apuntes teóricos

Cada unidad puede tener un apunte con los métodos y fundamentos que hacen falta
para resolverla. Alcanza con crear `content/apuntes/<id-de-unidad>.md`: la ruta
`/apunte/<id>/` se genera sola en el build, y la tarjeta de la unidad y la barra
de la vista de práctica muestran el enlace.

El Markdown admite tablas (GFM) y fórmulas de KaTeX: `$…$` en línea y `$$…$$` en
bloque, que pueden ocupar varias líneas. Las fórmulas se renderizan en el
server, así que el HTML publicado ya las trae resueltas. Hoy hay apuntes para las
Guías 2, 3 y 4.

## Agregar una unidad nueva

Son tres pasos, y el motor no se toca:

1. **Copiá** `src/data/units/_plantilla.ts` a `src/data/units/<materia>-<guia>.ts`.
2. **Cambiale el `id`** (tiene que ser único; es el namespace de la unidad y el
   slug de su URL), los datos de cabecera —`codigo`, `materia`, `unidad`,
   `facultad`— y reemplazá `problemas` por el contenido real.
3. **Registrala** en `src/data/units/index.ts`. El orden del array es el orden
   del selector y de la portada.

```ts
// src/data/units/index.ts
import { unidad as metodosNumericosGuia1 } from './metodos-numericos-guia-1';
import { unidad as analisis2Guia3 } from './analisis-2-guia-3';

export const UNIDADES: Unidad[] = [metodosNumericosGuia1, analisis2Guia3];
```

Y el archivo de contenido:

```ts
import type { Unidad } from '@/types/quiz';
import { M } from '@/lib/tex';

export const unidad: Unidad = {
  id: 'analisis-2-guia-3',
  codigo: '61.03',
  materia: 'Análisis Matemático II',
  unidad: 'Guía 3 — Integrales',
  facultad: 'Facultad de Ingeniería — UBA',
  problemas: [
    {
      id: 'p1',
      titulo: 'Título del problema',
      enunciado: [
        { p: 'Texto con HTML y $\\LaTeX$ en línea.' },
        { math: M`\int_0^1 f(x)\,dx` },
        { ul: ['$x = 1 \\pm 0{,}1$'] },
        { table: { head: ['a', 'b'], rows: [['1', '2']] } },
        { note: 'Aclaración destacada.' }
      ],
      preguntas: [
        {
          id: 'q1_1', tag: '1.a', tipo: 'mc', correcta: 'A',
          enunciado: '¿Cuál es la expresión correcta?',
          opciones: [{ v: 'A', tex: M`x^2` }, { v: 'B', tex: M`x^3` }],
          desarrollo: [{ p: 'Por qué.' }]
        },
        {
          id: 'q1_2', tag: '1.b', tipo: 'num', respuesta: 3.14, tol: 0.01,
          enunciado: 'Valor de $y$', unidad: 'm', placeholder: '0,00'
        }
      ]
    }
  ]
};
```

Verificá con `npx tsc --noEmit` antes de dar la unidad por terminada: el tipo
`Unidad` rechaza en build lo que antes fallaba recién al abrir la página.

### Detalles que conviene respetar

- **`M` (`String.raw`) para todo el LaTeX**: en un string común `\frac` es un
  salto de página y `\times` un tabulador. Las fórmulas en línea van entre `$…$`
  dentro de cualquier texto.
- **En opciones de opción múltiple usá `\frac`, no `\tfrac`**: el motor ya agrega
  `\displaystyle`, y `\tfrac` sale diminuto igual.
- Para las preguntas numéricas, `tol` es tolerancia absoluta y `reltol` es
  relativa (`0.3` = ±30 %, útil cuando la respuesta es del orden de 10⁻⁹). La
  entrada acepta coma o punto decimal y notación científica (`8,3e-9`).
- Los decimales en LaTeX se escriben `2{,}00`, con coma, siguiendo la
  convención de la cátedra.

## Licencia

KaTeX se distribuye bajo licencia MIT; su copia está en `vendor/katex/LICENSE`.
