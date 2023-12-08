import React from 'react'
import { DrawStageBase } from './DispDraw'
import { BlocksControl } from "./BlocksControl"

export const GameControl:React.FC = () => {
    
  const blockSize = 1.0

  return (
    <group>
      <DrawStageBase blockSize={blockSize}/>
      <BlocksControl blockSize={blockSize}/>
    </group>
  )
}