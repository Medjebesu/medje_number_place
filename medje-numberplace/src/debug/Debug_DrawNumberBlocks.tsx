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

  const horBoxpos = [0.225, 0.725, 1.225, 1.75, 2.25, 2.75, 3.275, 3.775, 4.275]
  const verBoxpos = [4.275, 3.775, 3.275, 2.75, 2.25, 1.75, 1.225, 0.725, 0.225]

  const numberBlock = [];

  for (let y=0; y < 9; y++){
    let linetop = y*9

    for (let x=0; x < 9; x++){
      let idx = x+linetop
      if (testNum[idx] != 0){
        numberBlock.push(
          <DrawNumberBlock 
            blocknum={testNum[idx]}
            position={new Vector3(horBoxpos[x], verBoxpos[y], -0.1)}
            color="orange"
            width={0.425}
            volume={0.01}
          />
        )
      }
      else{
        numberBlock.push(
          <DrawNumberBlock 
            blocknum={testNum[idx]}
            position={new Vector3(horBoxpos[x], verBoxpos[y], -0.1)}
            color="orange"
            width={0.425}
            volume={0.01}
            blockAnim={true}
          />
        )
      }
    }
  }

  // ※Textのanchor座標は文字列描画の位置の左上(X,Yの正負が反転してる？)
  return <>
    {numberBlock}
  </>;
}
