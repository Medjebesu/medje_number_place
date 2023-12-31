import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame} from "@react-three/fiber"
import {ContactShadows, OrbitControls} from "@react-three/drei"
import CameraControls from 'camera-controls'
import { GameControl } from './GameControl'

//for debug
//import { Debug_DrawNumberBlocks } from './debug'

CameraControls.install({ THREE })

export const NumberPlaceGameDisp:React.FC = () => {

  return(
    <Canvas>
      <pointLight position={[45, 45, 100]} />
      <GameControl />
      <Controls />
    </Canvas>
  );
}

function Controls(){
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [])

  return useFrame((state, delta) => {
    controls.setLookAt(0, -0.75, 7.5, 0, -0.75, 0, true)
    return controls.update(delta)
  })
}
