import React from 'react'
import { Text, RoundedBox } from "@react-three/drei";

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

  const horAnchors = [-2.25, -12.25, -22.25, -32.25, -42.25, -52.25, -62.25, -72.25, -82.25]
  const verAnchors = [-89.25, -79.25, -69.25, -59.25, -49.25, -39.25, -29.25, -19.25, -9.25]

  const horBoxpos = [5, 15, 25, 35, 45, 55, 65, 75, 85]
  const verBoxpos = [85, 75, 65, 55, 45, 35, 25, 15, 5]

  const numberBlock = [];
  for (let y=0; y < 9; y++){
    let linetop = y*9

    for (let x=0; x < 9; x++){
      let idx = x+linetop
      if (testNum[idx] != 0){
        numberBlock.push(
          <group>
            <mesh position={[horBoxpos[x], verBoxpos[y], -1.01]}>
              <RoundedBox
                args={[9.4, 9.4, 0.2]}
                radius={0.5}
                smoothness={4}
                bevelSegments={4}
                creaseAngle={0.4}
              >
                <meshBasicMaterial color="#884444"/>
              </RoundedBox>
            </mesh>
            <Text color="black" fontSize={10} anchorX={horAnchors[x]} anchorY={verAnchors[y]} depthOffset={0}>
              {testNum[idx]}
            </Text>
          </group>
        )
      }
      else{
        numberBlock.push(
          <group>
            <mesh position={[horBoxpos[x], verBoxpos[y], -1.01]}>
              <RoundedBox
                args={[9.4, 9.4, 0.2]}
                radius={0.5}
                smoothness={4}
                bevelSegments={4}
                creaseAngle={0.4}
              >
                <meshBasicMaterial color="#884444"/>
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
