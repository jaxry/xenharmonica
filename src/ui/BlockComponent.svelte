<script lang="ts">
  import type Block from '../composition/Block'
  import Section from '../composition/Section'
  import Pitch from '../Pitch'

  export let block: Block
  export let blockHeight: number
  export let isSelected: boolean

  let elem: HTMLElement

  $: {
    if (isSelected && elem) {
      elem.scrollIntoView({block: 'center'})
    }
  }
</script>

<div
  class='block' 
  class:isSelected 
  style='height: {blockHeight * block.computedDuration}rem' 
  bind:this={elem}
  on:click
  on:contextmenu
>
  {#if block.element instanceof Pitch}
    {block.element.octave} . {block.element.interval.toString()}
  {:else if block.element instanceof Section}
    {block.element.name}
  {/if}

  <div>{block.duration.toString()}</div>
  
</div>

<style>
  .block {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    white-space: nowrap;
    font-weight: bold;
    user-select: none;
    cursor: pointer;
    border-bottom: var(--border);
  }

  .block:last-child {
    border-bottom: none;
  }

  .block:hover {
    background: var(--hover);
  }

  .block:active {
    background: var(--active);
  }

  .isSelected {
    background: var(--selected) !important;
  }
</style>