/**
 * Canvas Engine entry point
 */

import { drawFormatA, generateFormatA } from './formatA';
import { drawFormatB, generateFormatB } from './formatB';
import { getFunTitle } from '../data/builderTitles';

// Preview compatibility aliases
export const renderPFPFrame = drawFormatA;
export const renderIDCard = drawFormatB;

export {
  drawFormatA,
  generateFormatA,
  drawFormatB,
  generateFormatB,
  getFunTitle
};
