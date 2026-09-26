/* ============================================================================
   Unidad — 95.13 Métodos Matemáticos y Numéricos (FIUBA), Guía 4: Sistemas de Ecuaciones No Lineales
   ----------------------------------------------------------------------------
   Contenido puro: el motor vive en src/components / src/lib. Para dar de alta
   otra unidad, copiá src/data/units/_plantilla.ts — no hace falta tocar el motor.

   No hay resoluciones de la cátedra para esta guía. Todos los valores fueron
   calculados y verificados con Python (data/modelacion/4/verificacion_guia4.py):
   Newton en doble precisión, y aritmética de t dígitos simulada con redondeo
   simétrico en cada operación intermedia. La notación de las tablas (Δx en
   norma infinito, error relativo, p y λ con tres diferencias consecutivas)
   sigue la de las Guías 2 y 3.

   Problema 5: el enunciado literal (x1·x2·x3 = +4,188) no tiene solución real
   cerca de X(0); se trabaja con −4,188, que es la lectura con la que se
   reproduce el «orden ≈ 0,5» del inciso c). Está explicado en el problema.

   ========================================================================== */

import type { Unidad } from '@/types/quiz';
import { M } from '@/lib/tex';

export const unidad: Unidad = {
  id: 'modelacion-guia-4-senl',
  codigo: '95.13',
  materia: 'Métodos Numéricos',
  unidad: 'Guía 4 — Sistemas de Ecuaciones No Lineales',
  facultad: 'Facultad de Ingeniería — UBA',

  problemas: [
    /* ===================== PROBLEMA 1 ===================== */
    {
      id: 'p1',
      titulo: 'Newton-Raphson: circunferencia e hipérbola',
      enunciado: [
        { p: 'Sea el sistema de ecuaciones no lineal' },
        { math: M`\begin{aligned} f(x,y) &= x^2 + y^2 - 4 = 0 \\ g(x,y) &= x\cdot y - 1 = 0 \end{aligned}` },
        { p: M`Resolverlo por el método de Newton-Raphson con $x_0 = 2$ e $y_0 = 0$.` },
        { note: M`Newton para sistemas linealiza $F$ alrededor del punto actual y resuelve un <strong>sistema lineal</strong> en cada paso: $J(X_k)\,\Delta X = -F(X_k)$, $X_{k+1} = X_k + \Delta X$. Nunca se invierte $J$; se resuelve el SEL con cualquiera de los métodos de la Guía 3.` }
      ],
      preguntas: [
        {
          id: 'q1_1', tag: '1.a', tipo: 'mc', correcta: 'A',
          enunciado: M`¿Cuál es la matriz jacobiana en el punto de arranque $(2;\,0)$, y qué se puede decir de ella?`,
          opciones: [
            { v: 'A', tex: M`\begin{gathered}J(X_0) = \begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix} \\[4pt]\det J = 8 \neq 0 \end{gathered}` },
            { v: 'B', tex: M`\begin{gathered}J(X_0) = \begin{bmatrix} 4 & 0 \\ 0 & 0 \end{bmatrix} \\[4pt]\text{singular} \end{gathered}` },
            { v: 'C', tex: M`\begin{gathered}J(X_0) = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} \\[4pt]\det J = 4 \neq 0 \end{gathered}` },
            { v: 'D', tex: M`\begin{gathered}J(X_0) = \begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix} \\[4pt]\text{singular porque } y_0 = 0 \end{gathered}` }
          ],
          desarrollo: [
            { p: 'Cada fila de $J$ es el gradiente de una ecuación:' },
            { math: M`J(x,y) = \begin{bmatrix} \dfrac{\partial f}{\partial x} & \dfrac{\partial f}{\partial y} \\[8pt] \dfrac{\partial g}{\partial x} & \dfrac{\partial g}{\partial y} \end{bmatrix} = \begin{bmatrix} 2x & 2y \\ y & x \end{bmatrix} \qquad \det J = 2x^2 - 2y^2` },
            { math: M`J(2;\,0) = \begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix} \qquad \det J = 8` },
            { p: M`El jacobiano sólo es singular sobre las rectas $y = \pm x$; el punto de arranque está lejos de ellas. Que $y_0 = 0$ anule una entrada <em>fuera</em> de la diagonal no hace singular a la matriz (opción D). La B confunde $\partial g/\partial y = x$ con $y$, y la C se olvida del factor 2 de los cuadrados.` }
          ]
        },
        {
          id: 'q1_2', tag: '1.b', tipo: 'num', respuesta: 0.5, tol: 0.001,
          enunciado: M`Valor de $y_1$ tras la primera iteración.`,
          placeholder: '0,0',
          desarrollo: [
            { math: M`F(X_0) = \begin{Bmatrix} 4 + 0 - 4 \\ 0 - 1 \end{Bmatrix} = \begin{Bmatrix} 0 \\ -1 \end{Bmatrix}` },
            { math: M`\begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix}\begin{Bmatrix} \Delta x \\ \Delta y \end{Bmatrix} = \begin{Bmatrix} 0 \\ 1 \end{Bmatrix} \;\Longrightarrow\; \Delta x = 0,\;\; \Delta y = 0{,}5` },
            { p: M`Como $J(X_0)$ es diagonal, el primer SEL se resuelve a ojo: $X_1 = (2;\;0{,}5)$. El punto inicial ya verificaba la circunferencia; el primer paso corrige sólo la hipérbola.` }
          ]
        },
        {
          id: 'q1_3', tag: '1.c', tipo: 'num', respuesta: 1.931852, tol: 0.0005,
          enunciado: M`Valor final de $x$ (4 decimales o más).`,
          placeholder: '0,0000',
          desarrollo: [
            {
              table: {
                head: [M`$k$`, M`$x_k$`, M`$y_k$`, M`$\|\Delta X\|_\infty$`, M`$\|\Delta X\|_\infty / \|X_k\|_\infty$`],
                rows: [
                  ['0', '2,0000000', '0,0000000', '—', '—'],
                  ['1', '2,0000000', '0,5000000', '5,000×10⁻¹', '2,500×10⁻¹'],
                  ['2', '1,9333333', '0,5166667', '6,667×10⁻²', '3,448×10⁻²'],
                  ['3', '1,9318527', '0,5176371', '1,481×10⁻³', '7,664×10⁻⁴'],
                  ['4', '1,9318517', '0,5176381', '1,089×10⁻⁶', '5,635×10⁻⁷'],
                  ['5', '1,9318517', '0,5176381', '7,980×10⁻¹³', '4,131×10⁻¹³']
                ]
              }
            },
            { p: 'La solución tiene forma cerrada, lo que permite controlar el resultado: sustituyendo $y = 1/x$ en la circunferencia,' },
            { math: M`x^2 + \frac{1}{x^2} = 4 \;\Longrightarrow\; x^4 - 4x^2 + 1 = 0 \;\Longrightarrow\; x = \sqrt{2+\sqrt{3}} = 1{,}9318517,\quad y = \sqrt{2-\sqrt{3}} = 0{,}5176381` }
          ]
        },
        {
          id: 'q1_4', tag: '1.d', tipo: 'num', respuesta: 0.517638, tol: 0.0005,
          enunciado: M`Valor final de $y$.`,
          placeholder: '0,0000',
          desarrollo: [
            { p: M`De la tabla anterior: $y = 0{,}5176381$. Control: $x\cdot y = 1{,}9318517 \times 0{,}5176381 = 1{,}0000000$ y $x^2 + y^2 = 3{,}7320508 + 0{,}2679492 = 4$.` }
          ]
        },
        {
          id: 'q1_5', tag: '1.e', tipo: 'mc', correcta: 'C',
          enunciado: M`El sistema tiene cuatro soluciones reales. ¿A cuál converge Newton desde $(2;\,0)$, y por qué?`,
          opciones: [
            { v: 'A', html: M`A $(0{,}518;\;1{,}932)$: Newton siempre converge a la raíz con $y$ mayor.` },
            { v: 'B', html: M`A $(-1{,}932;\;-0{,}518)$, porque el primer paso invierte el signo de $x$.` },
            { v: 'C', html: M`A $(1{,}932;\;0{,}518)$: es la más cercana al arranque y la que está en la misma región, lejos de las rectas $y=\pm x$ donde $J$ es singular.` },
            { v: 'D', html: 'No converge: el jacobiano es singular en el arranque.' }
          ],
          desarrollo: [
            { p: M`Las cuatro intersecciones de la circunferencia de radio 2 con la hipérbola $xy = 1$ son $(\pm 1{,}932;\;\pm 0{,}518)$ y $(\pm 0{,}518;\;\pm 1{,}932)$, con los dos signos iguales.` },
            { p: M`Newton converge a la raíz en cuya «cuenca» está el punto inicial. Las rectas $y = \pm x$, donde $\det J = 2(x^2-y^2) = 0$, separan las regiones: arrancando en $(2;\,0)$ —por debajo de $y = x$— los pasos nunca cruzan esa recta y el método converge a $(1{,}932;\;0{,}518)$. Arrancando en $(0;\,2)$ se obtendría, por simetría, $(0{,}518;\;1{,}932)$.` }
          ]
        },
        {
          id: 'q1_6', tag: '1.f', tipo: 'num', respuesta: 1.9, tol: 0.15,
          enunciado: M`Orden de convergencia $p$ estimado con las diferencias de las iteraciones 2, 3 y 4.`,
          ayuda: M`$p = \ln(\Delta_{k+1}/\Delta_k)\,/\,\ln(\Delta_k/\Delta_{k-1})$ con $\Delta$ en norma infinito.`,
          placeholder: '0,0',
          desarrollo: [
            { math: M`p = \frac{\ln\left(1{,}089\times10^{-6} / 1{,}481\times10^{-3}\right)}{\ln\left(1{,}481\times10^{-3} / 6{,}667\times10^{-2}\right)} = \frac{-7{,}215}{-3{,}807} = 1{,}895` },
            { math: M`\lambda = \frac{\Delta_4}{\Delta_3^{\,p}} = \frac{1{,}089\times10^{-6}}{\left(1{,}481\times10^{-3}\right)^{1{,}895}} \approx 0{,}25` },
            { p: M`Con la terna anterior ($\Delta_1, \Delta_2, \Delta_3$) sale $p = 1{,}890$. Ambos tienden a <strong>2</strong>: Newton para sistemas conserva la convergencia cuadrática mientras $J(\alpha)$ no sea singular. Se aceptan valores entre 1,75 y 2,05.` }
          ]
        },
        {
          id: 'q1_7', tag: '1.g', tipo: 'num', respuesta: 4, tol: 0.4,
          enunciado: M`¿Cuántas iteraciones hacen falta para que $\|\Delta X\|_\infty / \|X_k\|_\infty < 10^{-5}$?`,
          ayuda: 'La guía no fija tolerancia; ésta es una tolerancia de práctica.',
          placeholder: '0',
          desarrollo: [
            { p: M`En la tabla, la iteración 3 todavía da $7{,}7\times10^{-4}$ y la 4 ya da $5{,}6\times10^{-7}$: <strong>4 iteraciones</strong>. Notar el salto: de tres órdenes de magnitud a seis entre dos pasos consecutivos, la firma de la convergencia cuadrática (los dígitos correctos se duplican).` }
          ]
        }
      ]
    },

    /* ===================== PROBLEMA 2 ===================== */
    {
      id: 'p2',
      titulo: 'Newton-Raphson con 4 dígitos de precisión',
      enunciado: [
        { p: 'Resolver el siguiente sistema:' },
        { math: M`\begin{aligned} 1{,}021\cdot\frac{x^2}{y} &= -4{,}953 \\[4pt] 5{,}040\cdot x\cdot y &= -0{,}05440 \end{aligned}` },
        { p: M`Utilizar el método de Newton-Raphson hasta obtener una precisión de 4 dígitos. Partir de $x = 0{,}3$, $y = -0{,}03$.` },
        { note: M`Criterio de corte (el mismo de las Guías 2 y 3): se itera hasta que el cambio relativo de <em>cada</em> componente sea menor que $0{,}5\times10^{-4}$, es decir, hasta que los 4 primeros dígitos dejen de moverse. Se trabaja con $F$ tal como está escrito: $f_1 = 1{,}021\,x^2/y + 4{,}953$.` }
      ],
      preguntas: [
        {
          id: 'q2_1', tag: '2.a', tipo: 'mc', correcta: 'B',
          enunciado: M`Con $f_1 = 1{,}021\,x^2/y + 4{,}953$ y $f_2 = 5{,}040\,xy + 0{,}05440$, el jacobiano es:`,
          opciones: [
            { v: 'A', tex: M`J = \begin{bmatrix} \dfrac{2{,}042\,x}{y} & \dfrac{1{,}021\,x^2}{y^2} \\[8pt] 5{,}040\,y & 5{,}040\,x \end{bmatrix}` },
            { v: 'B', tex: M`J = \begin{bmatrix} \dfrac{2{,}042\,x}{y} & -\dfrac{1{,}021\,x^2}{y^2} \\[8pt] 5{,}040\,y & 5{,}040\,x \end{bmatrix}` },
            { v: 'C', tex: M`J = \begin{bmatrix} \dfrac{2{,}042\,x}{y} & -\dfrac{1{,}021\,x^2}{y^2} \\[8pt] 5{,}040\,x & 5{,}040\,y \end{bmatrix}` },
            { v: 'D', tex: M`J = \begin{bmatrix} 2{,}042\,x & 4{,}953 \\ 5{,}040\,y & 5{,}040\,x \end{bmatrix}` }
          ],
          desarrollo: [
            { math: M`\frac{\partial}{\partial y}\left(\frac{x^2}{y}\right) = -\frac{x^2}{y^2}` },
            { p: M`La A pierde ese signo menos; la C intercambia las derivadas de $f_2$. La D es el jacobiano correcto <em>de otro sistema</em>: el que resulta de multiplicar la primera ecuación por $y$ ($1{,}021x^2 + 4{,}953y = 0$). Es una reformulación legítima, pero no es la $F$ planteada.` },
            { p: 'En el punto de arranque:' },
            { math: M`J(0{,}3;\,-0{,}03) = \begin{bmatrix} -20{,}42 & -102{,}1 \\ -0{,}1512 & 1{,}512 \end{bmatrix} \qquad F = \begin{Bmatrix} 1{,}890 \\ 0{,}00904 \end{Bmatrix}` }
          ]
        },
        {
          id: 'q2_2', tag: '2.b', tipo: 'num', respuesta: 0.37411, tol: 0.0001,
          enunciado: M`Valor final de $x$ con 4 dígitos.`,
          placeholder: '0,0000',
          desarrollo: [
            {
              table: {
                head: [M`$k$`, M`$x_k$`, M`$y_k$`, M`$\|\Delta X\|_\infty$`, M`$\max_i |\Delta x_i / x_i|$`],
                rows: [
                  ['0', '0,3000000', '−0,03000000', '—', '—'],
                  ['1', '0,3816337', '−0,02781547', '8,163×10⁻²', '2,139×10⁻¹'],
                  ['2', '0,3744181', '−0,02880866', '7,216×10⁻³', '3,448×10⁻²'],
                  ['3', '0,3741142', '−0,02885118', '3,038×10⁻⁴', '1,474×10⁻³'],
                  ['4', '0,3741137', '−0,02885126', '5,042×10⁻⁷', '2,545×10⁻⁶']
                ]
              }
            },
            { p: M`En $k=4$ el cambio relativo es $2{,}5\times10^{-6} < 0{,}5\times10^{-4}$: $x = 0{,}3741$, $y = -0{,}02885$.` },
            { p: 'Control por forma cerrada: multiplicando las dos ecuaciones se elimina $y$,' },
            { math: M`x^3 = \frac{x^2}{y}\cdot xy = \frac{-4{,}953}{1{,}021}\cdot\frac{-0{,}05440}{5{,}040} = 0{,}052362 \;\Longrightarrow\; x = 0{,}374114,\;\; y = -0{,}0288513` },
            { p: 'Si se itera con aritmética de 4 dígitos se llega a lo mismo; a partir de ahí la última cifra de $y$ alterna entre $-0{,}02885$ y $-0{,}02886$ por redondeo.' }
          ]
        },
        {
          id: 'q2_3', tag: '2.c', tipo: 'num', respuesta: -0.028851, tol: 0.000012,
          enunciado: M`Valor final de $y$ con 4 dígitos.`,
          placeholder: '-0,00000',
          desarrollo: [
            { p: M`$y = -0{,}02885$. Ojo con «4 dígitos» en un número chico: son 4 cifras <em>significativas</em> ($2{,}885\times10^{-2}$), no cuatro decimales —con cuatro decimales sería $-0{,}0289$ y sólo tendría 3.` }
          ]
        },
        {
          id: 'q2_4', tag: '2.d', tipo: 'num', respuesta: 4, tol: 0.4,
          enunciado: '¿Cuántas iteraciones hacen falta para cumplir el criterio de corte?',
          placeholder: '0',
          desarrollo: [
            { p: M`En $k=3$ el cambio relativo de $y$ todavía es $1{,}5\times10^{-3}$ (el de $x$, $8\times10^{-4}$): la cuarta cifra se sigue moviendo. En $k = 4$ cae a $2{,}5\times10^{-6}$. Son <strong>4 iteraciones</strong>.` },
            { p: M`El criterio conviene aplicarlo componente a componente: si se usa $\|\Delta X\|_\infty / \|X\|_\infty$, la norma queda dominada por $x \approx 0{,}37$ y la componente chica ($y \approx 0{,}029$) puede tener menos dígitos de los que parece.` }
          ]
        },
        {
          id: 'q2_5', tag: '2.e', tipo: 'mc', correcta: 'A',
          enunciado: M`Si antes de aplicar Newton se multiplica la primera ecuación por $y$ (queda $1{,}021x^2 + 4{,}953y = 0$), ¿qué cambia?`,
          opciones: [
            { v: 'A', html: 'La raíz es la misma, pero la sucesión de iterados no: esa forma es menos alineal y en cada paso queda más cerca de la raíz.' },
            { v: 'B', html: 'Nada: Newton da exactamente la misma sucesión de iterados para cualquier forma equivalente del sistema.' },
            { v: 'C', html: 'Converge a otra raíz, porque multiplicar por $y$ agrega la solución $y=0$.' },
            { v: 'D', html: 'Deja de converger, porque el jacobiano pasa a ser singular.' }
          ],
          desarrollo: [
            { p: M`Newton <strong>no</strong> es invariante frente a reescrituras del sistema: la linealización de $x^2/y$ no es la misma que la de $x^2 + c\,y$. La forma polinómica da:` },
            {
              table: {
                head: [M`$k$`, M`$x_k$`, M`$y_k$`, M`$\max_i |\Delta x_i / x_i|$`],
                rows: [
                  ['1', '0,3779070', '−0,02818814', '2,062×10⁻¹'],
                  ['2', '0,3740977', '−0,02884579', '2,280×10⁻²'],
                  ['3', '0,3741137', '−0,02885126', '1,893×10⁻⁴'],
                  ['4', '0,3741137', '−0,02885126', '4,792×10⁻⁹']
                ]
              }
            },
            { p: M`En $k=3$ el cambio relativo es $1{,}9\times10^{-4}$, contra $1{,}5\times10^{-3}$ de la forma con cociente, y $X^{(3)}$ ya tiene 7 dígitos correctos. Con el criterio componente a componente ambas formas cortan en $k=4$; con $\|\Delta X\|_\infty/\|X\|_\infty$ ($4{,}3\times10^{-5}$) la polinómica cortaría en $k=3$. Multiplicar por $y$ no agrega la raíz $y = 0$ al sistema, porque la segunda ecuación la excluye ($5{,}04\cdot x\cdot 0 \neq -0{,}0544$).` }
          ]
        }
      ]
    },

    /* ===================== PROBLEMA 3 ===================== */
    {
      id: 'p3',
      titulo: 'Newton-Raphson con aritmética de 3 dígitos',
      enunciado: [
        { p: 'Resolver el siguiente sistema de ecuaciones mediante el método de Newton-Raphson:' },
        { math: M`\begin{aligned} 3{,}11\cdot x\cdot(y-1) &= -8{,}73 \\ 0{,}749\cdot x + 1{,}21\cdot y &= -2{,}08 \end{aligned}` },
        { p: M`Trabajar con una precisión de 3 dígitos. Iterar hasta obtener 3 dígitos significativos. Tomar $x_0 = 1$, $y_0 = -2$.` },
        { note: M`Aritmética de $t = 3$ dígitos con redondeo simétrico <em>en cada operación</em>: evaluar $F$, armar $J$, eliminar y sustituir. El orden exacto de las operaciones puede mover la última cifra; los valores aceptados cubren esa variación. Corte: cambio relativo menor que $0{,}5\times10^{-3}$.` }
      ],
      preguntas: [
        {
          id: 'q3_1', tag: '3.a', tipo: 'mc', correcta: 'C',
          enunciado: M`Con $f = 3{,}11\,x(y-1) + 8{,}73$ y $g = 0{,}749x + 1{,}21y + 2{,}08$, ¿cuánto vale $J(x_0, y_0)$?`,
          opciones: [
            { v: 'A', tex: M`\begin{bmatrix} -6{,}22 & 3{,}11 \\ 0{,}749 & 1{,}21 \end{bmatrix}` },
            { v: 'B', tex: M`\begin{bmatrix} 3{,}11 & -9{,}33 \\ 1{,}21 & 0{,}749 \end{bmatrix}` },
            { v: 'C', tex: M`\begin{bmatrix} -9{,}33 & 3{,}11 \\ 0{,}749 & 1{,}21 \end{bmatrix}` },
            { v: 'D', tex: M`\begin{bmatrix} -9{,}33 & -9{,}33 \\ 0{,}749 & 1{,}21 \end{bmatrix}` }
          ],
          desarrollo: [
            { math: M`J(x,y) = \begin{bmatrix} 3{,}11\,(y-1) & 3{,}11\,x \\ 0{,}749 & 1{,}21 \end{bmatrix} \;\Longrightarrow\; J(1;\,-2) = \begin{bmatrix} -9{,}33 & 3{,}11 \\ 0{,}749 & 1{,}21 \end{bmatrix}` },
            { p: M`La A deriva $3{,}11\,xy$ y se olvida del $-1$; la B tiene las columnas intercambiadas. La segunda fila es constante: la segunda ecuación es lineal, y Newton la satisface exactamente desde el primer paso (salvo redondeo).` }
          ]
        },
        {
          id: 'q3_2', tag: '3.b', tipo: 'num', respuesta: 0.853, tol: 0.0015,
          enunciado: M`Valor de $x_1$ (primera iteración, 3 dígitos).`,
          placeholder: '0,000',
          desarrollo: [
            { math: M`F(X_0) = \begin{Bmatrix} 3{,}11\cdot1\cdot(-3) + 8{,}73 \\ 0{,}749 - 2{,}42 + 2{,}08 \end{Bmatrix} = \begin{Bmatrix} -0{,}600 \\ 0{,}409 \end{Bmatrix} \;\xrightarrow{t=3}\; \begin{Bmatrix} -0{,}600 \\ 0{,}410 \end{Bmatrix}` },
            { math: M`m_{21} = \frac{0{,}749}{-9{,}33} = -0{,}0803 \qquad \begin{bmatrix} -9{,}33 & 3{,}11 \\ 0 & 1{,}46 \end{bmatrix}\begin{Bmatrix}\Delta x\\ \Delta y\end{Bmatrix} = \begin{Bmatrix} 0{,}600 \\ -0{,}362 \end{Bmatrix}` },
            { math: M`\Delta y = -0{,}248 \qquad \Delta x = \frac{0{,}600 - 3{,}11\cdot(-0{,}248)}{-9{,}33} = -0{,}147 \qquad X_1 = (0{,}853;\;-2{,}25)` }
          ]
        },
        {
          id: 'q3_3', tag: '3.c', tipo: 'num', respuesta: 0.8629, tol: 0.0015,
          enunciado: M`Valor final de $x$ con 3 dígitos significativos.`,
          placeholder: '0,000',
          desarrollo: [
            {
              table: {
                head: [M`$k$`, M`$x_k$`, M`$y_k$`, M`$\Delta x$`, M`$\Delta y$`, M`$\|X_k - X_{k-1}\|_\infty / \|X_k\|_\infty$`],
                rows: [
                  ['0', '1,00', '−2,00', '—', '—', '—'],
                  ['1', '0,853', '−2,25', '−0,147', '−0,248', '1,1×10⁻¹'],
                  ['2', '0,863', '−2,26', '0,0102', '−0,00631', '4,4×10⁻³'],
                  ['3', '0,862', '−2,26', '−0,000850', '0,000526', '4,4×10⁻⁴']
                ]
              }
            },
            { p: M`La última columna usa la diferencia entre iterados ya redondeados (en $k=3$, $x$ pasa de $0{,}863$ a $0{,}862$: $0{,}001/2{,}26$). En $k=3$ el cambio relativo baja de $0{,}5\times10^{-3}$: se corta con $(0{,}862;\;-2{,}26)$. La solución exacta es $(0{,}862882;\;-2{,}253139)$, que con 3 dígitos es $(0{,}863;\;-2{,}25)$: la aritmética de 3 dígitos deja la última cifra de cada componente errada en una unidad, que es justamente lo esperable.` },
            { p: 'En doble precisión la sucesión es $(0{,}85329;\,-2{,}24720)$, $(0{,}86290;\,-2{,}25315)$, $(0{,}86288;\,-2{,}25314)$: también 3 iteraciones.' },
            { p: 'Se aceptan $0{,}862$ y $0{,}863$.' }
          ]
        },
        {
          id: 'q3_4', tag: '3.d', tipo: 'num', respuesta: -2.2531, tol: 0.008,
          enunciado: M`Valor final de $y$ con 3 dígitos significativos.`,
          placeholder: '-0,00',
          desarrollo: [
            { p: M`Con 3 dígitos de trabajo se obtiene $y = -2{,}26$; el valor exacto es $-2{,}25314$, es decir $-2{,}25$. Se aceptan ambos.` }
          ]
        },
        {
          id: 'q3_5', tag: '3.e', tipo: 'num', respuesta: 3, tol: 0.4,
          enunciado: '¿Cuántas iteraciones hacen falta?',
          placeholder: '0',
          desarrollo: [
            { p: M`Tres. En $k=2$ el cambio relativo todavía es $4{,}4\times10^{-3}$ (se movió la tercera cifra); en $k=3$ ya es $4{,}4\times10^{-4} < 5\times10^{-4}$. En doble precisión el resultado es el mismo: $4{,}3\times10^{-3}$ en $k=2$ y $6{,}7\times10^{-6}$ en $k=3$.` }
          ]
        },
        {
          id: 'q3_6', tag: '3.f', tipo: 'mc', correcta: 'D',
          enunciado: M`¿Qué pasa si, con $t = 3$, se sigue iterando después de $k=3$?`,
          opciones: [
            { v: 'A', html: 'Cada iteración duplica los dígitos correctos, como corresponde a Newton: en $k=4$ se tienen 6.' },
            { v: 'B', html: 'El método diverge, porque el jacobiano se vuelve singular cerca de la raíz.' },
            { v: 'C', html: 'Converge a la otra solución del sistema, $(-5{,}26;\;1{,}53)$.' },
            { v: 'D', html: 'Los iterados se quedan oscilando en la tercera cifra ($0{,}861$ / $0{,}862$, $-2{,}25$ / $-2{,}26$): con 3 dígitos, $F$ ya se calcula como puro ruido de redondeo.' }
          ],
          desarrollo: [
            { p: M`Cerca de la raíz, $F$ se evalúa como diferencia de números casi iguales: $3{,}11\cdot0{,}862\cdot(-3{,}26) = -8{,}74$ contra $8{,}73$. Con 3 dígitos el residuo sale $\pm 0{,}01$ —es el redondeo del producto, no información sobre la raíz— y Newton «corrige» ese ruido:` },
            {
              table: {
                head: [M`$k$`, M`$F_1$`, M`$F_2$`, M`$x_k$`, M`$y_k$`],
                rows: [
                  ['4', '−0,01', '0,00', '0,861', '−2,26'],
                  ['5', '−0,01', '−0,01', '0,862', '−2,25'],
                  ['6', '0,02', '0,01', '0,862', '−2,26'],
                  ['7', '−0,01', '0,00', '0,861', '−2,26']
                ]
              }
            },
            { p: M`La convergencia cuadrática vale en aritmética exacta; con $t$ dígitos el método se estanca en un error del orden de la precisión de trabajo. Por eso el criterio pide 3 dígitos y no más. La otra raíz del sistema, $(-5{,}255;\;1{,}534)$, está lejos del arranque y no interviene.` }
          ]
        }
      ]
    },

    /* ===================== PROBLEMA 4 ===================== */
    {
      id: 'p4',
      titulo: 'Newton vs. Gauss-Seidel no lineal con 3 dígitos',
      enunciado: [
        { p: 'Sea el siguiente sistema de ecuaciones no lineales:' },
        { math: M`\begin{aligned} x_1\cdot x_2^2 &= 11{,}20 \\ x_1 + x_2 &= -1{,}83 \end{aligned}` },
        { ul: [
          M`a) Hallar la solución utilizando el método de Newton-Raphson. Partir de $x_1 = 1$, $x_2 = -3$, y utilizar aritmética de punto flotante con 3 dígitos de precisión.`,
          'b) Volver a hallar la solución con la misma precisión, pero esta vez por el método de Gauss-Seidel no lineal, partiendo de los mismos valores que en el punto a.',
          'c) Justificar el comportamiento oscilatorio observado en el punto anterior en términos del error de redondeo.'
        ] },
        { note: M`Gauss-Seidel no lineal: se despeja una incógnita de cada ecuación y se itera como punto fijo, usando cada valor nuevo apenas se calcula. El despeje no es único, y de él depende que el método converja.` }
      ],
      preguntas: [
        {
          id: 'q4_1', tag: '4.a', tipo: 'mc', correcta: 'B',
          enunciado: M`Jacobiano en el arranque $(1;\,-3)$, con $f_1 = x_1x_2^2 - 11{,}2$ y $f_2 = x_1 + x_2 + 1{,}83$:`,
          opciones: [
            { v: 'A', tex: M`\begin{bmatrix} 9 & -3 \\ 1 & 1 \end{bmatrix}` },
            { v: 'B', tex: M`\begin{bmatrix} 9 & -6 \\ 1 & 1 \end{bmatrix}` },
            { v: 'C', tex: M`\begin{bmatrix} -6 & 9 \\ 1 & 1 \end{bmatrix}` },
            { v: 'D', tex: M`\begin{bmatrix} 9 & 6 \\ 1 & 1 \end{bmatrix}` }
          ],
          desarrollo: [
            { math: M`J = \begin{bmatrix} x_2^2 & 2x_1x_2 \\ 1 & 1 \end{bmatrix} \;\Longrightarrow\; J(1;\,-3) = \begin{bmatrix} 9 & -6 \\ 1 & 1 \end{bmatrix} \qquad F(1;\,-3) = \begin{Bmatrix} -2{,}20 \\ -0{,}170 \end{Bmatrix}` },
            { p: M`La A se olvida del 2 de $\partial(x_2^2)/\partial x_2$; la D pierde el signo de $x_2$; la C intercambia las columnas.` }
          ]
        },
        {
          id: 'q4_2', tag: '4.b', tipo: 'num', respuesta: 1.21, tol: 0.003,
          enunciado: M`Newton con 3 dígitos: valor final de $x_1$.`,
          placeholder: '0,00',
          desarrollo: [
            { math: M`m_{21} = \frac{1}{9} = 0{,}111 \qquad \begin{bmatrix} 9 & -6 \\ 0 & 1{,}67 \end{bmatrix}\begin{Bmatrix}\Delta x_1\\ \Delta x_2\end{Bmatrix} = \begin{Bmatrix} 2{,}20 \\ -0{,}0740 \end{Bmatrix} \;\Longrightarrow\; \Delta x_2 = -0{,}0443,\;\; \Delta x_1 = 0{,}214` },
            {
              table: {
                head: [M`$k$`, M`$x_1$`, M`$x_2$`, M`$F_1$`, M`$F_2$`, M`$\|\Delta X\|_\infty$`],
                rows: [
                  ['0', '1,00', '−3,00', '−2,20', '−0,170', '—'],
                  ['1', '1,21', '−3,04', '0,00', '0,00', '0,214'],
                  ['2', '1,21', '−3,04', '—', '—', '0']
                ]
              }
            },
            { p: M`Con 3 dígitos, $1{,}21\cdot(-3{,}04)^2 = 1{,}21\cdot9{,}24 = 11{,}2$: el residuo da exactamente cero y la segunda iteración ya no mueve nada. <strong>Una iteración</strong> alcanza, y la segunda lo confirma. La solución exacta es $(1{,}211064;\;-3{,}041064)$.` }
          ]
        },
        {
          id: 'q4_3', tag: '4.c', tipo: 'num', respuesta: -3.04, tol: 0.003,
          enunciado: M`Newton con 3 dígitos: valor final de $x_2$.`,
          placeholder: '-0,00',
          desarrollo: [
            { p: M`$x_2 = -3{,}04$. Control: $x_1 + x_2 = 1{,}21 - 3{,}04 = -1{,}83$ ✓. En doble precisión Newton da $(1{,}21467;\,-3{,}04467)$, $(1{,}21107;\,-3{,}04107)$, $(1{,}21106;\,-3{,}04106)$, con $p \to 2$.` }
          ]
        },
        {
          id: 'q4_4', tag: '4.d', tipo: 'mc', correcta: 'A',
          enunciado: 'Para Gauss-Seidel no lineal, ¿qué despeje conviene usar?',
          opciones: [
            { v: 'A', tex: M`\begin{gathered}x_1^{(k+1)} = \frac{11{,}2}{\left(x_2^{(k)}\right)^2} \\[6pt] x_2^{(k+1)} = -1{,}83 - x_1^{(k+1)} \end{gathered}` },
            { v: 'B', tex: M`\begin{gathered}x_1^{(k+1)} = -1{,}83 - x_2^{(k)} \\[6pt] x_2^{(k+1)} = -\sqrt{\frac{11{,}2}{x_1^{(k+1)}}} \end{gathered}` },
            { v: 'C', html: 'Cualquiera de los dos: Gauss-Seidel converge siempre que la solución exista.' },
            { v: 'D', html: 'Ninguno: Gauss-Seidel no lineal sólo converge si el sistema es diagonalmente dominante.' }
          ],
          desarrollo: [
            { p: M`Encadenando las dos asignaciones, cada despeje es un punto fijo en una sola variable, y converge si $|g'| < 1$ en la raíz ($x_1^* = 1{,}2111$, $x_2^* = -3{,}0411$):` },
            { math: M`\text{A:}\quad x_2 \leftarrow g(x_2) = -1{,}83 - \frac{11{,}2}{x_2^2}, \qquad g'(x_2^*) = \frac{22{,}4}{\left(x_2^*\right)^3} = -0{,}80` },
            { math: M`\text{B:}\quad x_1 \leftarrow h(x_1) = -1{,}83 + \sqrt{\frac{11{,}2}{x_1}}, \qquad h'(x_1^*) = -\frac{\sqrt{11{,}2}}{2\left(x_1^*\right)^{3/2}} = -1{,}26` },
            { p: M`El despeje A converge (lentamente, $|g'| = 0{,}80$); el B diverge: sus iterados en doble precisión se alejan alternando, $x_1 = 1{,}170;\;1{,}264;\;1{,}147;\;1{,}295;\;1{,}111;\;1{,}346\ldots$ Como en el caso lineal, la convergencia depende del «reordenamiento», y el criterio es la derivada (el radio espectral) de la función de iteración, no la forma del sistema.` }
          ]
        },
        {
          id: 'q4_5', tag: '4.e', tipo: 'mc', correcta: 'B',
          enunciado: M`Con el despeje que converge y aritmética de 3 dígitos, ¿qué sucesión se obtiene para $x_1$?`,
          opciones: [
            { v: 'A', html: 'Converge a $x_1 = 1{,}21$ en 5 iteraciones y se queda ahí.' },
            { v: 'B', html: 'Arranca $1{,}24;\\;1{,}19;\\;1{,}23;\\;1{,}20;\\;1{,}22$ y después alterna para siempre entre $1{,}20$ y $1{,}22$.' },
            { v: 'C', html: 'Crece monótonamente hasta $1{,}21$.' },
            { v: 'D', html: 'Alterna con amplitud creciente: el método diverge.' }
          ],
          desarrollo: [
            {
              table: {
                head: [M`$k$`, M`$\text{fl}\big(x_2^2\big)$`, M`$x_1 = \text{fl}\big(11{,}2 / x_2^2\big)$`, M`$x_2 = \text{fl}(-1{,}83 - x_1)$`, 'exacto: $x_1$'],
                rows: [
                  ['1', '9,00', '1,24', '−3,07', '1,244444'],
                  ['2', '9,42', '1,19', '−3,02', '1,184908'],
                  ['3', '9,12', '1,23', '−3,06', '1,232168'],
                  ['4', '9,36', '1,20', '−3,03', '1,194428'],
                  ['5', '9,18', '1,22', '−3,05', '1,224423'],
                  ['6', '9,30', '1,20', '−3,03', '1,200493'],
                  ['7', '9,18', '1,22', '−3,05', '1,219527'],
                  ['8', '9,30', '1,20', '−3,03', '1,204351']
                ]
              }
            },
            { p: M`Desde $k=4$ la sucesión con 3 dígitos queda atrapada en el ciclo $(1{,}20;\,-3{,}03) \leftrightarrow (1{,}22;\,-3{,}05)$ y nunca llega a $(1{,}21;\,-3{,}04)$. En aritmética exacta sí converge, pero oscilando y despacio: el error se reduce sólo un 20 % por paso, y hacen falta unas 40 iteraciones para $\Delta < 10^{-5}$.` }
          ]
        },
        {
          id: 'q4_6', tag: '4.f', tipo: 'num', respuesta: 0.8, tol: 0.03,
          enunciado: M`Factor de contracción $|g'(x_2^*)|$ de la iteración de Gauss-Seidel (despeje A).`,
          placeholder: '0,00',
          desarrollo: [
            { math: M`|g'(x_2^*)| = \left|\frac{22{,}4}{(-3{,}0411)^3}\right| = 0{,}796` },
            { p: M`El signo negativo de $g'$ es el que produce la <em>oscilación</em>: el error cambia de signo en cada paso. El módulo cercano a 1 es el que hace la convergencia lenta. Es convergencia lineal con $\lambda \approx 0{,}80$ (frente a $p = 2$ de Newton).` }
          ]
        },
        {
          id: 'q4_7', tag: '4.g', tipo: 'mc', correcta: 'C',
          enunciado: 'Justificación del comportamiento oscilatorio en términos del error de redondeo (inciso c):',
          opciones: [
            { v: 'A', html: 'El redondeo hace que $|g\'|$ supere 1, y por eso el método diverge lentamente.' },
            { v: 'B', html: 'La oscilación es sólo del método (por $g\' < 0$); el redondeo no tiene nada que ver.' },
            { v: 'C', html: 'Cada paso achica el error apenas un factor $0{,}8$, y el redondeo introduce hasta $\\delta = 0{,}005$ por paso. Cuando el error es de una unidad del último dígito, la reducción ($\\approx 0{,}002$) es menor que el redondeo y el iterado salta de un lado al otro de la raíz sin acercarse: se forma un ciclo.' },
            { v: 'D', html: 'El jacobiano calculado con 3 dígitos es singular, y el método no puede avanzar.' }
          ],
          desarrollo: [
            { p: M`El ciclo se ve operación por operación:` },
            { math: M`\begin{aligned} x_2 = -3{,}03 &\to x_2^2 = 9{,}1809 \xrightarrow{t=3} 9{,}18 \to x_1 = 1{,}22004 \xrightarrow{t=3} 1{,}22 \to x_2 = -3{,}05 \\ x_2 = -3{,}05 &\to x_2^2 = 9{,}3025 \xrightarrow{t=3} 9{,}30 \to x_1 = 1{,}20430 \xrightarrow{t=3} 1{,}20 \to x_2 = -3{,}03 \end{aligned}` },
            { p: M`El punto fijo con redondeo cumple $|e_{k+1}| \le L\,|e_k| + \delta$, con $L = 0{,}8$ y $\delta$ el error de redondeo por paso ($0{,}005$ en $x_1 \approx 1{,}2$). El error sólo baja mientras $L|e_k| + \delta < |e_k|$, es decir, hasta:` },
            { math: M`|e| \approx \frac{\delta}{1-L} = \frac{0{,}005}{1-0{,}8} = 0{,}025` },
            { p: M`Por debajo de ese nivel el método ya no puede mejorar: los iterados quedan saltando dentro de una banda de un par de unidades del último dígito, alternando de lado porque $g' < 0$. Con $L$ cercano a 1 la banda es <em>cinco veces</em> el error de redondeo. Newton, con convergencia cuadrática, no sufre esto: su error queda al nivel de $\delta$ y en el punto a) llega a $(1{,}21;\,-3{,}04)$ en un paso.` }
          ]
        }
      ]
    },

    /* ===================== PROBLEMA 5 ===================== */
    {
      id: 'p5',
      titulo: 'Newton con jacobiano actualizado y fijo (3×3)',
      enunciado: [
        { p: 'Sea el sistema no lineal:' },
        { math: M`\begin{aligned} x_1\cdot x_2\cdot x_3 &= 4{,}188 \\ x_1 + x_2 + x_3 &= 3{,}677 \\ x_1 + 1{,}258\cdot x_2 &= 0 \end{aligned}` },
        { ul: [
          M`a) Resolverlo por el método de Newton-Raphson, partiendo de $X^{(0)} = [1;\;-1;\;3]$ con 3 iteraciones.`,
          'b) Ídem punto a), sin actualizar la matriz de coeficientes.',
          'c) Mostrar que el orden de convergencia es de aproximadamente 0,5.'
        ] },
        { note: M`<strong>Posible errata en el enunciado.</strong> Tal como está escrito ($x_1x_2x_3 = +4{,}188$), la única solución real es $(18{,}01;\;-14{,}31;\;-0{,}016)$, muy lejos de $X^{(0)}$, y Newton no converge desde ahí (ver 5.h). Con $x_1x_2x_3 = -4{,}188$ el sistema tiene la solución $(1{,}2407;\;-0{,}9863;\;3{,}4225)$ al lado del arranque —en $X^{(0)}$ el producto vale $-3$— y el inciso c) da exactamente el «≈ 0,5» de la guía. <strong>Las preguntas 5.a a 5.g usan $-4{,}188$.</strong>` }
      ],
      preguntas: [
        {
          id: 'q5_1', tag: '5.a', tipo: 'mc', correcta: 'D',
          enunciado: M`Jacobiano del sistema y su valor en $X^{(0)} = (1;\,-1;\,3)$:`,
          opciones: [
            { v: 'A', tex: M`\begin{gathered}J = \begin{bmatrix} x_1 & x_2 & x_3 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix} \\[6pt] J(X^{(0)}) = \begin{bmatrix} 1 & -1 & 3 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix} \end{gathered}` },
            { v: 'B', tex: M`\begin{gathered}J = \begin{bmatrix} x_2x_3 & x_1x_3 & x_1x_2 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 1 \end{bmatrix} \\[6pt] J(X^{(0)}) = \begin{bmatrix} -3 & 3 & -1 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 1 \end{bmatrix} \end{gathered}` },
            { v: 'C', tex: M`\begin{gathered}J = \begin{bmatrix} x_2x_3 & x_1x_3 & x_1x_2 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix} \\[6pt] J(X^{(0)}) = \begin{bmatrix} 3 & -3 & 1 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix} \end{gathered}` },
            { v: 'D', tex: M`\begin{gathered}J = \begin{bmatrix} x_2x_3 & x_1x_3 & x_1x_2 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix} \\[6pt] J(X^{(0)}) = \begin{bmatrix} -3 & 3 & -1 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix} \end{gathered}` }
          ],
          desarrollo: [
            { math: M`J(1;\,-1;\,3) = \begin{bmatrix} (-1)(3) & (1)(3) & (1)(-1) \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix} = \begin{bmatrix} -3 & 3 & -1 \\ 1 & 1 & 1 \\ 1 & 1{,}258 & 0 \end{bmatrix}` },
            { p: M`La C tiene los signos de la primera fila invertidos; la B pone un 1 en $\partial f_3/\partial x_3$, pero la tercera ecuación no depende de $x_3$. El jacobiano no depende de las constantes del lado derecho: es el mismo con $+4{,}188$ o $-4{,}188$. Con $-4{,}188$:` },
            { math: M`F(X^{(0)}) = \begin{Bmatrix} -3 + 4{,}188 \\ 3 - 3{,}677 \\ 1 - 1{,}258 \end{Bmatrix} = \begin{Bmatrix} 1{,}188 \\ -0{,}677 \\ -0{,}258 \end{Bmatrix}` }
          ]
        },
        {
          id: 'q5_2', tag: '5.b', tipo: 'num', respuesta: 1.240706, tol: 0.0003,
          enunciado: M`Newton completo (jacobiano actualizado): $x_1^{(3)}$.`,
          placeholder: '0,00000',
          desarrollo: [
            {
              table: {
                head: [M`$k$`, M`$x_1$`, M`$x_2$`, M`$x_3$`, M`$\|\Delta X\|_\infty$`, M`$\|\Delta X\|_\infty/\|X\|_\infty$`],
                rows: [
                  ['0', '1,000000', '−1,000000', '3,000000', '—', '—'],
                  ['1', '1,257035', '−0,999233', '3,419198', '4,192×10⁻¹', '1,226×10⁻¹'],
                  ['2', '1,240800', '−0,986327', '3,422528', '1,624×10⁻²', '4,744×10⁻³'],
                  ['3', '1,240706', '−0,986253', '3,422547', '9,369×10⁻⁵', '2,738×10⁻⁵']
                ]
              }
            },
            { p: M`Con tres iteraciones: $X^{(3)} = (1{,}24071;\;-0{,}98625;\;3{,}42255)$, que ya coincide con la solución en 5 dígitos (la cuarta iteración cambia $3\times10^{-9}$).` },
            { p: 'Con esas tres diferencias:' },
            { math: M`p = \frac{\ln\left(9{,}369\times10^{-5}/1{,}624\times10^{-2}\right)}{\ln\left(1{,}624\times10^{-2}/4{,}192\times10^{-1}\right)} = 1{,}59` },
            { p: M`y con la terna siguiente $p = 2{,}00$: convergencia cuadrática.` }
          ]
        },
        {
          id: 'q5_3', tag: '5.c', tipo: 'num', respuesta: 3.422547, tol: 0.0001,
          enunciado: M`Newton completo: $x_3^{(3)}$.`,
          placeholder: '0,00000',
          desarrollo: [
            { p: M`$x_3^{(3)} = 3{,}42255$. Control: $1{,}24071 - 0{,}98625 + 3{,}42255 = 3{,}67701$ ✓ y $1{,}24071\cdot(-0{,}98625)\cdot3{,}42255 = -4{,}1880$ ✓.` }
          ]
        },
        {
          id: 'q5_4', tag: '5.d', tipo: 'num', respuesta: 1.241789, tol: 0.0003,
          enunciado: M`Con el jacobiano fijo en $J(X^{(0)})$ (sin actualizar): $x_1^{(3)}$.`,
          placeholder: '0,00000',
          desarrollo: [
            { p: M`Se factoriza $J(X^{(0)})$ una sola vez (por ejemplo en $LU$) y en cada paso sólo se reevalúa $F$: $J(X^{(0)})\,\Delta X = -F(X^{(k)})$. Cada iteración es mucho más barata, pero se pierde la convergencia cuadrática.` },
            {
              table: {
                head: [M`$k$`, M`$x_1$`, M`$x_2$`, M`$x_3$`, M`$\|\Delta X\|_\infty$`],
                rows: [
                  ['0', '1,000000', '−1,000000', '3,000000', '—'],
                  ['1', '1,257035', '−0,999233', '3,419198', '4,192×10⁻¹'],
                  ['2', '1,236425', '−0,982850', '3,423425', '2,061×10⁻²'],
                  ['3', '1,241789', '−0,987114', '3,422325', '5,365×10⁻³']
                ]
              }
            },
            { p: M`La primera iteración es idéntica a la de Newton (usa el mismo $J$). A partir de ahí los iterados oscilan alrededor de la raíz y $X^{(3)}$ tiene apenas 3 dígitos correctos, contra los 6 de Newton completo.` }
          ]
        },
        {
          id: 'q5_5', tag: '5.e', tipo: 'num', respuesta: -0.987114, tol: 0.0002,
          enunciado: M`Con el jacobiano fijo: $x_2^{(3)}$.`,
          placeholder: '-0,00000',
          desarrollo: [
            { p: M`$x_2^{(3)} = -0{,}98711$, contra $-0{,}98625$ de la solución: el error es $8{,}6\times10^{-4}$.` }
          ]
        },
        {
          id: 'q5_6', tag: '5.f', tipo: 'num', respuesta: 0.447, tol: 0.06,
          enunciado: M`Orden de convergencia estimado con las tres diferencias del inciso b) (norma infinito).`,
          ayuda: M`$p = \ln(\Delta_3/\Delta_2)\,/\,\ln(\Delta_2/\Delta_1)$.`,
          placeholder: '0,00',
          desarrollo: [
            { math: M`p = \frac{\ln\left(5{,}365\times10^{-3} / 2{,}061\times10^{-2}\right)}{\ln\left(2{,}061\times10^{-2} / 4{,}192\times10^{-1}\right)} = \frac{\ln(0{,}2603)}{\ln(0{,}04917)} = \frac{-1{,}346}{-3{,}013} = 0{,}447` },
            { p: M`Éste es el «aproximadamente 0,5» que pide mostrar la guía. Con norma 2 da $0{,}462$ y con norma 1, $0{,}481$. Se aceptan valores entre 0,39 y 0,51.` }
          ]
        },
        {
          id: 'q5_7', tag: '5.g', tipo: 'mc', correcta: 'B',
          enunciado: M`¿Cómo hay que interpretar ese $p \approx 0{,}5$?`,
          opciones: [
            { v: 'A', html: 'Es el orden real del método: con el jacobiano fijo la convergencia es sublineal y cada paso gana medio dígito.' },
            { v: 'B', html: 'Es un artefacto de estimar con los primeros pasos, todavía lejos del régimen asintótico. Si se sigue iterando, $p \\to 1$: el jacobiano fijo da convergencia <strong>lineal</strong>, con $\\lambda \\approx 0{,}25$.' },
            { v: 'C', html: 'Indica que el método diverge: todo $p < 1$ implica divergencia.' },
            { v: 'D', html: 'Es la mitad del orden de Newton porque se hace la mitad de trabajo por iteración.' }
          ],
          desarrollo: [
            { p: 'Siguiendo la iteración con jacobiano fijo:' },
            {
              table: {
                head: [M`$k$`, M`$\|\Delta X\|_\infty$`, M`$p$`, M`$\lambda$`],
                rows: [
                  ['3', '5,365×10⁻³', '0,447', '—'],
                  ['4', '1,360×10⁻³', '1,020', '0,281'],
                  ['5', '3,472×10⁻⁴', '0,995', '0,247'],
                  ['6', '8,846×10⁻⁵', '1,001', '0,258'],
                  ['8', '5,749×10⁻⁶', '1,000', '0,255'],
                  ['10', '3,736×10⁻⁷', '1,000', '0,255']
                ]
              }
            },
            { p: M`Con el jacobiano congelado, el método es un punto fijo $X \leftarrow X - J_0^{-1}F(X)$, cuya matriz de iteración en la raíz es $T = I - J_0^{-1}J(X^*)$. Por lo visto en la Guía 3, converge linealmente con $\lambda = \rho(T)$:` },
            { math: M`\rho\left(I - J(X^{(0)})^{-1}J(X^*)\right) = 0{,}2549` },
            { p: M`Coincide con el $\lambda$ experimental. El $0{,}45$ del primer trío sale de que el primer paso (idéntico al de Newton) reduce mucho el error y el segundo casi nada: la fórmula mezcla dos regímenes. Con sólo tres iteraciones no hay forma de ver el orden asintótico. Un $p<1$ tampoco significa divergencia: la sucesión converge.` }
          ]
        },
        {
          id: 'q5_8', tag: '5.h', tipo: 'mc', correcta: 'C',
          enunciado: M`Con el enunciado <em>literal</em> ($x_1x_2x_3 = +4{,}188$), ¿qué ocurre desde $X^{(0)} = (1;\,-1;\,3)$?`,
          opciones: [
            { v: 'A', html: 'Converge igual a $(1{,}24;\\;-0{,}99;\\;3{,}42)$: la constante del lado derecho no afecta a Newton.' },
            { v: 'B', html: 'Converge cuadráticamente a $(18{,}01;\\;-14{,}31;\\;-0{,}016)$ en 3 iteraciones.' },
            { v: 'C', html: 'No converge: la única solución real está en $(18{,}01;\\;-14{,}31;\\;-0{,}016)$, lejos del arranque. Newton completo deambula sin acercarse, y con el jacobiano fijo diverge.' },
            { v: 'D', html: 'El jacobiano es singular en $X^{(0)}$ y no se puede dar ni un paso.' }
          ],
          desarrollo: [
            { p: M`Usando la tercera ecuación ($x_1 = -1{,}258\,x_2$) y la segunda ($x_3 = 3{,}677 + 0{,}258\,x_2$), la primera queda una cúbica en $x_2$:` },
            { math: M`-1{,}258\,x_2^2\,(3{,}677 + 0{,}258\,x_2) = 4{,}188` },
            { p: M`Para que el lado izquierdo sea positivo hace falta $x_2 < -14{,}25$: la única raíz real es $x_2 = -14{,}315$, con $x_1 = 18{,}008$ y $x_3 = -0{,}0162$ (las otras dos son complejas). Desde $X^{(0)}$:` },
            {
              table: {
                head: ['', M`$X^{(1)}$`, M`$X^{(2)}$`, M`$X^{(3)}$`],
                rows: [
                  ['Newton', '(−0,360; 0,286; 3,751)', '(1,750; −1,391; 3,318)', '(0,345; −0,274; 3,606)'],
                  ['J fijo', '(−0,360; 0,286; 3,751)', '(−1,243; 0,988; 3,932)', '(−2,984; 2,372; 4,289)']
                ]
              }
            },
            { p: M`Las diferencias no decrecen ($1{,}36$; $2{,}11$; $1{,}40$) y el «orden» que da la fórmula es negativo ($p = -0{,}93$). Con el jacobiano fijo los iterados se disparan (en $k=6$ ya valen $\sim 10^4$). En $X^{(0)}$ el producto vale $-3$, cerca de $-4{,}188$ y no de $+4{,}188$: de ahí que el signo del enunciado se interprete como errata.` }
          ]
        }
      ]
    }
  ]
};
