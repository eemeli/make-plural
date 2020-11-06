import pluralData from 'cldr-core/supplemental/plurals.json'
import ordinalData from 'cldr-core/supplemental/ordinals.json'
import { Compiler } from 'make-plural-compiler'

export default function getCompiler({ cardinals, ordinals }) {
  Compiler.load(pluralData, ordinalData)
  Compiler.cardinals = cardinals
  Compiler.ordinals = ordinals
  return Compiler
}
