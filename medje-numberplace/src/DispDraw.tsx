import React from 'react'
import { DrawGrid, DrawBackGround } from './draw3ds'

export const DrawStageBase:React.FC = () => {
  return(
    <>
      <group position={[0,0, -0.05]}>
        <DrawBackGround/>
        <DrawGrid scale={3} pitch={1.5} color='green' lineWidth={5} zIndex={0.01} key='area'/>
      </group>
    </>
  );
}
