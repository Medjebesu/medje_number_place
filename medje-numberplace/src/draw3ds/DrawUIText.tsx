import { Text3D } from '@react-three/drei'
import React from 'react'

type Props ={
  textSize: number,
  textColor: THREE.Color | string,
  position?: THREE.Vector3,
  children: React.ReactNode
}

export const UIText:React.FC<Props> = ({children, textSize, textColor, position}:Props) => {  
  const fontProps = { font: '/fonts/Roboto/Roboto Black.json', fontSize: textSize, letterSpacing: 0, lineHeight: textSize, 'material-toneMapped': false, characters: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" }
  return <mesh 
  >
    <Text3D 
      position={position}
      {...fontProps}
    >
      <meshPhongMaterial color="#51ff41" />
      {children}
    </Text3D>
  </mesh>
}