import React from 'react'
import * as THREE from 'three'
import { DrawLines } from './DrawLines'

type Props = {
  scale:number;
  pitch:number;
  color:THREE.ColorRepresentation  | undefined;
  lineWidth:number;
  //segments:any
  //dashed:boolean;
  //vertexColors:Array<number[]>;
  //{...lineProps}                  // All THREE.Line2 props are valid
  //{...materialProps}              // All THREE.LineMaterial props are valid
}

export const DrawGrid: React.FC<Props>  = (props) =>{
  const horLines: Array<THREE.Vector3[]> =[];
  const verLines: Array<THREE.Vector3[]> =[];

  // 縦線
  for(var x = 0; x <= props.scale; x++) {
    let points :THREE.Vector3[] =[];
    for(var y = 0; y <= props.scale; y++) {
      points.push(new THREE.Vector3(props.pitch * x, props.pitch * y, 0));
    }
    verLines.push(points);
  }

  // 横線
  for(var y = 0; y <= props.scale; y++) {
    let points :THREE.Vector3[] =[];
    for(var x = 0; x <= props.scale; x++) {
      points.push(new THREE.Vector3(props.pitch * x, props.pitch * y, 0));
    }
    horLines.push(points);
  }

  return(
    <>
      <DrawLines lines={verLines} color={props.color} lineWidth={props.lineWidth} key={'vertical'}/>
      <DrawLines lines={horLines} color={props.color} lineWidth={props.lineWidth} key={'horizontal'}/>
    </>
  );
}