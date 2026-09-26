/* ============================================================================
   laboratorio-modelacion-numerica — apuntes teóricos
   ----------------------------------------------------------------------------
   Cada apunte es un Markdown en content/apuntes/<id-de-unidad>.md. Se lee y se
   renderiza en build (sólo server): el export estático emite el HTML con las
   fórmulas ya resueltas por KaTeX, igual que las unidades.

   Las fórmulas se extraen ANTES de pasar el texto por marked y se reponen
   después: así marked no interpreta los `_`, `*` ni `\\` del LaTeX, y un
   `$$…$$` puede ocupar varias líneas.

   Gráficos: una línea `::grafico[nombre]{Epígrafe}` inserta inline el SVG de
   content/apuntes/graficos/<nombre>.svg dentro de un <figure> con el epígrafe
   como <figcaption>. También va por placeholder, así marked no toca el SVG.
   Los SVG se generan con scripts/ (ver el encabezado de cada script).
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { tex } from '@/lib/tex';

const DIR = path.join(process.cwd(), 'content', 'apuntes');

/** Ids de las unidades que tienen apunte (nombre del archivo sin `.md`). */
export function idsConApunte(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.slice(0, -3))
    .sort();
}

export function tieneApunte(id: string): boolean {
  return idsConApunte().includes(id);
}

export interface Apunte {
  titulo: string;
  html: string;
}

/** Lee y renderiza el apunte de una unidad. El título sale del primer `# `. */
export function leerApunte(id: string): Apunte | null {
  const archivo = path.join(DIR, `${id}.md`);
  if (!fs.existsSync(archivo)) return null;
  const md = fs.readFileSync(archivo, 'utf8');
  const titulo = md.match(/^#\s+(.+)$/m)?.[1].trim() ?? id;
  return { titulo, html: renderizar(md) };
}

const DIR_GRAFICOS = path.join(DIR, 'graficos');
const RE_GRAFICO = /^::grafico\[([\w-]+)\]\{(.*)\}[ \t]*$/gm;

/** Texto corto en una línea (epígrafe): fórmulas `$…$` con KaTeX y Markdown en línea. */
function renderizarEnLinea(src: string): string {
  const formulas: string[] = [];
  const texto = src.replace(/\$([^$\n]+?)\$/g, (_, f: string) => `@@F${formulas.push(tex(f, false)) - 1}@@`);
  return (marked.parseInline(texto, { async: false, gfm: true }) as string).replace(
    /@@F(\d+)@@/g,
    (_, i: string) => formulas[Number(i)],
  );
}

/** `<figure>` con el SVG inline. Si falta el archivo, el build falla (mejor que un hueco). */
function figura(nombre: string, epigrafe: string): string {
  const archivo = path.join(DIR_GRAFICOS, `${nombre}.svg`);
  if (!fs.existsSync(archivo)) throw new Error(`Apuntes: no existe el gráfico ${archivo}`);
  const svg = fs.readFileSync(archivo, 'utf8').trim();
  const cap = epigrafe.trim() ? `<figcaption>${renderizarEnLinea(epigrafe.trim())}</figcaption>` : '';
  return `<figure class="apunte-fig" id="fig-${nombre}">${svg}${cap}</figure>`;
}

function renderizar(md: string): string {
  const formulas: string[] = [];
  const guardar = (html: string) => `@@F${formulas.push(html) - 1}@@`;
  const graficos: string[] = [];

  const texto = md
    // Primero los gráficos (su epígrafe puede traer fórmulas): cada uno queda
    // como un párrafo propio con su placeholder.
    .replace(RE_GRAFICO, (_, nombre: string, epigrafe: string) =>
      `\n\n@@G${graficos.push(figura(nombre, epigrafe)) - 1}@@\n\n`,
    )
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, src: string) => guardar(tex(src.trim(), true)))
    .replace(/\$([^$\n]+?)\$/g, (_, src: string) => guardar(tex(src, false)));

  const html = (marked.parse(texto, { async: false, gfm: true }) as string)
    // Una fórmula display sola en su párrafo va en un bloque propio.
    .replace(/<p>\s*(@@F\d+@@)\s*<\/p>/g, '<div class="apunte-math">$1</div>')
    // Las tablas anchas scrollean dentro de su contenedor, no la página.
    .replace(/<table>/g, '<div class="scrollx"><table>')
    .replace(/<\/table>/g, '</table></div>')
    // Un gráfico reemplaza a su párrafo entero.
    .replace(/<p>\s*@@G(\d+)@@\s*<\/p>/g, (_, i: string) => graficos[Number(i)]);

  return html.replace(/@@F(\d+)@@/g, (_, i: string) => formulas[Number(i)]);
}
