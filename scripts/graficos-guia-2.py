#!/usr/bin/env python3
"""
Genera los gráficos SVG del apunte de la Guía 2 (Ecuaciones No Lineales).

    python scripts/graficos-guia-2.py            # escribe content/apuntes/graficos/*.svg
    python scripts/graficos-guia-2.py --check    # sólo imprime las tablas de control

Todos los puntos salen de iterar los métodos de verdad (nada se dibuja a ojo) y
el script imprime las tablas para compararlas con las del apunte y la clase
(F(x) = x²/4 − sen x, α = 1,93375, arranque [1,6; 2,6] / x0 = 1,6).

Los SVG se insertan inline en la página (src/lib/apuntes.ts, directiva
`::grafico[nombre]{Epígrafe}`), así que los colores son variables CSS del sitio
(`var(--text)`, `var(--accent)`, …) con un valor de respaldo por si el archivo
se abre suelto: siguen el tema claro/oscuro y no dependen de JS ni de hover.

Sólo usa la biblioteca estándar.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "content" / "apuntes" / "graficos"

# --------------------------------------------------------------------------
# Funciones del problema de la clase
# --------------------------------------------------------------------------


def F(x: float) -> float:
    return x * x / 4 - math.sin(x)


def dF(x: float) -> float:
    return x / 2 - math.cos(x)


def d2F(x: float) -> float:
    return 0.5 + math.sin(x)


def raiz_newton(f, df, x0: float) -> float:
    x = x0
    for _ in range(100):
        x1 = x - f(x) / df(x)
        if abs(x1 - x) < 1e-15:
            return x1
        x = x1
    return x


ALFA = raiz_newton(F, dF, 1.9)  # 1,933753762827...
TOL = 0.5e-5  # "5 decimales", como en la clase

# --------------------------------------------------------------------------
# Métodos (devuelven todos los iterados, para dibujar y para controlar)
# --------------------------------------------------------------------------


def biseccion(a: float, b: float, n: int):
    filas = []
    for k in range(n):
        m = (a + b) / 2
        filas.append(dict(k=k, a=a, b=b, m=m, dm=(b - a) / 2))
        if F(a) * F(m) < 0:
            b = m
        else:
            a = m
    return filas


def regula_falsi(a: float, b: float, n: int):
    filas = []
    for k in range(n):
        m = a - F(a) * (b - a) / (F(b) - F(a))
        filas.append(dict(k=k, a=a, b=b, m=m))
        if F(a) * F(m) < 0:
            b = m
        else:
            a = m
    return filas


def punto_fijo(g, x0: float, n: int):
    xs = [x0]
    for _ in range(n):
        xs.append(g(xs[-1]))
    return xs


def newton(f, df, x0: float, n: int):
    xs = [x0]
    for _ in range(n):
        x = xs[-1]
        xs.append(x - f(x) / df(x))
    return xs


def secante(x_1: float, x0: float, n: int):
    xs = [x_1, x0]
    for _ in range(n):
        a, b = xs[-2], xs[-1]
        if F(b) == F(a):
            break
        xs.append(b - F(b) * (b - a) / (F(b) - F(a)))
    return xs


def g1(x: float) -> float:  # φ = 1: la de la clase
    return x - F(x)


def g2(x: float) -> float:  # φ = 2: misma raíz, pero |g'(α)| > 1
    return x - 2 * F(x)


def dg1(x: float) -> float:
    return 1 - dF(x)


def dg2(x: float) -> float:
    return 1 - 2 * dF(x)


# --------------------------------------------------------------------------
# Mini-biblioteca de SVG
# --------------------------------------------------------------------------

TEXT = "var(--text,#16212c)"
MUTED = "var(--text-muted,#5a6b7a)"
BORDER = "var(--border,#d7dfe6)"
SURFACE = "var(--surface,#ffffff)"
ACCENT = "var(--accent,#1f5fa8)"
ACCENT2 = "var(--accent-2,#b45a24)"
GOOD = "var(--good,#1f8f5b)"
BAD = "var(--bad,#c4453c)"
WARN = "var(--warn,#a3760f)"
GOOD_SOFT = "var(--good-soft,rgba(31,143,91,.12))"
BAD_SOFT = "var(--bad-soft,rgba(196,69,60,.12))"
ACCENT_SOFT = "var(--accent-soft,rgba(31,95,168,.10))"

FS = 14  # tamaño de letra en unidades del viewBox (≈ 10–11 px a 390 px de ancho)


def num(v: float, dec: int = 1) -> str:
    """Número con coma decimal, como en el resto del apunte."""
    s = f"{v:.{dec}f}".replace(".", ",")
    return s.replace("-", "−")


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Lienzo:
    def __init__(self, nombre, titulo, desc, W, H, x0, x1, y0, y1, m=(16, 16, 40, 48)):
        # m = (arriba, derecha, abajo, izquierda)
        self.nombre, self.titulo, self.desc = nombre, titulo, desc
        self.W, self.H = W, H
        self.x0, self.x1, self.y0, self.y1 = x0, x1, y0, y1
        self.mt, self.mr, self.mb, self.ml = m
        self.el: list[str] = []

    # coordenadas
    def X(self, x: float) -> float:
        return self.ml + (x - self.x0) / (self.x1 - self.x0) * (self.W - self.ml - self.mr)

    def Y(self, y: float) -> float:
        return self.H - self.mb - (y - self.y0) / (self.y1 - self.y0) * (self.H - self.mt - self.mb)

    # primitivas
    def add(self, s: str):
        self.el.append(s)

    def linea(self, xa, ya, xb, yb, color=TEXT, w=1.5, dash=None, datos=True, extra=""):
        if datos:
            xa, ya, xb, yb = self.X(xa), self.Y(ya), self.X(xb), self.Y(yb)
        d = f";stroke-dasharray:{dash}" if dash else ""
        self.add(
            f'<line x1="{xa:.1f}" y1="{ya:.1f}" x2="{xb:.1f}" y2="{yb:.1f}" '
            f'style="stroke:{color};stroke-width:{w}{d}{extra}"/>'
        )

    def poli(self, pts, color=TEXT, w=2, dash=None, relleno="none", datos=True, recorte=False):
        """recorte=True: se corta en el marco del gráfico (clipPath propio de cada SVG)."""
        if datos:
            pts = [(self.X(x), self.Y(y)) for x, y in pts]
        p = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        d = f";stroke-dasharray:{dash}" if dash else ""
        el = (
            f'<polyline points="{p}" style="fill:{relleno};stroke:{color};stroke-width:{w};'
            f'stroke-linejoin:round;stroke-linecap:round{d}"/>'
        )
        self.add(f'<g clip-path="url(#marco-{self.nombre})">{el}</g>' if recorte else el)

    def curva(self, f, xa, xb, n=240, recorte=True, **kw):
        pts = []
        for i in range(n + 1):
            x = xa + (xb - xa) * i / n
            pts.append((x, f(x)))
        self.poli(pts, recorte=recorte, **kw)

    def rect(self, xa, ya, xb, yb, relleno="none", color="none", w=1, dash=None):
        X0, X1 = sorted((self.X(xa), self.X(xb)))
        Y0, Y1 = sorted((self.Y(ya), self.Y(yb)))
        d = f";stroke-dasharray:{dash}" if dash else ""
        self.add(
            f'<rect x="{X0:.1f}" y="{Y0:.1f}" width="{X1 - X0:.1f}" height="{Y1 - Y0:.1f}" '
            f'style="fill:{relleno};stroke:{color};stroke-width:{w}{d}"/>'
        )

    def punto(self, x, y, color=TEXT, r=4, hueco=False, datos=True):
        if datos:
            x, y = self.X(x), self.Y(y)
        relleno = SURFACE if hueco else color
        self.add(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" '
            f'style="fill:{relleno};stroke:{color};stroke-width:1.8"/>'
        )

    def texto(self, x, y, s, color=TEXT, anchor="start", size=FS, peso=None, datos=True,
              base="auto", italica=False, halo=False):
        if datos:
            x, y = self.X(x), self.Y(y)
        estilo = f"fill:{color};font-size:{size}px"
        if peso:
            estilo += f";font-weight:{peso}"
        if italica:
            estilo += ";font-style:italic"
        if halo:
            # Contorno del color de fondo: el texto se lee aunque cruce una curva.
            estilo += f";paint-order:stroke;stroke:{SURFACE};stroke-width:4px;stroke-linejoin:round"
        b = f' dominant-baseline="{base}"' if base != "auto" else ""
        self.add(
            f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}"{b} style="{estilo}">{s}</text>'
        )

    def ejes(self, xt, yt, xfmt=lambda v: num(v), yfmt=lambda v: num(v), xlab=None, ylab=None,
             eje_x_en=None, grilla=True):
        """Marco con grilla suave, marcas en xt / yt y, opcional, la recta y = eje_x_en."""
        for v in xt:
            if grilla:
                self.linea(v, self.y0, v, self.y1, BORDER, 1)
            self.texto(self.X(v), self.H - self.mb + 18, xfmt(v), MUTED, "middle", datos=False)
        for v in yt:
            if grilla:
                self.linea(self.x0, v, self.x1, v, BORDER, 1)
            self.texto(self.ml - 6, self.Y(v), yfmt(v), MUTED, "end", datos=False, base="middle")
        self.rect(self.x0, self.y0, self.x1, self.y1, color=MUTED, w=1)
        if eje_x_en is not None:
            self.linea(self.x0, eje_x_en, self.x1, eje_x_en, MUTED, 1.4)
        if xlab:
            self.texto(self.W - self.mr, self.H - 4, xlab, MUTED, "end", datos=False, italica=True)
        if ylab:
            self.texto(4, self.mt - 10, ylab, MUTED, "start", datos=False, italica=True)

    def svg(self) -> str:
        cuerpo = "\n  ".join(self.el)
        return (
            f'<svg class="apunte-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.W} {self.H}" '
            f'role="img" aria-label="{esc(self.titulo)}" '
            f'style="font-family:var(--font-sans,system-ui,sans-serif)">\n'
            f"  <title>{esc(self.titulo)}</title>\n"
            f"  <desc>{esc(self.desc)}</desc>\n"
            f'  <defs><clipPath id="marco-{self.nombre}"><rect x="{self.ml}" y="{self.mt}" '
            f'width="{self.W - self.ml - self.mr}" height="{self.H - self.mt - self.mb}"/></clipPath></defs>\n'
            f"  {cuerpo}\n</svg>\n"
        )

    def guardar(self):
        SALIDA.mkdir(parents=True, exist_ok=True)
        (SALIDA / f"{self.nombre}.svg").write_text(self.svg(), encoding="utf-8", newline="\n")
        print(f"  → {self.nombre}.svg")


def sup(n: int) -> str:
    tabla = str.maketrans("-0123456789", "⁻⁰¹²³⁴⁵⁶⁷⁸⁹")
    return str(n).translate(tabla)


def sub(s: str) -> str:
    return str(s).translate(str.maketrans("-+0123456789", "₋₊₀₁₂₃₄₅₆₇₈₉"))


W = 480

# --------------------------------------------------------------------------
# 1. Bisección: intervalos que se encogen
# --------------------------------------------------------------------------


def g_biseccion():
    filas = biseccion(1.6, 2.6, 5)
    H = 430
    alto_curva = 230
    c = Lienzo(
        "biseccion",
        "Bisección sobre F(x) = x²/4 − sen x: intervalos [a_k, b_k] y puntos medios",
        "Arriba, la curva F en [1,5; 2,7] con la raíz α ≈ 1,93375. Abajo, un renglón por "
        "iteración k = 0…4 con el intervalo [a_k, b_k] y su punto medio m_{k+1}: "
        + "; ".join(f"k={f['k']}: [{num(f['a'], 4)}; {num(f['b'], 4)}], m={num(f['m'], 5)}" for f in filas),
        W, H, 1.5, 2.7, -0.5, 1.25, m=(16, 16, H - alto_curva, 48),
    )
    c.ejes([1.6, 1.8, 2.0, 2.2, 2.4, 2.6], [-0.4, 0, 0.4, 0.8, 1.2], eje_x_en=0,
           yfmt=lambda v: num(v, 1))
    c.curva(F, 1.5, 2.7, color=ACCENT, w=2.4)
    c.linea(ALFA, -0.5, ALFA, 1.25, MUTED, 1.2, dash="4 4")
    c.texto(ALFA + 0.015, 1.1, "α", TEXT, italica=True, halo=True)
    c.texto(2.33, F(2.33) + 0.16, "F(x)", ACCENT, "end", italica=True, halo=True)
    for f in filas[:1]:
        c.punto(f["a"], F(f["a"]), BAD, 4)
        c.punto(f["b"], F(f["b"]), GOOD, 4)
        c.texto(f["a"] + 0.03, F(f["a"]) - 0.02, "F(a₀) &lt; 0", BAD, size=13, halo=True, base="hanging")
        c.texto(f["b"] - 0.03, F(f["b"]) - 0.1, "F(b₀) &gt; 0", GOOD, "end", size=13, halo=True)
    c.punto(filas[0]["m"], F(filas[0]["m"]), ACCENT2, 4)

    # Renglones con los intervalos
    y_base = alto_curva + 46
    paso = 32
    c.texto(c.ml - 6, alto_curva + 18, "k", MUTED, "end", datos=False, italica=True)
    c.texto(c.W - c.mr, alto_curva + 18, "Δm", MUTED, "end", size=12, datos=False, italica=True)
    for i, f in enumerate(filas):
        y = y_base + i * paso
        xa, xb, xm = c.X(f["a"]), c.X(f["b"]), c.X(f["m"])
        c.texto(c.ml - 6, y, str(f["k"]), MUTED, "end", datos=False, base="middle")
        c.linea(xa, y, xb, y, ACCENT, 5, datos=False, extra=";stroke-linecap:butt;opacity:.35")
        c.linea(xa, y - 7, xa, y + 7, ACCENT, 2, datos=False)
        c.linea(xb, y - 7, xb, y + 7, ACCENT, 2, datos=False)
        c.punto(xm, y, ACCENT2, 4.5, datos=False)
        c.texto(xm, y - 10, "m" + sub(f["k"] + 1), ACCENT2, "middle", size=12, datos=False)
        c.texto(c.W - c.mr, y, f"{f['dm']:g}".replace(".", ","), MUTED, "end", size=12, datos=False,
                base="middle")
    c.linea(c.X(ALFA), y_base - 12, c.X(ALFA), y_base + 4 * paso + 10, MUTED, 1.2, dash="4 4", datos=False)
    c.guardar()
    return filas


# --------------------------------------------------------------------------
# 2. Bisección: cota vs error verdadero, número de iteraciones
# --------------------------------------------------------------------------


def g_biseccion_cota():
    filas = biseccion(1.6, 2.6, 20)
    H = 320
    c = Lienzo(
        "biseccion-cota",
        "Bisección: cota del error (b₀ − a₀)/2^(k+1) y error verdadero |m_(k+1) − α| en escala logarítmica",
        "La cota baja en línea recta, a la mitad por paso; cruza ε = 0,02 en k = 5 y 0,5·10⁻⁵ en "
        "k = 17. El error verdadero queda siempre por debajo de la cota pero sube y baja.",
        W, H, 0, 19, -7, 0, m=(16, 16, 40, 48),
    )
    c.ejes(range(0, 20, 2), range(-7, 1), xfmt=lambda v: str(v), yfmt=lambda v: "10" + sup(v),
           xlab="k", grilla=True)
    L = lambda v: math.log10(v)
    # Tolerancias
    for eps in (0.02, TOL):
        c.linea(0, L(eps), 19, L(eps), MUTED, 1.2, dash="6 4")
    k_002 = next(f["k"] for f in filas if f["dm"] < 0.02)
    k_tol = next(f["k"] for f in filas if f["dm"] < TOL)
    c.texto(18.8, L(0.02) - 0.42, "ε = 0,02", MUTED, "end", size=12, halo=True)
    c.texto(0.3, L(TOL) - 0.42, "ε = 0,5·10⁻⁵", MUTED, "start", size=12, halo=True)

    err = [(f["k"], max(abs(f["m"] - ALFA), 1e-7)) for f in filas]
    c.poli([(k, L(e)) for k, e in err], ACCENT2, 1.4, dash="3 3")
    for k, e in err:
        c.punto(k, L(e), ACCENT2, 3.2, hueco=True)
    c.poli([(f["k"], L(f["dm"])) for f in filas], ACCENT, 2.4)
    for f in filas:
        c.punto(f["k"], L(f["dm"]), ACCENT, 3)
    # Marcas de N
    for k, eps in ((k_002, 0.02), (k_tol, TOL)):
        c.linea(k, -7, k, L(eps), ACCENT, 1.2, dash="2 3")
        c.texto(k - 0.25, -6.75, f"k = {k}", ACCENT, "end", size=12, peso=600, halo=True)
    c.texto(2.5, L(filas[2]["dm"]) + 0.35, "cota Δm", ACCENT, peso=600, halo=True)
    c.texto(10.6, -5.7, "error verdadero |m − α|", ACCENT2, "middle", size=13, halo=True)
    c.guardar()
    return k_002, k_tol, filas


# --------------------------------------------------------------------------
# 3 y 4. Punto fijo: telaraña convergente y divergente
# --------------------------------------------------------------------------


def telarana(nombre, g, x0, pasos, titulo, desc, etiqueta_g, nota, ventana, marcas):
    a, b = ventana
    H = 440
    c = Lienzo(nombre, titulo, desc, W, H, a, b, a, b, m=(16, 76, 40, 48))
    c.ejes(marcas, marcas, xfmt=lambda v: num(v), yfmt=lambda v: num(v), xlab="x")
    c.linea(a, a, b, b, MUTED, 1.4)
    c.texto(b + 0.01 * (b - a), b, "y = x", MUTED, size=13, base="middle")
    c.curva(g, a, b, color=ACCENT, w=2.4)
    if a <= g(b) <= b:  # la etiqueta de g va en el margen derecho, si la curva llega hasta ahí
        c.texto(b + 0.01 * (b - a), g(b), etiqueta_g, ACCENT, size=13, base="middle", italica=True)
    else:  # si no, al lado de la curva cerca del borde izquierdo
        xe = a + 0.1 * (b - a)
        c.texto(xe + 0.02 * (b - a), g(xe), etiqueta_g, ACCENT, size=13, italica=True, halo=True)

    xs = punto_fijo(g, x0, pasos)
    # Recorrido: (x0, a) → (x0, g(x0)) → (x1, x1) → (x1, g(x1)) → …
    pts = [(xs[0], a)]
    for k in range(len(xs) - 1):
        pts.append((xs[k], xs[k + 1]))
        pts.append((xs[k + 1], xs[k + 1]))
    c.poli(pts, ACCENT2, 1.6, recorte=True)
    u = (b - a) / 100  # 1 % del ancho de la ventana, para ubicar etiquetas
    for k, x in enumerate(xs[:4]):
        if a <= x <= b:
            c.linea(x, a, x, x, MUTED, 0.9, dash="2 3")
            c.punto(x, a, ACCENT2, 3.2)
    for k, x in enumerate(xs[:3]):
        if a <= x <= b:
            # A la izquierda si el siguiente iterado cae a la derecha, y al revés.
            izq = k + 1 < len(xs) and xs[k + 1] > x and x - a > 8 * u
            c.texto(x + (-0.8 * u if izq else 0.8 * u), a + 2.5 * u, "x" + sub(k), ACCENT2,
                    "end" if izq else "start", size=13, peso=600, halo=True)
    c.punto(ALFA, ALFA, TEXT, 3.5)
    c.texto(ALFA - 3 * u, ALFA + 3 * u, "α", TEXT, "end", italica=True, halo=True)
    c.texto(b - 1.5 * u, a + 9 * u, nota, TEXT, "end", size=13, halo=True)
    c.guardar()
    return xs


# --------------------------------------------------------------------------
# 5. Newton: tangentes sucesivas
# --------------------------------------------------------------------------


def tangentes(c, f, df, xs, color, dash=None, etiquetas=True, n=None, dy=0.02, ancho=1.6):
    n = n if n is not None else len(xs) - 1
    for k in range(n):
        x, x1 = xs[k], xs[k + 1]
        c.linea(x, 0, x, f(x), MUTED, 0.9, dash="2 3")
        c.linea(x, f(x), x1, 0, color, ancho, dash=dash)
        c.punto(x, f(x), color, 3.5)
    for k in range(n + 1):
        c.punto(xs[k], 0, color, 3.2)


def g_newton():
    xs = newton(F, dF, 1.6, 6)
    H = 300
    c = Lienzo(
        "newton",
        "Newton-Raphson sobre F(x) = x²/4 − sen x desde x₀ = 1,6: tangentes sucesivas",
        "Cada tangente corta el eje en el iterado siguiente: x₁ = 2,03364, x₂ = 1,93856, "
        "x₃ = 1,93377; desde x₃ ya no se distingue de α.",
        W, H, 1.55, 2.1, -0.42, 0.22, m=(16, 16, 40, 48),
    )
    c.ejes([1.6, 1.7, 1.8, 1.9, 2.0, 2.1], [-0.4, -0.2, 0, 0.2], eje_x_en=0, xlab="x")
    c.curva(F, 1.55, 2.1, color=ACCENT, w=2.4)
    c.texto(1.64, F(1.64) + 0.03, "F(x)", ACCENT, italica=True, halo=True)
    tangentes(c, F, dF, xs, ACCENT2, n=3)
    lab = [(xs[0], 0.035, "middle", "x₀"), (xs[1], -0.035, "start", "x₁"),
           (xs[2], -0.035, "start", "x₂"), (xs[3], 0.035, "end", "x₃ ≈ α")]
    for x, dy, anc, s in lab:
        c.texto(x + (-0.006 if anc == "end" else 0.006 if anc == "start" else 0), dy, s, ACCENT2,
                anc, size=13, peso=600, halo=True, base="middle")
    c.texto(2.09, -0.37, "p = 2: los decimales correctos se duplican", TEXT, "end", size=13, halo=True)
    c.guardar()
    return xs


def g_newton_falla():
    x0 = 1.2
    xs = newton(F, dF, x0, 8)
    xmin = raiz_newton(dF, d2F, 1.0)  # donde F' = 0
    H = 300
    c = Lienzo(
        "newton-falla",
        "Newton-Raphson con x₀ = 1,2, cerca del mínimo de F: la tangente casi horizontal lo dispara lejos",
        f"F'(1,2) ≈ {num(dF(x0), 3)}, así que x₁ = {num(xs[1], 3)} queda lejos de α; "
        f"el mínimo de F (F' = 0) está en x ≈ {num(xmin, 3)}. Después vuelve: "
        f"x₂ = {num(xs[2], 3)}, x₃ = {num(xs[3], 3)}.",
        W, H, 0, 4, -0.9, 3.9, m=(16, 16, 40, 48),
    )
    c.ejes([0, 1, 2, 3, 4], [0, 1, 2, 3], eje_x_en=0, xfmt=lambda v: str(v), yfmt=lambda v: str(v), xlab="x")
    c.curva(F, 0, 4, color=ACCENT, w=2.4)
    c.texto(3.3, F(3.3) + 0.3, "F(x)", ACCENT, "end", italica=True, halo=True)
    # mínimo
    c.linea(xmin - 0.5, F(xmin), xmin + 0.5, F(xmin), MUTED, 1.2, dash="4 3")
    c.texto(xmin - 0.55, F(xmin), "F' = 0", MUTED, "end", size=12, base="middle", halo=True)
    tangentes(c, F, dF, xs, BAD, n=2)
    c.punto(ALFA, 0, TEXT, 3.5)
    c.texto(ALFA, 0.25, "α", TEXT, "middle", italica=True, halo=True)
    c.texto(0.0 + 0.05, 0.25, "0 (otra raíz)", MUTED, size=12, halo=True)
    c.punto(0, 0, MUTED, 3)
    c.texto(xs[0], 0.2, "x₀", BAD, "middle", size=13, peso=600, halo=True)
    c.texto(xs[1], 0.2, "x₁", BAD, "middle", size=13, peso=600, halo=True)
    c.texto(xs[2] + 0.04, -0.08, "x₂", BAD, "start", size=13, peso=600, halo=True, base="hanging")
    c.texto(0.1, 3.55, f"F'(x₀) ≈ {num(dF(x0), 2)} → salto de {num(xs[1] - xs[0], 1)}", TEXT, size=13, halo=True)
    c.guardar()
    return xs, xmin


# --------------------------------------------------------------------------
# 6. Condición de Fourier: f(x) = x − cos x en [0, π/2]
# --------------------------------------------------------------------------


def g_fourier():
    f = lambda x: x - math.cos(x)
    df = lambda x: 1 + math.sin(x)
    a, b = 0.0, math.pi / 2
    alfa = raiz_newton(f, df, 0.7)
    der = newton(f, df, b, 5)
    izq = newton(f, df, a, 5)
    H = 320
    c = Lienzo(
        "fourier",
        "Condición de Fourier para f(x) = x − cos x en [0, π/2]",
        f"f'' = cos x ≥ 0 en todo el intervalo, así que f·f'' > 0 donde f > 0: a la derecha de "
        f"α ≈ {num(alfa, 4)}. Desde x₀ = π/2 Newton baja monótono ({num(der[1], 4)}, {num(der[2], 4)}, …). "
        f"Desde x₀ = 0, donde f·f'' < 0, el primer paso salta al otro lado (x₁ = {num(izq[1], 4)}) "
        "y recién ahí sigue monótono.",
        W, H, a - 0.05, b + 0.05, -1.15, 1.75, m=(16, 16, 40, 48),
    )
    # Zonas
    c.rect(a, -1.15, alfa, 1.75, relleno=BAD_SOFT)
    c.rect(alfa, -1.15, b, 1.75, relleno=GOOD_SOFT)
    c.ejes([0, 0.4, 0.8, 1.2, 1.6], [-1, 0, 1], eje_x_en=0, xlab="x")
    c.linea(b, -1.15, b, 1.75, MUTED, 1, dash="4 4")
    c.texto(b - 0.02, -1.05, "π/2", MUTED, "end", size=12, halo=True)
    c.curva(f, a - 0.05, b + 0.05, color=ACCENT, w=2.4)
    c.texto(0.42, f(0.42) - 0.12, "f(x)", ACCENT, italica=True, halo=True, base="hanging")
    c.texto((a + alfa) / 2, 1.55, "f·f'' &lt; 0", BAD, "middle", size=13, peso=600, halo=True)
    c.texto((alfa + b) / 2, 1.55, "f·f'' &gt; 0", GOOD, "middle", size=13, peso=600, halo=True)
    c.texto((alfa + b) / 2, 1.35, "x₀ válida", GOOD, "middle", size=12, halo=True)
    # Desde π/2: monótono
    tangentes(c, f, df, der, ACCENT2, n=2)
    c.texto(der[0] - 0.02, 0.1, "x₀", ACCENT2, "end", size=13, peso=600, halo=True)
    c.texto(der[1] + 0.01, -0.13, "x₁", ACCENT2, "start", size=13, peso=600, halo=True)
    # Desde 0: sobredisparo
    c.linea(izq[0], f(izq[0]), izq[1], 0, BAD, 1.6, dash="6 4")
    c.punto(izq[0], f(izq[0]), BAD, 3.5)
    c.punto(izq[1], 0, BAD, 3.2, hueco=True)
    c.texto(izq[1] + 0.02, -0.2, "x₁ desde x₀ = 0", BAD, size=12, halo=True)
    c.punto(alfa, 0, TEXT, 3.5)
    c.texto(alfa - 0.02, 0.1, "α", TEXT, "end", italica=True, halo=True)
    c.guardar()
    return alfa, der, izq


# --------------------------------------------------------------------------
# 7. Secante
# --------------------------------------------------------------------------


def g_secante():
    xs = secante(1.6, 2.6, 6)  # xs[0] = x₋₁, xs[1] = x₀, …
    H = 300
    c = Lienzo(
        "secante",
        "Método de la secante sobre F(x) = x²/4 − sen x desde x₋₁ = 1,6 y x₀ = 2,6",
        f"Cada secante pasa por los dos últimos iterados y corta el eje en el siguiente: "
        f"x₁ = {num(xs[2], 5)}, x₂ = {num(xs[3], 5)}, x₃ = {num(xs[4], 5)}. "
        "La tercera sale de dos puntos del mismo lado de la raíz: no hace falta encerrarla.",
        W, H, 1.5, 2.7, -0.5, 1.25, m=(16, 16, 40, 48),
    )
    c.ejes([1.6, 1.8, 2.0, 2.2, 2.4, 2.6], [-0.4, 0, 0.4, 0.8, 1.2], eje_x_en=0, xlab="x")
    c.curva(F, 1.5, 2.7, color=ACCENT, w=2.4)
    c.texto(2.36, F(2.36) + 0.12, "F(x)", ACCENT, "end", italica=True, halo=True)
    colores = [ACCENT2, GOOD, BAD]
    for i in range(3):
        xa, xb, xn = xs[i], xs[i + 1], xs[i + 2]
        # recta por (xa, F(xa)) y (xb, F(xb)), prolongada hasta el eje
        xi, xf = min(xa, xb, xn), max(xa, xb, xn)
        m = (F(xb) - F(xa)) / (xb - xa)
        r = lambda x: F(xb) + m * (x - xb)
        c.linea(xi, r(xi), xf, r(xf), colores[i], 1.8, dash=None if i < 2 else "6 4")
        c.punto(xa, F(xa), colores[i], 3.5)
        c.punto(xb, F(xb), colores[i], 3.5)
        c.punto(xn, 0, colores[i], 3.5, hueco=True)
    # Los dos arranques: vertical punteada hasta el eje
    for x in xs[:2]:
        c.linea(x, 0, x, F(x), MUTED, 0.9, dash="2 3")
        c.punto(x, 0, TEXT, 3.2)
    et = [(xs[0], 0.1, "middle", "x₋₁"), (xs[1], -0.1, "middle", "x₀"),
          (xs[2], 0.1, "end", "x₁"), (xs[3], 0.1, "end", "x₂"), (xs[4], 0.1, "start", "x₃")]
    for x, y, anc, s in et:
        c.texto(x + (-0.01 if anc == "end" else 0.01 if anc == "start" else 0), y, s, TEXT, anc,
                size=13, peso=600, halo=True, base="middle")
    c.texto(1.52, 1.1, "Secantes: 1ª, 2ª y 3ª (punteada)", MUTED, size=12, halo=True)
    c.guardar()
    return xs


# --------------------------------------------------------------------------
# 8. Convergencia comparada: log10(Δ) vs k
# --------------------------------------------------------------------------


def series_convergencia():
    """Δ de cada método con la definición de las tablas de la clase, hasta Δ < TOL."""
    out = {}
    # Bisección: Δm_{k+1} = (b_k − a_k)/2, fila k = 0, 1, …
    fb = biseccion(1.6, 2.6, 30)
    s = []
    for f in fb:
        s.append((f["k"], f["dm"]))
        if f["dm"] < TOL:
            break
    out["Bisección"] = s
    # Regula-Falsi: Δ_k = |m_{k+1} − m_k|, k = 1, 2, …
    fr = regula_falsi(1.6, 2.6, 40)
    s = []
    for k in range(1, len(fr)):
        d = abs(fr[k]["m"] - fr[k - 1]["m"])
        s.append((k, d))
        if d < TOL:
            break
    out["Regula-Falsi"] = s
    # Punto fijo (φ = 1), x0 = 1,6: Δ_k = |x_k − x_{k−1}|
    xs = punto_fijo(g1, 1.6, 40)
    s = []
    for k in range(1, len(xs)):
        d = abs(xs[k] - xs[k - 1])
        s.append((k, d))
        if d < TOL:
            break
    out["Punto fijo"] = s
    # Secante: fila k usa x_{k−1}, x_k → x_{k+1}; Δ = |x_{k+1} − x_k|
    xs = secante(1.6, 2.6, 10)
    s = []
    for k in range(0, len(xs) - 2):
        d = abs(xs[k + 2] - xs[k + 1])
        s.append((k, d))
        if d < TOL:
            break
    out["Secante"] = s
    # Newton, x0 = 1,6
    xs = newton(F, dF, 1.6, 10)
    s = []
    for k in range(1, len(xs)):
        d = abs(xs[k] - xs[k - 1])
        s.append((k, d))
        if d < TOL:
            break
    out["Newton"] = s
    return out


def orden_y_lambda(serie, p_teo):
    """p y λ experimentales con tres diferencias consecutivas (fórmulas del §7)."""
    d = [v for _, v in serie]
    res = []
    for i in range(2, len(d)):
        try:
            p = math.log(d[i] / d[i - 1]) / math.log(d[i - 1] / d[i - 2])
        except (ValueError, ZeroDivisionError):
            p = float("nan")
        lam = d[i] / d[i - 1] ** p_teo
        res.append((serie[i][0], p, lam))
    return res


def g_convergencia(series):
    H = 380
    c = Lienzo(
        "convergencia",
        "Convergencia comparada de los cinco métodos: log₁₀(Δ) contra la iteración k",
        "Con F(x) = x²/4 − sen x y la misma tolerancia 0,5·10⁻⁵: bisección, regula-falsi y punto "
        "fijo bajan en línea recta (lineales, p = 1); secante y Newton caen cada vez más rápido "
        "(p ≈ 1,6 y p = 2). "
        + "; ".join(f"{m}: N = {s[-1][0]}" for m, s in series.items()),
        W, H, 0, 20, -11, 0, m=(30, 16, 40, 48),
    )
    c.ejes(range(0, 21, 2), range(-11, 1), xfmt=lambda v: str(v),
           yfmt=lambda v: str(v).replace("-", "−") if v % 2 == 0 else "", xlab="k", ylab="log₁₀ Δ")
    c.linea(0, math.log10(TOL), 20, math.log10(TOL), MUTED, 1.3, dash="6 4")
    c.texto(19.8, math.log10(TOL) + 0.2, "Δ = 0,5·10⁻⁵", MUTED, "end", size=12, halo=True)
    estilo = {
        "Bisección": (ACCENT, None, "p = 1, λ = 0,5"),
        "Regula-Falsi": (BAD, "7 3", "p ≈ 1, λ ≈ 0,25"),
        "Punto fijo": (GOOD, "2 3", "p = 1, λ ≈ 0,32"),
        "Secante": (WARN, "9 3 2 3", "p ≈ 1,6"),
        "Newton": (ACCENT2, None, "p = 2"),
    }
    # posiciones de las etiquetas (a mano, para que no se pisen) — sólo ubicación, no datos
    etiq = {
        "Bisección": (14.2, -2.9, "middle"),
        "Regula-Falsi": (7.4, -6.2, "middle"),
        "Punto fijo": (10.4, -6.2, "start"),
        "Secante": (5.5, -7.9, "start"),
        "Newton": (5.5, -9.9, "start"),
    }
    for m, s in series.items():
        col, dash, texto = estilo[m]
        pts = [(k, math.log10(d)) for k, d in s]
        c.poli(pts, col, 2.2, dash=dash)
        for k, y in pts:
            c.punto(k, y, col, 2.8)
        x, y, anc = etiq[m]
        c.texto(x, y, m, col, anc, size=13, peso=700, halo=True)
        c.texto(x, y - 0.5, texto, col, anc, size=12, halo=True)
        # marca de N sobre el eje
    c.guardar()


# --------------------------------------------------------------------------
# Controles contra el apunte y la clase
# --------------------------------------------------------------------------


def controles():
    ok = True

    def chequear(nombre, obtenido, esperado, tol):
        nonlocal ok
        bien = abs(obtenido - esperado) <= tol
        ok &= bien
        print(f"  [{'OK' if bien else 'NO'}] {nombre}: {obtenido:.6g} (esperado {esperado})")

    print(f"α = {ALFA:.10f}")
    chequear("α (clase 1,93375)", ALFA, 1.93375, 5e-6)
    chequear("g'(α) (apunte ≈ −0,322)", dg1(ALFA), -0.322, 5e-4)
    chequear("λ Newton |F''/2F'| (apunte ≈ 0,543)", abs(d2F(ALFA) / (2 * dF(ALFA))), 0.543, 5e-4)
    lam_sec = abs(d2F(ALFA) / (2 * dF(ALFA))) ** 0.618
    print(f"  λ secante teórico |F''/2F'|^0,618 = {lam_sec:.3f} (apunte ≈ 0,5–0,7)")
    print(f"  g'(α) con φ = 2: {dg2(ALFA):.4f}  (|g'| > 1 → diverge)")

    fb = biseccion(1.6, 2.6, 18)
    print("\nBisección [1,6; 2,6] (tabla de la clase):")
    for f in fb[:6]:
        print(f"  k={f['k']:2d} a={f['a']:.5f} b={f['b']:.5f} m={f['m']:.5f} Δm={f['dm']:.5f} F(m)={F(f['m']):+.5f}")
    chequear("bisección m5 (clase 1,94375)", fb[4]["m"], 1.94375, 1e-9)
    chequear("bisección m6 (clase 1,928125)", fb[5]["m"], 1.928125, 1e-9)
    kk = (math.log((2.6 - 1.6) / 0.02) / math.log(2)) - 1
    chequear("k > ln(L/ε)/ln2 − 1 con ε=0,02 (apunte 4,64)", kk, 4.64, 5e-3)

    rf = regula_falsi(1.6, 2.6, 12)
    print("\nRegula-Falsi [1,6; 2,6]:")
    for f in rf[:10]:
        print(f"  k={f['k']:2d} a={f['a']:.5f} b={f['b']:.5f} m={f['m']:.6f}")

    xs = punto_fijo(g1, 1.6, 11)
    print("\nPunto fijo g = x − F, x0 = 1,6 (tabla de la clase):")
    print("  " + ", ".join(f"{x:.5f}" for x in xs))
    chequear("PF x1 (clase 1,95957)", xs[1], 1.95957, 5e-6)
    chequear("PF x2 (clase 1,92496)", xs[2], 1.92496, 5e-6)
    chequear("PF x3 (clase 1,93653)", xs[3], 1.93653, 5e-6)

    xs = newton(F, dF, 1.6, 6)
    print("\nNewton x0 = 1,6 (tabla de la clase):")
    print("  " + ", ".join(f"{x:.5f}" for x in xs))
    chequear("Newton x1 (clase 2,03364)", xs[1], 2.03364, 5e-6)
    chequear("Newton x2 (clase 1,93856)", xs[2], 1.93856, 5e-6)
    chequear("Newton x3 (clase 1,93377)", xs[3], 1.93377, 5e-6)

    xs = secante(1.6, 2.6, 5)
    print("\nSecante x₋₁ = 1,6, x0 = 2,6 (tabla de la clase):")
    print("  " + ", ".join(f"{x:.5f}" for x in xs))
    chequear("Secante x1 (clase 1,83439)", xs[2], 1.83439, 5e-6)
    chequear("Secante x2 (clase 1,90762)", xs[3], 1.90762, 5e-6)
    chequear("Secante x3 (clase 1,93528)", xs[4], 1.93528, 5e-6)
    chequear("Secante x4 (clase 1,93373)", xs[5], 1.93373, 5e-6)

    series = series_convergencia()
    print("\nConvergencia comparada (Δ < 0,5·10⁻⁵):")
    esperado = {"Bisección": 17, "Regula-Falsi": 8, "Punto fijo": 10, "Secante": (5, 6), "Newton": 5}
    p_teo = {"Bisección": 1, "Regula-Falsi": 1, "Punto fijo": 1, "Secante": 1.618, "Newton": 2}
    for m, s in series.items():
        N = s[-1][0]
        e = esperado[m]
        bien = N in e if isinstance(e, tuple) else N == e
        ok &= bien
        pl = orden_y_lambda(s, p_teo[m])
        mitad = [f"k={k}: p={p:.3f} λ={l:.3f}" for k, p, l in pl]
        print(f"  [{'OK' if bien else 'NO'}] {m}: N = {N} (clase {e})")
        print("        Δ = " + ", ".join(f"{d:.2e}" for _, d in s))
        print("        " + "; ".join(mitad))
    print("\nTodo coincide." if ok else "\nHAY DIFERENCIAS: revisar.")
    return ok, series


def main():
    ok, series = controles()
    if "--check" in sys.argv:
        sys.exit(0 if ok else 1)
    print("\nGenerando SVG en", SALIDA.relative_to(RAIZ))
    g_biseccion()
    g_biseccion_cota()
    xs = punto_fijo(g1, 1.6, 3)
    telarana(
        "punto-fijo", g1, 1.6, 8,
        "Punto fijo con g(x) = x − (x²/4 − sen x) desde x₀ = 1,6: telaraña que converge oscilando",
        f"Como g'(α) ≈ {num(dg1(ALFA), 2)} es negativa y de módulo menor que 1, los iterados saltan de "
        f"un lado al otro de α ({' → '.join(num(x, 5) for x in xs)} → …) y la espiral se cierra: "
        "el error se achica a un tercio por paso.",
        "g(x)", f"g'(α) ≈ {num(dg1(ALFA), 2)}", (1.58, 2.02), [1.6, 1.7, 1.8, 1.9, 2.0],
    )
    xs = punto_fijo(g2, 1.9, 4)
    telarana(
        "punto-fijo-divergente", g2, 1.9, 6,
        "Punto fijo con g(x) = x − 2(x²/4 − sen x): la telaraña se abre y diverge",
        f"Misma raíz, pero con φ = 2 queda g'(α) ≈ {num(dg2(ALFA), 2)}: cada salto es más grande que "
        f"el anterior ({' → '.join(num(x, 3) for x in xs)} → …) aunque x₀ = 1,9 arranca muy cerca de α.",
        "g(x)", f"g'(α) ≈ {num(dg2(ALFA), 2)}", (1.55, 2.45), [1.6, 1.8, 2.0, 2.2, 2.4],
    )
    g_newton()
    g_newton_falla()
    g_fourier()
    g_secante()
    g_convergencia(series)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
