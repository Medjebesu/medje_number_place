import React from 'react'
import * as THREE from 'three'
import { Line } from "@react-three/drei";

type Props = {
  lines:Array<THREE.Vector3[]>;
  color:THREE.ColorRepresentation  | undefined;
  lineWidth:number;
  //segments:any
  //dashed:boolean;
  //vertexColors:Array<number[]>;
  //{...lineProps}                  // All THREE.Line2 props are valid
  //{...materialProps}              // All THREE.LineMaterial props are valid
}

// 線リスト描画
export const DrawLines:React.FC<Props>= (props) => {
  
  const lineList = [];
  
  for (const [i, points] of props.lines.entries()) {
    lineList.push(<Line points={points} color={props.color} lineWidth={props.lineWidth} key={i}/>)
  }

  return(
    <>
      { lineList }
    </>
  );
}