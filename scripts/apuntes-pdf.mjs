/* ============================================================================
   laboratorio-modelacion-numerica — PDF de los apuntes teóricos
   ----------------------------------------------------------------------------
   Corre DESPUÉS de `next build`: sirve out/ con un servidor estático mínimo
   (respetando NEXT_PUBLIC_BASE_PATH, igual que GitHub Pages), abre cada
   /apunte/<id>/ con Chromium headless y guarda out/apuntes/<id>.pdf.

   El PDF sale de la hoja @media print de styles.css (la misma que usa Ctrl+P
   en el navegador), así que la página y el PDF no pueden divergir.

   Uso:  npm run build && npm run pdf
   ========================================================================== */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(RAIZ, 'out');
const APUNTES = path.join(RAIZ, 'content', 'apuntes');
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

function servir() {
  const servidor = http.createServer((req, res) => {
    let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (BASE) {
      if (ruta !== BASE && !ruta.startsWith(`${BASE}/`)) {
        res.writeHead(404).end();
        return;
      }
      ruta = ruta.slice(BASE.length) || '/';
    }
    let archivo = path.join(OUT, ruta);
    if (!archivo.startsWith(OUT)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(archivo) && fs.statSync(archivo).isDirectory()) {
      archivo = path.join(archivo, 'index.html');
    }
    if (!fs.existsSync(archivo)) {
      res.writeHead(404).end();
      return;
    }
    const tipo = TIPOS[path.extname(archivo).toLowerCase()] ?? 'application/octet-stream';
    res.writeHead(200, { 'content-type': tipo });
    fs.createReadStream(archivo).pipe(res);
  });
  return new Promise((ok) => servidor.listen(0, '127.0.0.1', () => ok(servidor)));
}

// Pie de página: título del apunte + número de página. Chromium rellena las
// clases title/pageNumber/totalPages; el template no hereda estilos del sitio.
const PIE = `
  <div style="width:100%; padding:0 14mm; font:8px system-ui, sans-serif; color:#5a6b7a;
              display:flex; justify-content:space-between;">
    <span class="title"></span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;

async function main() {
  if (!fs.existsSync(OUT)) {
    console.error('No existe out/: corré `npm run build` antes de `npm run pdf`.');
    process.exit(1);
  }
  const ids = fs.existsSync(APUNTES)
    ? fs.readdirSync(APUNTES).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)).sort()
    : [];
  if (ids.length === 0) {
    console.log('No hay apuntes en content/apuntes/: nada que generar.');
    return;
  }

  const servidor = await servir();
  const { port } = servidor.address();
  const origen = `http://127.0.0.1:${port}${BASE}`;
  const destino = path.join(OUT, 'apuntes');
  fs.mkdirSync(destino, { recursive: true });

  let navegador;
  let fallas = 0;
  try {
    navegador = await chromium.launch();
    // colorScheme light: el PDF siempre sale en tema claro (la hoja de
    // impresión también lo fuerza, esto es un segundo seguro).
    const contexto = await navegador.newContext({ colorScheme: 'light' });
    for (const id of ids) {
      const pagina = await contexto.newPage();
      const errores = [];
      pagina.on('pageerror', (e) => errores.push(e.message));
      const url = `${origen}/apunte/${id}/`;
      const resp = await pagina.goto(url, { waitUntil: 'networkidle' });
      if (!resp || !resp.ok()) {
        console.error(`✗ ${id}: ${url} respondió ${resp?.status()}`);
        fallas++;
        await pagina.close();
        continue;
      }
      // Las fuentes de KaTeX se piden recién cuando hay texto que las usa.
      await pagina.evaluate(() => document.fonts.ready);
      await pagina.emulateMedia({ media: 'print' });

      const archivo = path.join(destino, `${id}.pdf`);
      await pagina.pdf({
        path: archivo,
        format: 'A4',
        printBackground: true,
        margin: { top: '16mm', right: '14mm', bottom: '18mm', left: '14mm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: PIE,
      });
      if (errores.length) {
        console.error(`✗ ${id}: errores en la página:\n  ${errores.join('\n  ')}`);
        fallas++;
      } else {
        const kb = Math.round(fs.statSync(archivo).size / 1024);
        console.log(`✓ ${path.relative(RAIZ, archivo)} (${kb} KB)`);
      }
      await pagina.close();
    }
  } finally {
    await navegador?.close();
    servidor.close();
  }
  if (fallas) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
