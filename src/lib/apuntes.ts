/* ============================================================================
   laboratorio-modelacion-numerica — apuntes teóricos
   ----------------------------------------------------------------------------
   Cada apunte es un Markdown en content/apuntes/<id-de-unidad>.md. Se lee y se
   renderiza en build (sólo server): el export estático emite el HTML con las
   fórmulas ya resueltas por KaTeX, igual que las unidades.

   Las fórmulas se extraen ANTES de pasar el texto por marked y se reponen
   después: así marked no interpreta los `_`, `*` ni `\\` del LaTeX, y un
   `$$…$$` puede ocupar varias líneas.
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

function renderizar(md: string): string {
  const formulas: string[] = [];
  const guardar = (html: string) => `@@F${formulas.push(html) - 1}@@`;

  const texto = md
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, src: string) => guardar(tex(src.trim(), true)))
    .replace(/\$([^$\n]+?)\$/g, (_, src: string) => guardar(tex(src, false)));

  const html = (marked.parse(texto, { async: false, gfm: true }) as string)
    // Una fórmula display sola en su párrafo va en un bloque propio.
    .replace(/<p>\s*(@@F\d+@@)\s*<\/p>/g, '<div class="apunte-math">$1</div>')
    // Las tablas anchas scrollean dentro de su contenedor, no la página.
    .replace(/<table>/g, '<div class="scrollx"><table>')
    .replace(/<\/table>/g, '</table></div>');

  return html.replace(/@@F(\d+)@@/g, (_, i: string) => formulas[Number(i)]);
}
