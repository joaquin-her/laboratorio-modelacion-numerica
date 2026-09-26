# Apunte — Guía 2: Ecuaciones No Lineales (ENL)

**95.13 Métodos Matemáticos y Numéricos — FIUBA**

Objetivo: hallar $\alpha$ tal que $f(\alpha) = 0$ cuando no se puede despejar $x$.

| Familia | Métodos | Propiedad |
|---|---|---|
| **De arranque** (encierran la raíz) | Bisección, Regula-Falsi | Siempre convergen si $f(a)\,f(b) < 0$. Son lentos. |
| **De convergencia** (abiertos) | Punto fijo, Newton-Raphson, Secante | Son rápidos, pero **no siempre convergen**. Necesitan arrancar cerca de la raíz. |

Estrategia típica: usar un método de arranque para acercarse a la raíz y después afinar con uno de convergencia.

---

## 0. Errores, tolerancias y cómo expresar el resultado

### Tipos de error

| Nombre | Fórmula | Cuándo se usa |
|---|---|---|
| Error absoluto (verdadero) | $\varepsilon_k = \lvert x_k - \alpha\rvert$ | Sólo si se conoce $\alpha$ (Problema 2d) |
| Diferencia entre pasos | $\Delta x_k = \lvert x_k - x_{k-1}\rvert$ | **Estimador práctico del error** |
| Error relativo entre pasos | $\dfrac{\Delta x_k}{\lvert x_k\rvert}$ | Cuando la tolerancia es "relativa" o "en %" |
| Residuo | $\lvert f(x_k)\rvert$ | Criterio complementario. Puede engañar si $f'$ es muy chica o muy grande. |

- **Tolerancia absoluta** $\varepsilon$: se corta cuando $\Delta x_k < \varepsilon$.
- **Tolerancia relativa** (por ejemplo 1 % o $10^{-10}$): se corta cuando $\Delta x_k / \lvert x_k\rvert < \text{tol}$.
- "$n$ **dígitos significativos**" equivale a un error relativo $\lesssim 5\cdot 10^{-n}$.
- "$n$ **decimales correctos**" equivale a un error absoluto $\le 0{,}5\cdot 10^{-n}$.

### Expresión del resultado (como en clase)

El resultado se da como $x = \bar{x} \pm \Delta x$. La cota se redondea **hacia arriba** a una cifra significativa, y $\bar x$ se redondea a la misma posición decimal.

> Ejemplo de la clase: $m = 1{,}94375 \pm 0{,}03125 \;\Rightarrow\; m = 1{,}94 \pm 0{,}04$

---

## 1. Localizar y aislar la raíz (paso previo obligatorio)

1. **Existencia (Bolzano):** si $f$ es continua en $[a,b]$ y $f(a)\,f(b) < 0$, entonces hay **al menos una** raíz en $(a,b)$.
2. **Unicidad:** Bolzano **no alcanza** para asegurar que la raíz es una sola (pregunta del Problema 2a). Hace falta además que $f$ sea **monótona** en $[a,b]$, es decir que $f'$ no cambie de signo.
3. **Técnica gráfica:** reescribir $f(x)=0$ como $h_1(x) = h_2(x)$ y ver dónde se cortan las dos curvas. Por ejemplo:
   - $x\cos x = \ln x$ → cortar $y = x\cos x$ con $y = \ln x$
   - $\tfrac{x^2}{4} = \operatorname{sen} x$ → parábola contra seno
   - $e^{-2x} = 1-x$ → exponencial contra recta. **Ojo:** $x=0$ es raíz trivial, y la guía pide la no nula.
4. **Cuidado con el dominio:** $\ln x$ y $\sqrt{x}$ no están definidas para $x<0$, y $\ln x$ tampoco en $0$. Por eso algunos intervalos no se pueden usar para arrancar.

---

## 2. Método de Bisección

### Algoritmo

Partiendo de $[a_0, b_0]$ con $f(a_0)\,f(b_0) < 0$:

$$m_{k+1} = \frac{a_k + b_k}{2}$$

- Si $f(a_k)\,f(m_{k+1}) < 0$, la raíz está a la izquierda: $b_{k+1} = m_{k+1}$ y $a_{k+1} = a_k$.
- Si no, está a la derecha: $a_{k+1} = m_{k+1}$ y $b_{k+1} = b_k$.

Columnas de la tabla de la cátedra: $k$, $a_k$, $b_k$, $m_{k+1}$, $f(a_k)$, $f(b_k)$, $f(m_{k+1})$, $\Delta m_{k+1}$, $\Delta m/m$.

::grafico[biseccion]{Bisección desde $[1{,}6;\ 2{,}6]$. Cada renglón es una iteración: el intervalo se parte al medio y se queda con la mitad donde $F$ cambia de signo. La raíz $\alpha$ (línea punteada) nunca sale del intervalo, y el ancho $\Delta m$ se reduce a la mitad por paso.}

### Cota del error (se conoce de antemano)

$$|m_{k+1} - \alpha| \le \Delta m_{k+1} = \frac{b_k - a_k}{2} = \frac{b_0 - a_0}{2^{k+1}}$$

### Número de iteraciones para una tolerancia absoluta $\varepsilon$

$$\frac{b_0 - a_0}{2^{k+1}} < \varepsilon \quad\Longrightarrow\quad k + 1 > \frac{\ln\!\big[(b_0 - a_0)/\varepsilon\big]}{\ln 2}$$

> Ejemplo de la clase: con $[1{,}6;\ 2{,}6]$ y $\varepsilon = 0{,}02$ queda $k > 4{,}64$, o sea **5 iteraciones**.
>
> Es el **único** método en el que el número de iteraciones se puede anticipar.

- **Con tolerancia relativa** (Problema 2c) no hay fórmula cerrada, porque se divide por $m$, que va cambiando. Se itera hasta que $\Delta m / m <$ tol.

### Convergencia

- **Orden** $p = 1$ y **constante asintótica** $\lambda = 0{,}5$ exactas: cada paso reduce la cota a la mitad.
- Para ganar un decimal hacen falta $\log_2 10 \approx 3{,}3$ iteraciones.
- El error verdadero $|m_k - \alpha|$ **no decrece de forma monótona**: a veces el punto medio cae casualmente muy cerca de la raíz y después se vuelve a alejar (Problema 2d). Lo que decrece de forma monótona es la **cota**.
- Ventajas: siempre converge y sólo pide que $f$ sea continua. Desventaja: es lento (en la clase necesitó 17 iteraciones para 5 decimales).

::grafico[biseccion-cota]{Escala logarítmica. La cota $\Delta m_{k+1} = (b_0-a_0)/2^{k+1}$ es una recta: por eso se puede despejar $k$. Cruza $\varepsilon = 0{,}02$ en $k=5$ y $0{,}5\cdot10^{-5}$ en $k=17$, como en la clase. El error verdadero (círculos huecos) queda siempre debajo, pero sube y baja.}

---

## 3. Regula-Falsi (Posición Falsa)

Igual que bisección, pero en lugar del punto medio se usa el corte con el eje $x$ de la recta que une $(a_k, f(a_k))$ con $(b_k, f(b_k))$:

$$m_{k+1} = a_k - f(a_k)\,\frac{b_k - a_k}{f(b_k) - f(a_k)}$$

- Siempre converge porque mantiene el encierro de la raíz.
- En general tiene $p \approx 1$ y suele ser más rápida que bisección (en la clase, $\lambda\approx 0{,}25$ y $N = 8$).
- Si $f$ es muy convexa, un extremo queda fijo y el método se vuelve lento.

---

## 4. Método de Punto Fijo

### Idea

Se reescribe $f(x) = 0$ como $x = g(x)$. Un **punto fijo** $x_p$ cumple $g(x_p) = x_p$, y entonces $f(x_p) = 0$.

Forma general: $g(x) = x - \phi(x)\,f(x)$ con $\phi(x) \neq 0$. Con $\phi = 1$ queda $g(x) = x - f(x)$.

La iteración es:

$$x_{k+1} = g(x_k)$$

Hay **muchas** $g$ posibles para una misma $f$, y no todas convergen. Por ejemplo, para $\tfrac{x^2}{4} - \operatorname{sen}x = 0$:

- $g(x) = x - \left(\tfrac{x^2}{4} - \operatorname{sen} x\right)$
- $g(x) = 2\sqrt{\operatorname{sen} x}$

### Teoremas (lo que se pide justificar en el Problema 3a)

Sea $g$ continua en $[a,b]$:

1. **Existencia:** si $g([a,b]) \subseteq [a,b]$, es decir $a \le g(x) \le b$ para todo $x\in[a,b]$, entonces $g$ tiene al menos un punto fijo en $[a,b]$.
2. **Unicidad y convergencia:** si además $|g'(x)| \le L < 1$ para todo $x \in [a,b]$, el punto fijo es **único** y la iteración **converge** desde **cualquier** $x_0 \in [a,b]$.

Para verificarlo en la práctica:

- **Gráficamente:** en $[a,b]$, la curva de $g$ tiene que quedar dentro del cuadrado $[a,b]\times[a,b]$, y la de $g'$ dentro de la franja $(-1, 1)$. La clase lo ilustra con $[1{,}6;\ 2{,}6]$, que no cumple, y $[1{,}6;\ 2{,}4]$, que sí.
- **Analíticamente:** $g$ monótona alcanza sus extremos en los bordes, así que alcanza con evaluar $g(a)$ y $g(b)$. Para $\max|g'|$ se buscan los extremos de $g'$ con $g''=0$, o se leen del gráfico.

### Cota de error a posteriori

$$|x_k - \alpha| \le \frac{L}{1-L}\,|x_k - x_{k-1}|$$

Si $L$ está cerca de 1, un $\Delta x$ chico **no** garantiza un error chico.

### Orden de convergencia

Por Taylor alrededor de $\alpha$: $\;x_{k+1} - \alpha = g'(\xi)(x_k - \alpha)$.

- Si $g'(\alpha) \ne 0$: $\;p = 1$ y $\lambda = |g'(\alpha)|$ (lineal).
- Si $g'(\alpha) = 0$ y $g''(\alpha)\neq 0$: $\;p = 2$ y $\lambda = \tfrac{|g''(\alpha)|}{2}$ (es el caso de Newton).
- **Signo de $g'(\alpha)$:**
  - Si es positivo, la convergencia es monótona (en escalera).
  - Si es negativo, es oscilante (en espiral): los iterados quedan alternadamente de un lado y del otro de $\alpha$.

> Verificación con la clase: $g'(x) = 1 - \left(\tfrac{x}{2} - \cos x\right)$ da $g'(1{,}93375) \approx -0{,}322$. Coincide con el $\lambda \approx 0{,}32$ de la tabla, y el signo negativo explica la oscilación.

::grafico[punto-fijo]{Telaraña de $g(x) = x - (\tfrac{x^2}{4} - \operatorname{sen}x)$ desde $x_0 = 1{,}6$: desde cada $x_k$ se sube hasta la curva $g$ y se pasa en horizontal a la recta $y=x$, que da $x_{k+1}$. Como $g'(\alpha)\approx-0{,}32$, los iterados caen alternadamente a cada lado de $\alpha$ y la espiral se cierra.}

::grafico[punto-fijo-divergente]{Misma ecuación con $\phi = 2$, o sea $g(x) = x - 2(\tfrac{x^2}{4} - \operatorname{sen}x)$: ahora $|g'(\alpha)|\approx1{,}64 > 1$ y la espiral se abre aunque $x_0 = 1{,}9$ arranca pegado a la raíz. No toda $g$ sirve.}

**Para el Problema 3c** no hace falta iterar hasta el final: alcanza con calcular $\lambda = |g'(\alpha)|$ en la raíz hallada. Además, el valor experimental tiene que coincidir con ese.

---

## 5. Método de Newton-Raphson

### Deducción

Se aproxima $f$ por su recta tangente en $x_k$ y se busca dónde corta el eje:

$$0 = f(x_k) + f'(x_k)(x_{k+1} - x_k) \quad\Longrightarrow\quad \boxed{x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)}}$$

Es un caso particular de punto fijo, con $g(x) = x - \dfrac{f(x)}{f'(x)}$, o sea $\phi = 1/f'$.

::grafico[newton]{Newton desde $x_0 = 1{,}6$ (tabla de la clase): cada tangente corta el eje en el iterado siguiente, $2{,}03364 \to 1{,}93856 \to 1{,}93377$. Cerca de la raíz la curva se parece tanto a su tangente que en el tercer paso ya no se distinguen.}

### Por qué converge cuadráticamente

Derivando la $g$ de Newton:

$$g'(x) = \frac{f(x)\,f''(x)}{[f'(x)]^2}$$

En la raíz $f(\alpha) = 0$, así que $g'(\alpha) = 0$ y el orden es $p = 2$. Esto vale si la raíz es **simple**, es decir si $f'(\alpha)\neq 0$. La constante asintótica es:

$$\lambda = \left|\frac{f''(\alpha)}{2 f'(\alpha)}\right|$$

> En la clase: $\lambda \approx 0{,}543$, y la tabla da $0{,}49 \to 0{,}52 \to 0{,}54$.
>
> **Regla práctica:** con $p=2$ la cantidad de decimales correctos más o menos se **duplica** en cada iteración.

### Condiciones de convergencia

- **Local:** si $f \in C^2$, $f'(\alpha)\ne 0$ y $x_0$ está "suficientemente cerca", converge. Para justificarlo se puede usar el criterio de punto fijo $|g'(x)| = \left|\tfrac{f f''}{f'^2}\right| < 1$ en un intervalo alrededor de la raíz.
- **Condición de Fourier** (sirve para dar un **intervalo explícito**, como pide el Problema 4b). Si en $[a,b]$ se cumple que:
  1. $f(a)\,f(b) < 0$;
  2. $f'$ no se anula en $[a,b]$;
  3. $f''$ no cambia de signo en $[a,b]$;
  4. $x_0 \in [a,b]$ cumple $f(x_0)\,f''(x_0) > 0$;

  entonces Newton converge de forma **monótona** a la única raíz en $[a,b]$.

::grafico[fourier]{Problema 4 con $f(x) = x - \cos x$: $f'' = \cos x \ge 0$ en $[0, \pi/2]$, así que la condición $f\,f''>0$ vale donde $f>0$ (zona verde). Desde $x_0 = \pi/2$ los iterados bajan hacia $\alpha$ sin cruzarla. Desde $x_0 = 0$ (zona roja) el primer paso salta al otro lado, a $x_1 = 1$.}

### Cuándo falla o empeora

- Si $f'(x_k) \approx 0$ (tangente casi horizontal), el siguiente iterado sale disparado lejos.
- Si $x_0$ está lejos de la raíz, puede oscilar, divergir o converger a otra raíz.
- En una **raíz múltiple** ($f(\alpha) = f'(\alpha) = 0$) el orden cae a $p = 1$.
- Su **costo**: hay que evaluar $f'$ en cada paso. Esa es la motivación de la secante.

::grafico[newton-falla]{La misma $F$ con $x_0 = 1{,}2$, cerca del mínimo de $F$ ($F' = 0$ en $x\approx1{,}03$): la tangente es casi horizontal y $x_1 \approx 3{,}6$ sale disparado lejos de $\alpha$. Acá vuelve, pero con otra $f$ podría divergir o ir a otra raíz (como $x = 0$).}

### Newton para calcular funciones (Problema 5)

La clave es armar una $f$ cuya raíz sea el número que se busca, **usando sólo operaciones que la máquina tiene**:

| Se busca | $f(x)$ | Iteración |
|---|---|---|
| $\sqrt[3]{c}$ | $x^3 - c$ | $x_{k+1} = x_k - \dfrac{x_k^3 - c}{3x_k^2} = \dfrac{2x_k^3 + c}{3x_k^2}$ |
| $\arcsin(a)$ | $\operatorname{sen}x - a$ | $x_{k+1} = x_k - \dfrac{\operatorname{sen}x_k - a}{\cos x_k}$ |
| $\ln(a)$ (hay $e^x$, no hay $\ln$) | $e^x - a$ | $x_{k+1} = x_k - 1 + a\,e^{-x_k}$ |

Valores de referencia para controlar: $\arcsin(0{,}5) = \pi/6 \approx 0{,}524$ y $\ln 1{,}2 \approx 0{,}1823$.

### Aritmética de $t$ dígitos (Problemas 5c y 6)

- **Punto flotante con 4 dígitos:** se **redondea cada resultado intermedio** a 4 cifras significativas, no sólo el resultado final.
- **Límite de precisión alcanzable:** si $f$ sólo se conoce con un error $\delta_f$, cerca de la raíz el error en $x$ no puede bajar de

$$\delta_x \approx \frac{\delta_f}{|f'(\alpha)|}$$

  Con $f = \operatorname{sen}x$ cerca de $\pi$ vale $|f'| \approx 1$. Si $f$ tiene 4 decimales, entonces $\delta_x \sim 5\cdot10^{-5}$, y la iteración **se estanca**: no se pueden garantizar 6 dígitos significativos.

  **Conclusión general:** la precisión del resultado está limitada por la precisión de los datos, no por el método.

---

## 6. Método de la Secante

La derivada de Newton se reemplaza por la pendiente de la secante que pasa por los dos últimos iterados:

$$f'(x_k) \approx \frac{f(x_k) - f(x_{k-1})}{x_k - x_{k-1}}
\quad\Longrightarrow\quad
x_{k+1} = x_k - f(x_k)\,\frac{x_k - x_{k-1}}{f(x_k) - f(x_{k-1})}$$

::grafico[secante]{Secante desde $x_{-1} = 1{,}6$ y $x_0 = 2{,}6$ (tabla de la clase). Cada recta pasa por los dos últimos iterados. La tercera (punteada) sale de dos puntos del mismo lado de la raíz y la extrapola: a diferencia de Regula-Falsi, no hace falta encerrarla.}

- Necesita **2 puntos de arranque**, que **no** tienen por qué encerrar la raíz (a diferencia de Regula-Falsi).
- Hace **una sola evaluación nueva de $f$ por paso** y ninguna de $f'$.
- Es un método **supralineal**:

$$p = \frac{1+\sqrt5}{2} \approx 1{,}618, \qquad \lambda = \left|\frac{f''(\alpha)}{2f'(\alpha)}\right|^{0{,}618}$$

- Experimentalmente $p$ sale "ruidoso", entre 1,4 y 1,7, porque son pocas iteraciones.
- **Frente a Newton:** tiene menor orden por iteración, pero cada iteración es más barata. Si evaluar $f'$ cuesta tanto como evaluar $f$, la secante suele ser **más eficiente** por evaluación.
- Tiene las mismas fallas que Newton, y además puede aparecer una división por casi cero cuando $f(x_k) \approx f(x_{k-1})$.

---

## 7. Orden de convergencia experimental (se pide en casi todos los problemas)

### Definición

$$\lim_{k\to\infty}\frac{\varepsilon_{k+1}}{\varepsilon_k^{\,p}} = \lambda$$

Acá $p$ es el **orden de convergencia** y $\lambda$ la **constante asintótica del error**.

### Estimación sin conocer $\alpha$

Se reemplaza el error por la diferencia entre pasos, $\Delta x_k = |x_k - x_{k-1}|$:

$$\boxed{p \approx \frac{\ln\!\left(\Delta x_{k+1}/\Delta x_k\right)}{\ln\!\left(\Delta x_k/\Delta x_{k-1}\right)}}
\qquad
\boxed{\lambda \approx \frac{\Delta x_{k+1}}{(\Delta x_k)^{p}}}$$

- Hacen falta **3 diferencias consecutivas**, o sea 4 iterados. Por eso las columnas $\lambda$ y $p$ de las tablas de la cátedra empiezan recién en la fila 3.
- El método tiene que estar **convergiendo**. Las primeras filas no son representativas.
- Las últimas filas tampoco sirven: cuando $\Delta x$ llega al nivel del redondeo, los cocientes se vuelven ruido.
- Al calcular $\lambda$ conviene usar el $p$ **teórico redondeado** (1, 1,618 o 2), así se ve si $\lambda$ se estabiliza.
- **Interpretación gráfica:** en un gráfico de $\log(\Delta x)$ contra $k$, un método lineal da una **recta** de pendiente $\log\lambda$. Un método de orden $p>1$ da una curva que cae cada vez más rápido. El gráfico del §8 lo muestra con los cinco métodos.

---

## 8. Resumen comparativo

Datos de la clase, para $f(x) = \tfrac{x^2}{4} - \operatorname{sen}x$ con $\alpha = 1{,}93375$:

| Método | Iteración | Arranque | ¿Converge siempre? | $p$ | $\lambda$ | $N$ |
|---|---|---|---|---|---|---|
| Bisección | $m = \frac{a+b}{2}$ | $[a,b]$ con cambio de signo | Sí | 1 | 0,5 | 17 |
| Regula-Falsi | corte de la secante con el eje | $[a,b]$ con cambio de signo | Sí | ≈1 | ≈0,25 | 8 |
| Punto fijo | $x_{k+1} = g(x_k)$ | $x_0$ | Sólo si $\lvert g'\rvert<1$ | 1 | $\lvert g'(\alpha)\rvert\approx0{,}32$ | 10 |
| Secante | $x_k - f_k\frac{x_k-x_{k-1}}{f_k-f_{k-1}}$ | $x_{-1}, x_0$ | No | ≈1,618 | ≈0,5–0,7 | 5–6 |
| Newton-Raphson | $x_k - f_k/f'_k$ | $x_0$ | No (local) | 2 | $\lvert f''/2f'\rvert\approx0{,}54$ | 5 |

En esta tabla, de arriba hacia abajo aumentan la información que usa cada método y su velocidad. De abajo hacia arriba aumenta la robustez.

::grafico[convergencia]{$\log_{10}\Delta$ contra la iteración $k$, cortando en $\Delta < 0{,}5\cdot10^{-5}$. Los tres métodos lineales son rectas: la pendiente es $\log_{10}\lambda$, así que la bisección ($\lambda = 0{,}5$) es la más plana. Secante y Newton se curvan hacia abajo: su $\Delta$ cae cada vez más rápido.}

---

## 9. Mapa de la guía: qué repasar para cada problema

| Problema | Método | Repasar |
|---|---|---|
| **1** (a, b, c) | Bisección | §1 para localizar la raíz y elegir un intervalo válido (dominio de $\ln$, raíz trivial $x=0$ en c). §2 para el criterio $\Delta m < 0{,}02$. |
| **2** | Bisección | §1 (Bolzano no da unicidad). §2 para el número de iteraciones con tolerancia absoluta y relativa, y la expresión $x\pm\Delta x$. §7 para $p$ y $\lambda$. |
| **3** | Punto fijo | §4: los dos teoremas para elegir el intervalo (leer los gráficos de $g$ y $g'$), el error relativo del 1 % y $\lambda = \lvert g'(\alpha)\rvert$. |
| **4** | Newton | §5: plantear $f(x) = x - \cos x$, dar el intervalo explícito con la condición de Fourier, usar tolerancia relativa $10^{-10}$ y verificar $p\approx 2$. |
| **5** | Newton | §5: la tabla de "Newton para calcular funciones" y la aritmética de 4 dígitos. |
| **6** | Newton con datos imprecisos | §5, "Límite de precisión alcanzable". |
| **7** | Secante | §6, y comparar el $p$ con el de Newton (§7). |
| **8** | Newton | §5 y §7. Controlar contra la raíz exacta $\alpha = \ln 2$. |
| **8–9 (Física)** | Planteo | Llegar a la ecuación $F(\text{incógnita}) = 0$ y decir qué método se usaría y cómo se arranca (§2 a §6). Por ejemplo $-2ky\left(1 - \tfrac{L_0}{\sqrt{y^2+a^2}}\right) - mg = 0$. |

---

## 10. Errores comunes (checklist antes de entregar)

- [ ] ¿Verifiqué el **cambio de signo** *y* la **unicidad** en el intervalo?
- [ ] ¿La tolerancia era **absoluta** o **relativa**? ¿Corté con el criterio correcto?
- [ ] ¿Calculadora en **radianes**?
- [ ] En punto fijo: ¿probé $g([a,b])\subseteq[a,b]$ **y** $|g'|<1$ en **todo** el intervalo, no sólo en la semilla?
- [ ] En Newton: ¿$f'(x_0)\neq 0$? ¿La semilla cumple Fourier, o está razonablemente cerca?
- [ ] ¿Estimé $p$ con filas "del medio", ni las primeras ni las que ya tienen ruido de redondeo?
- [ ] ¿Expresé el resultado como $\bar x \pm \Delta x$, con la cota redondeada hacia arriba?
- [ ] En aritmética de $t$ dígitos: ¿redondeé **cada** operación intermedia?
