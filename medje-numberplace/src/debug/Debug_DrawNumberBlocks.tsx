//import React, { useRef } from 'react'
//import { useFrame } from "@react-three/fiber"
import { DrawNumberBlock } from "../draw3ds";
import { Vector3 } from "three";

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

  const boxSize = 0.85
  const boxMargin = 0.15
  const boxWidth = boxSize+boxMargin

  const horBoxpos:number[] = []
  const verBoxpos:number[] = []

  for(let i=0; i < 3; i++){
    const adjustSpace = boxMargin * i
    for(let j=0; j < 3; j++){
      const idx:number = i*3+j
      horBoxpos.push((idx-4)*boxWidth + adjustSpace)
      verBoxpos.push((4-idx)*boxWidth - adjustSpace)
    }
  }

  const numberBlock = [];

  for (let y=0; y < 9; y++){
    let linetop = y*9

    for (let x=0; x < 9; x++){
      let idx = x+linetop
      if (testNum[idx] != 0){
        numberBlock.push(
          <DrawNumberBlock 
            blockId={idx}
            blockNum={testNum[idx]}
            position={new Vector3(horBoxpos[x], verBoxpos[y], 0)}
            color="orange"
            selectedColor="#088551"
            width={boxSize}
            volume={0.01}
          />
        )
      }
      else{
        numberBlock.push(
          <DrawNumberBlock
            blockId={idx}
            blockNum={testNum[idx]}
            position={new Vector3(horBoxpos[x], verBoxpos[y], 0)}
            color="orange"
            selectedColor="#088551"
            width={boxSize}
            volume={0.01}
            blockAnim={true}
          />
        )
      }
    }
  }

  // ※Textのanchor座標は文字列描画の位置の左上(X,Yの正負が反転してる？)
  return <group key="numberBlock">
    {numberBlock}
  </group>;
}
