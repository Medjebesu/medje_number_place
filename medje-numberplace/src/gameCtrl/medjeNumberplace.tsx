import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { ContactShadows, OrbitControls } from "@react-three/drei"
import CameraControls from 'camera-controls'
import { GameControl } from './Game'

//for debug
//import { Debug_DrawNumberBlocks } from './debug'

CameraControls.install({ THREE })

export const NumberPlaceGameDisp: React.FC = () => {
  return (
    <Canvas>
      <Controls />
      <ambientLight intensity={0.5} />
      <directionalLight color={"#ffffff"} intensity={1} position={[0, -2, 4]} />
      <GameControl />
    </Canvas>
  );
}

function Controls() {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [])

  return useFrame((_, delta) => {
    controls.setLookAt(1.0, -0.75, 8, 1.0, -0.75, 0, true)
    return controls.update(delta)
  })
}
