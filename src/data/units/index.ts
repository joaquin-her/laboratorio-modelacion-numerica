/* ============================================================================
   mode_quizz — registro de unidades
   ----------------------------------------------------------------------------
   Cada unidad real vive en su propio módulo dentro de este directorio y se
   suma acá, en el orden en que debe aparecer en el selector.

   `_plantilla.ts` es un molde para dar de alta unidades nuevas: no se
   registra, así que nunca aparece en el selector del sitio publicado.
   ========================================================================== */

import type { Unidad } from '@/types/quiz';
import { unidad as metodosNumericosGuia1 } from './metodos-numericos-guia-1';
import { unidad as modelacionGuia2Enl } from './modelacion-guia-2-enl';
import { unidad as modelacionGuia3Sel } from './modelacion-guia-3-sel';
import { unidad as modelacionGuia4Senl } from './modelacion-guia-4-senl';

export const UNIDADES: Unidad[] = [
  metodosNumericosGuia1,
  modelacionGuia2Enl,
  modelacionGuia3Sel,
  modelacionGuia4Senl,
];

export function unidadPorId(id: string): Unidad | undefined {
  return UNIDADES.find((u) => u.id === id);
}
