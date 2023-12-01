import React from 'react'
import * as THREE from 'three'
import { Text, RoundedBox } from "@react-three/drei";

type Props = {
  blocknum:number
  position:THREE.Vector3 | undefined
  color:THREE.ColorRepresentation  | undefined
  width:number
  height?:number
  volume?:number
}

// 線リスト描画
export const DrawNumberBlock:React.FC<Props> = (props) => {
  const blockHeight = (props.height || props.width)
  const blockVolume = (props.volume || props.width)
  const blockNum = (props.blocknum == 0 ? " " : props.blocknum.toString())

  const fontProps = { font: '/Inter-Bold.woff', fontSize: props.width, letterSpacing: props.width / 2, lineHeight: blockHeight, 'material-toneMapped': false }
  const NumText = (
    <Text color="#555" position={[0, -(blockHeight/10),blockVolume]} {...fontProps}>
      {blockNum}
    </Text>
  )

  return(
    <group>
      <mesh position={props.position}>
        <RoundedBox
          args={[props.width, blockHeight, blockVolume]}
          radius={0.025}
          smoothness={4}
          bevelSegments={4}
          creaseAngle={0.4}
        >
          {NumText}
          <meshBasicMaterial color={props.color}/>
        </RoundedBox>
      </mesh>
    </group>
  );
}