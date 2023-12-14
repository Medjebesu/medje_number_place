import React from 'react'
import { DrawStageBase } from './DispDraw'
import { BlocksControl } from "./BlocksControl"
import { BoardInitializer } from './BlocksStateControl'
import { GameStatusInitializer } from '../hudCtrl'

export const GameControl:React.FC = () => {
    
  const blockSize = 1.0

  return (
    <>
      <DrawStageBase blockSize={blockSize}/>
      <BlocksControl blockSize={blockSize}/>
      <BoardInitializer/>
      <GameStatusInitializer/>
    </>
  )
}