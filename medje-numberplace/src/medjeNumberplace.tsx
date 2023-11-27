import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame} from "@react-three/fiber"
import {ContactShadows, OrbitControls} from "@react-three/drei"
import CameraControls from 'camera-controls'
import { DrawStageBase } from './DispDraw'

//for debug
import { Debug_DrawNumberBlocks } from './debug'

CameraControls.install({ THREE })

export const GameDisp:React.FC = () => {

  
  return(
    <Canvas>
      <pointLight position={[45, 45, 100]} />
      <DrawStageBase/>

      <Debug_DrawNumberBlocks />
      <ContactShadows frames={1} position={[0, -0.5, 0]} blur={1} opacity={0.45} />
      <ContactShadows frames={1} position={[0, -0.5, 0]} blur={3} color="green" />
      <Controls />
    </Canvas>
  );
}

function Controls(){
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [])

  return useFrame((state, delta) => {
    controls.setLookAt(2,2,4, 2,2,0, true)
    return controls.update(delta)
  })
}
