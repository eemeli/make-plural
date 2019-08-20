import pluralData from 'cldr-core/supplemental/plurals.json'
import ordinalData from 'cldr-core/supplemental/ordinals.json'
import MakePluralCompiler from 'make-plural-compiler'

export default function getCompiler({ cardinals, ordinals, width }) {
  const MakePlural = MakePluralCompiler.load(pluralData, ordinalData)
  MakePlural.cardinals = cardinals
  MakePlural.ordinals = ordinals
  if (width > 0) MakePlural.foldWidth = width
  return MakePlural
}
