# Apunte — Guía 4: Sistemas de Ecuaciones No Lineales (SENL)

**95.13 Métodos Matemáticos y Numéricos — FIUBA**

Objetivo: hallar $X = (x_1, \dots, x_n)$ tal que

$$F(X) = \begin{bmatrix} f_1(x_1,\dots,x_n)\\ \vdots\\ f_n(x_1,\dots,x_n)\end{bmatrix} = \mathbf{0}$$

Esta guía **combina las dos anteriores**: los métodos de la Guía 2 (Newton y punto fijo) pasados a vectores, y en cada paso un sistema lineal que se resuelve con lo de la Guía 3.

| Método | Qué generaliza | Convergencia |
|---|---|---|
| **Newton-Raphson** | Newton de una variable (Guía 2, §5) | Cuadrática ($p=2$), local |
| **Newton con jacobiano fijo** | Newton, reusando la misma matriz | Lineal ($p=1$) |
| **Gauss-Seidel no lineal** | Punto fijo (Guía 2, §4) + Gauss-Seidel (Guía 3, §6) | Lineal, si el despeje contrae |

---

## 1. El jacobiano

Es la "derivada" de $F$: una matriz $n\times n$ con **una fila por ecuación** y **una columna por incógnita**:

$$J(X) = \begin{bmatrix}
\dfrac{\partial f_1}{\partial x_1} & \cdots & \dfrac{\partial f_1}{\partial x_n}\\
\vdots & & \vdots\\
\dfrac{\partial f_n}{\partial x_1} & \cdots & \dfrac{\partial f_n}{\partial x_n}
\end{bmatrix}$$

Cada fila es el gradiente de una ecuación.

> Ejemplo (Problema 1): $f = x^2 + y^2 - 4$ y $g = xy - 1$.
> $$J(x,y) = \begin{bmatrix} 2x & 2y\\ y & x\end{bmatrix}, \qquad \det J = 2(x^2 - y^2)$$
> El jacobiano es singular sobre las rectas $y = \pm x$.

**Errores típicos:**
- olvidarse el factor de una potencia, por ejemplo $\partial(x_1x_2^2)/\partial x_2 = 2x_1x_2$;
- intercambiar filas o columnas;
- derivar la constante del lado derecho. Las constantes **no aparecen** en $J$: el jacobiano de $x_1x_2x_3 = 4{,}188$ es el mismo que el de $x_1x_2x_3 = -4{,}188$.

---

## 2. Newton-Raphson para sistemas

### Deducción

Igual que en una variable, se linealiza $F$ alrededor del punto actual con Taylor:

$$F(X_k + \Delta X) \approx F(X_k) + J(X_k)\,\Delta X = \mathbf{0}$$

### Algoritmo

En cada iteración:
1. Evaluar $F(X_k)$ y $J(X_k)$.
2. Resolver el **sistema lineal**

$$\boxed{J(X_k)\,\Delta X = -F(X_k)}$$

3. Actualizar: $X_{k+1} = X_k + \Delta X$.

**Nunca se invierte $J$.** Se resuelve el sistema con cualquier método de la Guía 3: Gauss, LU o Cramer si es 2×2.

### Fórmula cerrada para 2×2

Si $J = \begin{bmatrix}a&b\\c&d\end{bmatrix}$ y $F = (f, g)$:

$$\Delta x = \frac{-f\,d + b\,g}{ad - bc}, \qquad \Delta y = \frac{-a\,g + c\,f}{ad - bc}$$

> Ejemplo (Problema 1), desde $X_0 = (2;\ 0)$:
> - En $X_0$: $F = (0;\ -1)$ y $J = \begin{bmatrix}4&0\\0&2\end{bmatrix}$, que es diagonal. Queda $\Delta X = (0;\ 0{,}5)$, así que $X_1 = (2;\ 0{,}5)$.
> - En $X_1$: $F = (0{,}25;\ 0)$ y $J = \begin{bmatrix}4&1\\0{,}5&2\end{bmatrix}$ con $\det J = 7{,}5$. Queda $\Delta X = (-0{,}0667;\ 0{,}0167)$, así que $X_2 = (1{,}9333;\ 0{,}5167)$.
>
> | $k$ | $x_k$ | $y_k$ | $\lVert\Delta X\rVert_\infty$ |
> |---|---|---|---|
> | 1 | 2,000000 | 0,500000 | 0,5 |
> | 2 | 1,933333 | 0,516667 | 0,067 |
> | 3 | 1,931853 | 0,517637 | 0,0015 |
> | 4 | 1,931852 | 0,517638 | $1{,}1\times10^{-6}$ |
>
> La cantidad de decimales correctos **se duplica** en cada paso: $10^{-1}$, $10^{-3}$, $10^{-6}$. Es la firma de la convergencia cuadrática.

### Convergencia

- **Cuadrática** ($p = 2$) si $J(\alpha)$ **no es singular** y $X_0$ está suficientemente cerca de la raíz.
- **Es local:** desde otro $X_0$ puede converger a **otra raíz** o no converger. Cada raíz tiene su "cuenca de atracción".
- **Falla** si $J(X_k)$ es singular o casi singular: el sistema no tiene solución o $\Delta X$ sale enorme. En el Problema 1, eso pasa cerca de $y = \pm x$.
- **Cómo elegir $X_0$:** graficar las curvas $f_i = 0$ (en 2×2 son curvas del plano) y arrancar cerca de una intersección. Con muchas ecuaciones, despejar para reducir el número de variables ayuda a ver dónde están las raíces.

### Newton no es invariante frente a reescrituras

Multiplicar una ecuación por algo (por ejemplo $x^2/y = c \to x^2 = c\,y$) **no cambia las raíces**, pero **sí cambia los iterados**, porque cambia la linealización. Hay que resolver el sistema **tal como está escrito** en el enunciado, salvo que se indique otra cosa.

---

## 3. Criterios de corte

| Criterio | Fórmula | Cuándo |
|---|---|---|
| Absoluto | $\lVert\Delta X\rVert_\infty < \text{tol}$ | Tolerancia dada en unidades |
| Relativo por componente | $\lvert\Delta x_i\rvert / \lvert x_i\rvert < 0{,}5\times10^{1-n}$ para **cada** $i$ | "$n$ dígitos significativos" |
| Residuo | $\lVert F(X_k)\rVert_\infty$ chico | Control complementario, no como único criterio |

**Conviene el criterio por componente.** Si una incógnita es mucho más chica que otra, por ejemplo $x \approx 0{,}37$ e $y \approx 0{,}029$, el cociente $\lVert\Delta X\rVert_\infty / \lVert X\rVert_\infty$ queda dominado por la grande, y la chica puede tener menos dígitos de los que parece.

**Recordatorio:** "4 dígitos" de $y = -0{,}02885$ son 4 cifras **significativas** ($2{,}885\times10^{-2}$), no 4 decimales.

---

## 4. Aritmética de $t$ dígitos: estancamiento

Con $t$ dígitos, cerca de la raíz $F(X_k)$ se calcula como **diferencia de números casi iguales** (cancelación, Guía 3 §0). El residuo termina siendo ruido de redondeo: $\pm$ una unidad del último dígito.

Por eso:
- la convergencia cuadrática vale en aritmética exacta; con $t$ dígitos, el método **se estanca** en un error del orden de la precisión de trabajo;
- tiene sentido pedir "$t$ dígitos significativos", pero no más;
- si los iterados oscilan en la última cifra, **ya se llegó**: es el límite de la precisión (como el Problema 6 de la Guía 2).

---

## 5. Newton con jacobiano fijo

Se calcula y **factoriza $J(X_0)$ una sola vez** (por ejemplo en LU, Guía 3 §3), y en cada paso solo se reevalúa $F$:

$$J(X_0)\,\Delta X = -F(X_k), \qquad X_{k+1} = X_k + \Delta X$$

| | Newton completo | Jacobiano fijo |
|---|---|---|
| Costo por iteración | Armar $J$ + factorizar: $O(n^3)$ | Dos sustituciones: $O(n^2)$ |
| Convergencia | Cuadrática | **Lineal** |
| Primera iteración | — | Idéntica a la de Newton |

Es un punto fijo $X \leftarrow X - J_0^{-1}F(X)$. Como en la Guía 3, converge si el radio espectral de su matriz de iteración en la raíz es menor que 1, y esa es la constante asintótica:

$$\lambda = \rho\!\left(I - J(X_0)^{-1}\,J(\alpha)\right)$$

Cuanto más cerca esté $X_0$ de la raíz, más se parece $J(X_0)$ a $J(\alpha)$, y más chico es $\lambda$.

**Ojo con el orden experimental:** con pocas iteraciones, la fórmula de la terna (§7) mezcla el primer paso, que es igual al de Newton y reduce mucho el error, con los siguientes, que son lineales. Puede dar valores menores que 1, como el "≈ 0,5" del Problema 5c, aunque el orden real sea 1.

---

## 6. Gauss-Seidel no lineal

Es un **punto fijo por componentes**:
1. De cada ecuación se despeja **una** incógnita.
2. Se itera como en Gauss-Seidel lineal: **cada valor nuevo se usa apenas se calcula**.

$$x_1^{(k+1)} = g_1\big(x_2^{(k)}, \dots, x_n^{(k)}\big), \qquad x_2^{(k+1)} = g_2\big(x_1^{(k+1)}, x_3^{(k)}, \dots\big), \qquad \dots$$

### El despeje decide si converge

El despeje **no es único**, y de él depende la convergencia, igual que la elección de $g$ en punto fijo (Guía 2, §4).

En el caso de 2 incógnitas, encadenando las dos asignaciones queda un punto fijo en una sola variable:

$$x_2^{(k+1)} = g_2\big(g_1(x_2^{(k)})\big)$$

Ese punto fijo converge si

$$\left\lvert g_1'\,g_2'\right\rvert < 1 \quad\text{cerca de la raíz}$$

- Si el producto es **negativo**, los iterados **oscilan**: quedan alternadamente de cada lado de la raíz.
- Si su módulo está **cerca de 1**, la convergencia es **lenta**.
- Para $n$ incógnitas: converge si el jacobiano de la función de iteración $G$ tiene una norma (o radio espectral) menor que 1 cerca de la raíz.

### Con redondeo: la banda de estancamiento

Si cada paso agrega un error de redondeo $\delta$ y el despeje contrae con factor $L$:

$$\lvert e_{k+1}\rvert \le L\,\lvert e_k\rvert + \delta \quad\Longrightarrow\quad \lvert e\rvert \text{ no baja de } \frac{\delta}{1 - L}$$

Con $L$ cerca de 1, esa banda es **varias veces** el error de redondeo. Los iterados quedan saltando dentro de ella (alternando de lado si $g' < 0$) y nunca terminan de converger. Esto es lo que pide justificar el Problema 4c.

---

## 7. Orden de convergencia experimental

Es la misma fórmula de la Guía 2, con **normas** en lugar de valores absolutos:

$$p \approx \frac{\ln\left(\lVert\Delta X_{k+1}\rVert / \lVert\Delta X_k\rVert\right)}{\ln\left(\lVert\Delta X_k\rVert / \lVert\Delta X_{k-1}\rVert\right)}, \qquad \lambda \approx \frac{\lVert\Delta X_{k+1}\rVert}{\lVert\Delta X_k\rVert^{\,p}}$$

- Se usa $\lVert\cdot\rVert_\infty$ salvo que se pida otra norma. El valor cambia un poco con la norma, pero la tendencia no.
- Hacen falta **tres diferencias consecutivas** (una terna). Las primeras ternas no son representativas, y las últimas se ensucian con el redondeo.

---

## 8. Resumen comparativo

| Método | Por iteración | $p$ | Requiere | Riesgo |
|---|---|---|---|---|
| Newton | Evaluar $F$ y $J$ + resolver un SEL | 2 | Derivadas parciales, $J(\alpha)$ no singular, $X_0$ cerca | $J$ singular; converger a otra raíz |
| Newton con $J$ fijo | Evaluar $F$ + dos sustituciones | 1 | Factorizar $J(X_0)$ una vez | Converge lento si $X_0$ está lejos |
| Gauss-Seidel no lineal | Evaluar los despejes | 1 | Un despeje que contraiga | Diverge con un mal despeje; oscila con redondeo |

---

## 9. Mapa de la guía: qué repasar para cada problema

| Problema | Método | Repasar |
|---|---|---|
| **1** | Newton 2×2 | §1 y §2 (es el ejemplo del apunte). A qué raíz converge y por qué: la cuenca. |
| **2** | Newton hasta 4 dígitos | §2 y §3: criterio por componente; ojo con $y$ chico. Usar $F$ tal como está escrita. |
| **3** | Newton con 3 dígitos | §4: redondear cada operación; qué significa que la última cifra oscile. |
| **4** (a, b, c) | Newton contra Gauss-Seidel no lineal, con 3 dígitos | a) §2 y §4. b) §6: probar despejes y verificar $\lvert g_1'g_2'\rvert<1$. c) §6: la banda $\delta/(1-L)$. |
| **5** (a, b, c) | Newton 3×3, completo y con $J$ fijo | §2 (el SEL 3×3 se resuelve con Gauss), §5 y §7. **Posible errata:** con $x_1x_2x_3 = +4{,}188$ no hay raíz cerca de $X^{(0)} = (1;\ -1;\ 3)$; con $-4{,}188$ sí. |

---

## 10. Errores comunes (checklist antes de entregar)

- [ ] ¿Cada fila del jacobiano corresponde a **una ecuación**, y cada columna a **una incógnita**?
- [ ] ¿Resolví $J\,\Delta X = \mathbf{-F}$, con el signo menos?
- [ ] ¿Actualicé **todas** las componentes con el mismo $\Delta X$?
- [ ] ¿Verifiqué que $\det J(X_k) \neq 0$, y que no está cerca de cero?
- [ ] ¿El criterio de corte es por componente cuando las incógnitas tienen escalas distintas?
- [ ] Con $t$ dígitos: ¿redondeé al evaluar $F$, al armar $J$ y al resolver el SEL?
- [ ] En Gauss-Seidel no lineal: ¿verifiqué que el despeje contrae **antes** de iterar?
- [ ] ¿Controlé la solución final reemplazándola en las ecuaciones originales?
