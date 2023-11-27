import React, { useRef } from 'react'
import { useFrame } from "@react-three/fiber"
import { Text, RoundedBox, RenderTexture, PerspectiveCamera } from "@react-three/drei";

type Props = {
}

export const Debug_DrawNumberBlocks: React.FC<Props>  = (props) =>{
  const testNum = [
    7,0,2, 8,0,4, 0,9,0,
    0,3,0, 2,0,0, 1,7,0,
    0,5,0, 0,0,9, 0,4,0,
  
    0,0,0, 0,8,0, 0,3,0,
    3,0,5, 0,6,0, 0,0,0,
    0,0,0, 4,2,0, 0,0,0,
  
    0,1,0, 6,9,0, 7,0,0,
    0,0,0, 3,0,0, 9,2,1,
    8,0,0, 5,0,0, 0,6,0
  ]

  const horBoxpos = [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75, 4.25]
  const verBoxpos = [4.25, 3.75, 3.25, 2.75, 2.25, 1.75, 1.25, 0.75, 0.25]

  const numberBlock = [];

  //const textRef = useRef<THREE.Mesh>(null!)
  //useFrame((state) => (textRef.current.position.x = Math.sin(state.clock.elapsedTime) * 2))

  const fontProps = { font: '/Inter-Bold.woff', fontSize: 2.5, letterSpacing: 0.5, lineHeight: 1, 'material-toneMapped': false }

  const renderedNumber =(
    <RenderTexture attach="map" anisotropy={16} >
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 2, 6]} />
      <color attach="background" args={['orange']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Text color="#555" characters='123456789' {...fontProps}>
        123456789
      </Text>
    </RenderTexture>
  )

  for (let y=0; y < 9; y++){
    let linetop = y*9

    for (let x=0; x < 9; x++){
      let idx = x+linetop
      if (testNum[idx] != 0){
        numberBlock.push(
          <group>
            <mesh position={[horBoxpos[x], verBoxpos[y], -0.1]}>
              <RoundedBox
                args={[0.45, 0.45, 0.1]}
                radius={0.025}
                smoothness={4}
                bevelSegments={4}
                creaseAngle={0.4}
              >
                <meshBasicMaterial>
                  {renderedNumber}
                </meshBasicMaterial>
              </RoundedBox>
            </mesh>
          </group>
        )
      }
      else{
        numberBlock.push(
          <group>
            <mesh position={[horBoxpos[x], verBoxpos[y], -0.1]}>
              <RoundedBox
                args={[0.45, 0.45, 0.1]}
                radius={0.025}
                smoothness={4}
                bevelSegments={4}
                creaseAngle={0.4}
              >
                <meshBasicMaterial color="orange"/>
              </RoundedBox>
            </mesh>
          </group>
        )
      }
    }
  }

  // ※Textのanchor座標は文字列描画の位置の左上(X,Yの正負が反転してる？)
  return <>
    {numberBlock}
  </>;
}
