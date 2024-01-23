import { Text3D } from '@react-three/drei'
import React from 'react'

type Props ={
  textScale: number,
  textColor: THREE.Color | string,
  position?: THREE.Vector3,
  children: React.ReactNode
}

export const UIText:React.FC<Props> = ({children, textScale, textColor, position}:Props) => {
  const fontProps = { font: '/fonts/Roboto/Roboto Black.json', fontSize: 24, letterSpacing: 0, lineHeight: 24, 'material-toneMapped': false, characters: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" }
  return <mesh 
  >
    <Text3D 
      scale={textScale}
      position={position}
      {...fontProps}
    >
      <meshPhongMaterial color={textColor} />
      {children}
    </Text3D>
  </mesh>
}