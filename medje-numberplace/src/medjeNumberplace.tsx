import React from 'react'
import { Canvas } from "@react-three/fiber";
import { DrawStageBase} from './DispDraw'

export function GameDisp() {

  return(
    <Canvas>
      <pointLight position={[0, 0, 0]} />
      <DrawStageBase/>
    </Canvas>
  );
}