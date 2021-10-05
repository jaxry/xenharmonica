import Block from '../composition/Block'
import type { BlockLocation } from '../composition/BlockLocation'
import Chain from '../composition/Chain'

export default function newChain(location: BlockLocation): BlockLocation {
  const { section, trackIndex, beginning } = location

  const newBlock = new Block()
  const newChain = new Chain([newBlock], beginning)

  section.getOrMakeTrack(trackIndex + 1).chains.push(newChain)
  section.refresh()

  return section.findBlock(newBlock)!
}
