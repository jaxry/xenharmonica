import type Block from './Block'
import type Chain from './Chain'
import Section from './Section'
import type Track from './Track'

export type ChainLocation = {
  trackIndex: number, 
  chainIndex: number, 
  section: Section,
  track: Track, 
  chain: Chain,
}

export type BlockLocation = ChainLocation & {
  blockIndex: number,
  block: Block
  beginning: number
}

export type BlockLocationWithSection = BlockLocation & { block: Block & { element: Section }}

export function isSection(loc: BlockLocation): loc is BlockLocationWithSection {
    return loc.block.element instanceof Section
}