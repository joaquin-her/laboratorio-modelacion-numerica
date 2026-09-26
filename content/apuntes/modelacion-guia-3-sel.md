# Apunte — Guía 3: Sistemas de Ecuaciones Lineales (SEL)

**95.13 Métodos Matemáticos y Numéricos — FIUBA**

Objetivo: resolver $A\,x = b$, con $A$ una matriz $n\times n$ no singular.

| Familia | Métodos | Idea |
|---|---|---|
| **Directos** | Gauss (sin pivoteo, con pivoteo parcial o total), LU, refinamiento iterativo | Llegan a la solución en un número **fijo** de operaciones. El único error es el de **redondeo**. |
| **Iterativos** | Jacobi, Gauss-Seidel, SOR | Generan una sucesión $x^{(k)} \to x$. Tienen error de **truncamiento** (se corta la iteración) y **no siempre convergen**. |

Los directos conviene usarlos con matrices chicas o densas. Los iterativos rinden con matrices grandes y **ralas**, es decir con muchos ceros.

---

## 0. Aritmética de $t$ dígitos

En la Parte A casi todo se hace "con $t$ dígitos". Eso significa que **cada resultado intermedio** se guarda con $t$ cifras significativas:

| Tipo de redondeo | Qué hace | Ejemplo con $t = 3$ |
|---|---|---|
| **Simétrico** (al más cercano) | Redondea la cifra $t$ según la siguiente | $0{,}9999 \to 1{,}00$ y $-9999 \to -1{,}00\times10^4$ |
| **Por corte** (truncamiento) | Descarta lo que sigue a la cifra $t$ | $0{,}9999 \to 0{,}999$ y $-9999 \to -9990$ |

La guía pide **redondeo simétrico** (Problema 2). En los ejemplos de clase se usó **corte**. Siempre hay que leer cuál pide el enunciado.

**Cancelación:** restar dos números casi iguales hace que se pierdan cifras significativas. Por ejemplo, con $t=4$, $5{,}890 - 5{,}918 = -0{,}028$: de 4 cifras quedan 2. Casi todo el error de los métodos directos sale de ahí.

---

## 1. Eliminación de Gauss

Se trabaja sobre la **matriz ampliada** $[A \mid b]$ y se hacen ceros debajo de la diagonal, columna por columna.

**Paso $j$** (se anula la columna $j$ debajo del pivote $a_{jj}$):

$$m_{ij} = \frac{a_{ij}}{a_{jj}}, \qquad E_i \leftarrow E_i - m_{ij}\,E_j \qquad (i = j+1, \dots, n)$$

Los multiplicadores $m_{ij}$ se anotan **entre corchetes** en el lugar del cero que generan, como hace la cátedra, porque después forman la matriz $L$.

**Sustitución inversa**, de abajo hacia arriba:

$$x_n = \frac{b'_n}{u_{nn}}, \qquad x_i = \frac{b'_i - \sum_{j>i} u_{ij}\,x_j}{u_{ii}}$$

> Ejemplo de la clase (es el Problema 1):
> $$[A \mid b] = \left[\begin{array}{cccc|c} 1&2&3&4&2\\ 1&4&9&16&10\\ 1&8&27&64&44\\ 1&16&81&256&190 \end{array}\right] \;\longrightarrow\; \left[\begin{array}{cccc|c} 1&2&3&4&2\\ 0&2&6&12&8\\ 0&0&6&24&18\\ 0&0&0&24&24 \end{array}\right]$$
> Con los multiplicadores $m_{21}=m_{31}=m_{41}=1$, $m_{32}=3$, $m_{42}=7$ y $m_{43}=6$, queda $x = (-1;\ 1;\ -1;\ 1)$.

**Costo:** la eliminación hace del orden de $n^3/3$ multiplicaciones, y la sustitución $n^2/2$.

---

## 2. Pivoteo

### Por qué hace falta

Si el pivote $a_{jj}$ es **chico**, el multiplicador $m_{ij} = a_{ij}/a_{jj}$ es **grande**. Entonces $E_i - m_{ij}E_j$ queda dominado por la fila $j$, y la información de la fila $i$ se pierde en el redondeo.

> Ejemplo de la clase, con 3 dígitos y corte:
> $$A = \begin{bmatrix}1&1&1\\0&0{,}0001&1\\0&1&1\end{bmatrix},\qquad b = \begin{bmatrix}1\\1\\0\end{bmatrix}$$
>
> | | Multiplicador | Solución obtenida |
> |---|---|---|
> | **Sin pivoteo** | $m_{32} = 1/0{,}0001 = 10000$ | $(0;\ 0;\ 1)$ ❌ |
> | **Con pivoteo** ($E_2 \leftrightarrow E_3$) | $m_{32} = 0{,}0001$ | $(1;\ -1;\ 1)$ ✅ |

### Pivoteo parcial

En el paso $j$ se busca, **en la columna $j$ y de la diagonal para abajo**, el elemento de mayor módulo, y se intercambia esa fila con la fila $j$. Así todos los multiplicadores cumplen $|m_{ij}| \le 1$.

- Se intercambia la fila **completa, incluido $b$**.
- Hay que registrar los intercambios (vector $p$) si después se va a usar LU.

### Pivoteo total

Se busca el mayor elemento en **toda la submatriz** que queda por eliminar, y se intercambian filas **y columnas**. Intercambiar columnas **reordena las incógnitas**, así que hay que llevar la cuenta de qué $x_i$ quedó en cada posición.

Es más estable, pero cuesta más, porque hay que buscar en $O(n^2)$ elementos en cada paso. En la práctica casi siempre alcanza con el parcial.

---

## 3. Descomposición LU (Doolittle)

Se escribe $A = L\,U$, con:

- $U$: la matriz triangular superior que resulta de la eliminación de Gauss;
- $L$: triangular inferior con **unos en la diagonal** (eso es lo que define a Doolittle) y los **multiplicadores** debajo.

$$L = \begin{bmatrix}1&0&0\\ m_{21}&1&0\\ m_{31}&m_{32}&1\end{bmatrix}, \qquad U = \begin{bmatrix}u_{11}&u_{12}&u_{13}\\ 0&u_{22}&u_{23}\\ 0&0&u_{33}\end{bmatrix}$$

**Resolución en dos pasos:**

$$A x = b \;\Longrightarrow\; L\underbrace{(Ux)}_{y} = b \;\Longrightarrow\;
\begin{cases} L\,y = b & \text{sustitución directa (de arriba hacia abajo)} \\ U\,x = y & \text{sustitución inversa (de abajo hacia arriba)} \end{cases}$$

**Ventaja:** se factoriza **una vez**, con costo $O(n^3)$, y después cada nuevo $b$ se resuelve con dos sustituciones, $O(n^2)$. Por eso se usa en el refinamiento iterativo y en Newton con jacobiano fijo (Guía 4).

### LU con pivoteo parcial: el vector $p$

Si hubo intercambios, la factorización es de la matriz **permutada**: $PA = LU$. El vector $p$ dice qué fila original quedó en cada lugar. Por ejemplo, $p_1 = 2$ significa que la fila 2 de $A$ quedó primera.

Para resolver hay que **permutar $b$ igual que las filas de $A$**:

$$b^*_i = b_{p_i}, \qquad L\,y = b^*, \qquad U\,x = y$$

> Ejemplo de la clase (es el Problema 4): con $p = (2;\ 3;\ 1)$ y $b = (1;\ -2;\ 7)$ queda $b^* = (-2;\ 7;\ 1)$.
> Con eso, $y = (-2;\ 6;\ 0{,}8)$ y $x = (-1;\ 2;\ 1)$.

Para **reconstruir $A$**, se calcula $LU$: la fila $i$ del producto es la fila $p_i$ de $A$.

---

## 4. Normas y número de condición

### Normas

| Objeto | Norma | Fórmula |
|---|---|---|
| Vector | $\lVert x\rVert_1$ | $\sum_i \lvert x_i\rvert$ |
| Vector | $\lVert x\rVert_2$ | $\sqrt{\sum_i x_i^2}$ |
| Vector | $\lVert x\rVert_\infty$ | $\max_i \lvert x_i\rvert$ |
| Matriz | $\lVert A\rVert_1$ | **máxima suma de columna**: $\max_j \sum_i \lvert a_{ij}\rvert$ |
| Matriz | $\lVert A\rVert_\infty$ | **máxima suma de fila**: $\max_i \sum_j \lvert a_{ij}\rvert$ |

Propiedades que se usan: $\lVert A B\rVert \le \lVert A\rVert\,\lVert B\rVert$ y $\lVert A x\rVert \le \lVert A\rVert\,\lVert x\rVert$.

### Número de condición

$$K(A) = \lVert A\rVert\;\lVert A^{-1}\rVert \;\ge\; 1$$

El número de condición mide **cuánto se amplifican los errores relativos** de los datos en la solución:

$$\frac{\lVert \delta x\rVert}{\lVert x\rVert} \;\le\; K(A)\,\frac{\lVert r\rVert}{\lVert b\rVert}$$

- $K$ cercano a 1: la matriz está **bien condicionada**.
- $K$ grande: está **mal condicionada**. Un residuo chico **no** garantiza una solución buena.
- **Regla práctica:** con $t$ dígitos se pierden unos $\log_{10} K(A)$ dígitos. La solución tiene aproximadamente $t - \log_{10}K$ cifras correctas.

Para una matriz 2×2 la inversa sale directo:

$$A = \begin{bmatrix}a&b\\c&d\end{bmatrix} \;\Longrightarrow\; A^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$$

Si el determinante es muy chico frente a los elementos de $A$, hay que sospechar mal condicionamiento.

---

## 5. Refinamiento iterativo

Idea: si $\tilde x$ es la solución aproximada, el error $\delta x = x - \tilde x$ cumple **el mismo sistema, pero con el residuo como término independiente**:

$$r = b - A\tilde x \quad\Longrightarrow\quad A\,\delta x = r \quad\Longrightarrow\quad x \approx \tilde x + \delta x$$

**Algoritmo:**
1. Resolver $A\tilde x = b$ con $t$ dígitos y guardar $L$ y $U$.
2. Calcular $r = b - A\tilde x$ en **doble precisión**, porque es una resta de números casi iguales. Recién después redondear $r$ a $t$ dígitos.
3. Resolver $A\,\delta x = r$ **con la misma LU**: dos sustituciones, nada de refactorizar.
4. Actualizar $\tilde x \leftarrow \tilde x + \delta x$ y repetir si hace falta.

### Estimar $K(A)$ y los dígitos que se ganan

Con el primer refinamiento:

$$K(A) \approx \frac{\lVert \delta x\rVert_\infty}{\lVert \tilde x\rVert_\infty}\,10^{t}, \qquad p = \log_{10} K(A), \qquad q = t - p$$

- $q$ es la cantidad aproximada de **dígitos correctos que gana cada refinamiento**: tras $k$ refinamientos, unos $(k+1)\,q$ dígitos, hasta llegar a $t$.
- Si $q \le 0$, **no vale la pena refinar**.
- Se refina hasta que el residuo se confunda con cero.

> Ejemplo de la clase (es el Problema 5, con $t = 4$):
>
> | | $x_1$ | $x_2$ |
> |---|---|---|
> | $x^{(0)}$ (Gauss) | 7,702 | −13,92 |
> | $x^{(1)}$ | 7,165 | −12,72 |
> | $x^{(2)}$ | 7,202 | −12,80 |
> | Exacta | 7,200 | −12,80 |
>
> Estimación: $K \approx (1{,}198/13{,}92)\cdot 10^4 \approx 860$, así que $p \approx 2{,}9$ y $q \approx 1{,}1$. El valor exacto es $K_\infty = 2169$, o sea $\log_{10} K = 3{,}3$: la estimación sirve como **orden de magnitud**.
>
> Si el residuo se calcula con $t = 4$ en lugar de doble precisión, el "refinamiento" **empeora** la solución: da $(8{,}328;\ -15{,}30)$.

---

## 6. Métodos iterativos: la idea

Se escribe $A x = b$ como un punto fijo, **igual que en la Guía 2 pero con vectores**:

$$x^{(k+1)} = T\,x^{(k)} + c$$

Para eso se parte $A = D + L + U$, donde $D$ es la diagonal, $L$ la parte **estrictamente** inferior y $U$ la estrictamente superior. Estas $L$ y $U$ **no son** las de la factorización LU.

### Jacobi

Cada ecuación se despeja en su incógnita de la diagonal, usando **solo valores de la iteración anterior**:

$$x_i^{(k+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j\ne i} a_{ij}\,x_j^{(k)}\right)
\qquad\Longleftrightarrow\qquad
T_J = -D^{-1}(L+U), \quad c_J = D^{-1}b$$

### Gauss-Seidel

Igual que Jacobi, pero **cada valor nuevo se usa apenas se calcula**:

$$x_i^{(k+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j<i} a_{ij}\,x_j^{(k+1)} - \sum_{j>i} a_{ij}\,x_j^{(k)}\right)
\qquad\Longleftrightarrow\qquad
T_{GS} = -(D+L)^{-1}U$$

> Ejemplo de la clase (es el Problema 9), desde $x^{(0)} = (1;\ 2;\ 3)$:
> $$\begin{aligned} 10x + 2y + 6z &= 28\\ x + 10y + 4z &= 7\\ 2x - 7y - 10z &= -17 \end{aligned}$$
>
> | $k$ | Jacobi $(x;\ y;\ z)$ | Gauss-Seidel $(x;\ y;\ z)$ |
> |---|---|---|
> | 1 | 0,600; −0,600; 0,500 | 0,600; −0,560; 2,212 |
> | 2 | 2,620; 0,440; 2,240 | 1,585; −0,343; 2,257 |
> | 3 | 1,368; −0,458; 1,916 | 1,514; −0,354; 2,251 |
> | 8 | 1,529; −0,346; 2,255 | — |
>
> La solución es $(1{,}520;\ -0{,}352;\ 2{,}251)$. Gauss-Seidel llega en 3 iteraciones a lo que Jacobi no alcanza en 8.

### SOR (sobrerrelajación)

Es Gauss-Seidel ponderado con un factor $w$:

$$x_i^{(k+1)} = (1-w)\,x_i^{(k)} + w\,\big[x_i^{(k+1)}\big]_{GS}$$

Converge si $0 < w < 2$ y $A$ es definida positiva. Con $w = 1$ es Gauss-Seidel.

---

## 7. Convergencia de los métodos iterativos

| Criterio | Qué asegura | Cómo se usa |
|---|---|---|
| $A$ **diagonal dominante** estricta por filas: $\lvert a_{ii}\rvert > \sum_{j\ne i}\lvert a_{ij}\rvert$ | Jacobi y Gauss-Seidel **convergen** (condición **suficiente**) | Es lo primero que se mira. Si no se cumple, se **reordenan filas** para lograrlo (Problemas 8 y 12). |
| Existe una norma con $\lVert T\rVert < 1$ | Converge (suficiente) | Probar $\lVert T\rVert_\infty$ y $\lVert T\rVert_1$. Que una dé $\ge 1$ **no** prueba divergencia. |
| $\rho(T) = \max_i \lvert\lambda_i\rvert < 1$ | Converge **si y solo si** se cumple | Es el criterio definitivo. $\lambda_i$ son los autovalores de $T$, no de $A$. |

- **Suficiente no es necesario.** En un ejercicio de examen de la cátedra, $A = \begin{bmatrix}2&0&1\\1&2&1\\0&1&2\end{bmatrix}$ **no** es diagonal dominante estricta (en la fila 2, $2 = 1 + 1$). Aun así, $\rho(T_J) = 0{,}66 < 1$ y Jacobi converge.
- **Velocidad:** el error se reduce más o menos en un factor $\rho(T)$ por iteración. Para ganar un dígito hacen falta unas $-1/\log_{10}\rho$ iteraciones.

> En el ejemplo del Problema 9:
>
> | | $\lVert T\rVert_1$ | $\lVert T\rVert_\infty$ | $\rho(T)$ | Iteraciones por dígito |
> |---|---|---|---|---|
> | Jacobi | 1 (no concluye) | 0,9 | 0,48 | ≈ 3,1 |
> | Gauss-Seidel | 1,058 (no concluye) | 0,8 | 0,21 | ≈ 1,5 |

### Caso 2×2 (Problema 7)

Para $A = \begin{bmatrix}a_{11}&a_{12}\\a_{21}&a_{22}\end{bmatrix}$ la matriz de Jacobi es

$$T_J = \begin{bmatrix}0 & -a_{12}/a_{11}\\ -a_{21}/a_{22} & 0\end{bmatrix}, \qquad \lambda^2 = \frac{a_{12}\,a_{21}}{a_{11}\,a_{22}}$$

Para estudiar cuándo diverge, se analiza cuándo $\rho(T_J) = \sqrt{\lvert\lambda^2\rvert} \ge 1$. Para comparar con Gauss-Seidel, se calculan los autovalores de $T_{GS}$ de la misma forma y se comparan los dos radios espectrales.

### Cota del error de truncamiento

Si $\lVert T\rVert < 1$:

$$\lVert x^{(k)} - x\rVert \;\le\; \frac{\lVert T\rVert}{1 - \lVert T\rVert}\,\lVert x^{(k)} - x^{(k-1)}\rVert$$

Si $\lVert T\rVert \le 0{,}5$, el factor es $\le 1$, y la diferencia entre dos iteraciones ya acota el error. Es el mismo razonamiento que la cota de punto fijo de la Guía 2.

### Criterio de corte

- **Absoluto** (Problema 9): $\max_i \lvert x_i^{(k+1)} - x_i^{(k)}\rvert < \text{tol}$, que es la norma infinito de la diferencia.
- **$n$ dígitos significativos** (Problema 12): cambio relativo por componente $< 0{,}5\times 10^{1-n}$.

---

## 8. Matrices ralas (Problema 11)

Una matriz **tridiagonal** solo tiene elementos no nulos en la diagonal y en las dos vecinas. Al aplicarle Gauss sin pivoteo, **cada paso solo toca una fila**, y los ceros fuera de la banda se mantienen: no aparece "relleno".

Eso baja el costo de $O(n^3)$ a $O(n)$. Es el algoritmo de Thomas.

En un método iterativo, cada iteración con una matriz rala cuesta proporcional a la cantidad de elementos no nulos, y la matriz nunca se modifica. Por eso los iterativos son los preferidos para sistemas grandes y ralos.

---

## 9. Resumen comparativo

| Método | Error | ¿Siempre funciona? | Costo | Cuándo conviene |
|---|---|---|---|---|
| Gauss sin pivoteo | Redondeo, que crece con pivotes chicos | Falla si aparece un pivote nulo | $n^3/3$ | Matrices diagonal dominantes o definidas positivas |
| Gauss con pivoteo parcial | Redondeo acotado ($\lvert m_{ij}\rvert\le1$) | Sí, si $A$ es no singular | $n^3/3$ + búsqueda | Es la opción por defecto |
| Gauss con pivoteo total | El más estable | Sí | $n^3/3$ + búsqueda $O(n^2)$ por paso | Casos extremos |
| LU | Igual que Gauss | Igual que Gauss | $n^3/3$ una vez, $n^2$ por cada $b$ | Muchos $b$ con la misma $A$; refinamiento |
| Refinamiento | Gana unos $q$ dígitos por paso | Si $q > 0$ | $n^2$ por paso | Matrices mal condicionadas |
| Jacobi | Truncamiento | Solo si $\rho(T_J) < 1$ | $n^2$ por iteración (menos si es rala) | Sistemas grandes y ralos; se puede paralelizar |
| Gauss-Seidel | Truncamiento | Solo si $\rho(T_{GS}) < 1$ | $n^2$ por iteración | En general converge más rápido que Jacobi |

---

## 10. Mapa de la guía: qué repasar para cada problema

| Problema | Método | Repasar |
|---|---|---|
| **1** | Gauss sin pivoteo | §1 (es el ejemplo de la clase) |
| **2** (a–d) | Gauss con $t=4$: sin pivoteo, con pivoteo y con refinamiento | §0 (redondeo simétrico), §2 y §5. En d): comparar los multiplicadores. |
| **3** (a, b) | Pivoteo parcial con 3 dígitos + LU + refinamiento | §2, §3 y §5. La clase lo resolvió con y sin pivoteo. |
| **4** (a, b) | LU con vector de permutación | §3: permutar $b$ con $p$; reconstruir $A$ como $LU$ desordenada según $p$. |
| **5** (a–e) | Refinamiento con y sin doble precisión | §5: estimar $K$, $p$ y $q$ (resuelto en clase). |
| **6** (a, b) | Pivoteo parcial contra total + $K(A)$ | §2 y §4: inversa 2×2 y norma infinito. |
| **7** | Teoría de Jacobi y Gauss-Seidel 2×2 | §7, "Caso 2×2": autovalores de $T_J$ y $T_{GS}$. |
| **8** (a, b) | Jacobi con 5 dígitos | §7: la matriz no es diagonal dominante tal como está; reordenar y justificar con $\lVert T\rVert$. |
| **9** | Gauss-Seidel | §6 (es el ejemplo de la clase) y el criterio de corte de §7. |
| **10** | Jacobi y Gauss-Seidel 4×4 | §7: calcular $\rho(T)$ y explicar lo que se observa al iterar. |
| **11** | Tridiagonal | §8 + Gauss-Seidel (§6). |
| **12** (a, b) | Reordenar + Gauss-Seidel | §7: buscar el orden de filas que deja la diagonal dominante. |

---

## 11. Errores comunes (checklist antes de entregar)

- [ ] ¿Redondeé **cada** operación a $t$ dígitos, con el tipo de redondeo que pide el enunciado?
- [ ] Al intercambiar filas, ¿intercambié también $b$?
- [ ] ¿Anoté los multiplicadores? Son la $L$ de la factorización.
- [ ] En LU con pivoteo: ¿permuté $b$ con $p$ antes de hacer $Ly = b^*$?
- [ ] En el refinamiento: ¿calculé el residuo en **doble precisión**?
- [ ] ¿Usé la norma **de fila** para $\lVert\cdot\rVert_\infty$ y **de columna** para $\lVert\cdot\rVert_1$?
- [ ] En los iterativos: ¿verifiqué la convergencia **antes** de iterar (dominancia, $\lVert T\rVert$ o $\rho(T)$)?
- [ ] ¿Recordé que un criterio suficiente que falla **no** demuestra que el método diverja?
- [ ] En Gauss-Seidel: ¿usé los valores nuevos apenas los calculé?
