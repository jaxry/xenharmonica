import React, { useEffect, useRef, useState } from 'react'
import sequencerKeyBinds from './sequencerKeyBinds'
import Composition from '../composition/Composition'
import Track from "../composition/Track"
import Pitch from '../Pitch'
import { last, mapIter } from '../util'
import useClickOutside from './hooks/useClickOutside'
import useKeyPress from './hooks/useKeyPress'
import style from './Sequencer.module.css'
import { globalPosition, initialState, selectBlock, SequencerState, setSelected } from './SequencerState'
import { playFreq } from '../play'
import shiftPitch from '../operations/shiftPitch'
import useWheel from './hooks/useWheel'
import BlockComponent from './BlockComponent'

export default function Sequencer(props: { composition: Composition }) {
  const { composition } = props
  const { modulations } = composition

  const [state, _setState] = useState<SequencerState>(initialState(composition))

  const { sectionStack, selectedLocation } = state

  const active = last(sectionStack)
  const { section, beginning } = active

  const prevPitch = useRef<Pitch>()

  const setState = (newState: SequencerState) => {
    const modulation = newState.selectedLocation ? 
      modulations.totalModulationAtPosition(globalPosition(newState)) : 
      1

    const elem = newState.selectedLocation?.block.element
    if (elem instanceof Pitch) {
      const freq = elem.ratio * modulation
      if (elem !== prevPitch.current) {
        playFreq(freq)
      }
      prevPitch.current = elem
    }

    _setState(newState)
  }

  useKeyPress((e) => {
    const newState = sequencerKeyBinds(e, composition, state)
    setState(newState)
    e.preventDefault()
  }, undefined, selectedLocation !== null)

  const onWheel = useWheel((delta) => {
    if (!selectedLocation) {
      return
    }
    shiftPitch(selectedLocation?.block, composition.intervals, delta)
    setState({...state})
  })

  const sequencerRef = useRef<HTMLDivElement>(null)
  useClickOutside(sequencerRef, (e) => {
    setState(setSelected(state, null))
  })

  const blockHeight = 2.5 / section.minBlockDuration
  const editingBlockRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    editingBlockRef.current?.scrollIntoView({block: 'center'})
  }, [selectedLocation])

  const renderTrack = (track: Track) => {
    return track.chains.map(chain => {
      return  <div key={chain.id} className={style.chain} style={{top: `${chain.beginning * blockHeight}rem`}}>
      {chain.blocks.map(block => {
          const isSelected = (selectedLocation && block === selectedLocation.block) || false

          return <BlockComponent 
            block={block} 
            blockHeight={blockHeight} 
            isSelected={isSelected} 
            onClick={() => setState(selectBlock(state, block))} 
            ref={isSelected ? editingBlockRef : undefined}
          />
      })}
    </div>
    })
  }

  return <div className={style.sequencer} onWheel={onWheel}>  
    <div className={style.section} ref={sequencerRef} style={{height: `${section.duration * blockHeight}rem`}}>
      <div className={style.tracks}>
        {section.tracks.map((track, trackIndex) => {
          return <div key={trackIndex} className={style.track}>
            {renderTrack(track)}
          </div>
        })}
      </div>

      <div className={style.modulations}>
        {mapIter(modulations.modulationsBetween(beginning, beginning + active.tempo * section.duration), (m, i) => {
          const position = (m.position - beginning) / active.tempo
          return <div key={i} className={style.modulation} style={{top: `${blockHeight * position}rem`}}>
            {m.interval.numerator} / {m.interval.denominator}
          </div>
        })}
      </div>
    </div>
    {/* <div>
      <button className={common.primary} onClick={() => composition.play()}>Play</button>
    </div> */}
  </div>
}