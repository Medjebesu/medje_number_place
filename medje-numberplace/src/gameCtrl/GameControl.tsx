import React from 'react'
import { DrawStageBase } from './DispDraw'
import { BlocksControl } from "./BlocksControl"
import { RecoilRoot } from 'recoil'

export const GameControl:React.FC = () => {
    
  const blockSize = 1.0

  return (
    <group>
      <RecoilRoot>
        <DrawStageBase blockSize={blockSize}/>
        <BlocksControl blockSize={blockSize}/>
      </RecoilRoot>
    </group>
  )
}