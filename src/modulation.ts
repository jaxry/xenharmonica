import Fraction from './Fraction'
import { deleteElem, sortedInsert } from './util'

export interface Modulation {
  time: number,
  interval: Fraction
}

export function modulateByInterval (ratio: number, interval: Fraction) {
  ratio *= interval.number
  // return ratio / 2 ** Math.floor(Math.log2(ratio * Math.SQRT2))
  return ratio
}

export function totalModulationAtTime (
    modulations: Modulation[], time: number) {
  let total = 1

  for (const modulation of modulations) {
    if (modulation.time > time) {
      break
    }
    total *= modulation.interval.number
  }

  // return total / 2 ** Math.floor(Math.log2(total * Math.SQRT2))
  return total

}

export function insertModulation (
    modulations: Modulation[], interval: Fraction, time: number) {

  const existingIndex = modulations.findIndex((element) => {
    return element.time === time
  })

  let modulation: Modulation

  if (existingIndex >= 0) {
    modulation = modulations[existingIndex]
    modulation.interval = interval
  } else {
    modulation = { time, interval }
    sortedInsert(modulations, modulation, modulation => modulation.time)
  }

  return modulation
}

export function removeModulation (
    modulations: Modulation[], modulation: Modulation) {
  deleteElem(modulations, modulation)
}