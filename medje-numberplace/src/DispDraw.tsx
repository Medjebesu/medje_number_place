import React from 'react'
import { DrawGrid } from './draw3ds'

export const DrawStageBase:React.FC = () => {
  return(
    <>
      <group position={[-45, -45, -75]}>
        <DrawGrid scale={3} pitch={30} color='black' lineWidth={10} key='area'/>
        <DrawGrid scale={9} pitch={10} color='black' lineWidth={2} key='base'/>
      </group>
    </>
  );
}
