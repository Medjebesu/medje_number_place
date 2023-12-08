import React from 'react'
import { DrawGrid, DrawBackGround } from '../draw3ds'

type Props = {
  blockSize:number
}

export const DrawStageBase:React.FC<Props>  = (props) =>{
  return(
    <group position={[props.blockSize*-4.575 ,props.blockSize*-4.875, 0.0]}>
      <DrawBackGround/>
      <DrawGrid scale={3} pitch={props.blockSize*3.15} color='green' lineWidth={props.blockSize*4.0} zIndex={0.01} key='area'/>
    </group>
  );
}
