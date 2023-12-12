import React from 'react'
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber"
import { Text, RoundedBox, Outlines, useCursor } from "@react-three/drei"
import { BoardBlockSelector, BlockNumberSetter } from '../gameCtrl/BlocksStateControl'
import { useRecoilState, useSetRecoilState } from 'recoil'

type Props = {
  blockId:number;
  blockNum:number;
  position:THREE.Vector3;
  color:THREE.ColorRepresentation;
  selectedColor?:THREE.ColorRepresentation  | undefined;
  fontcolor?:THREE.ColorRepresentation  | undefined;
  locked?: boolean;
  original?: boolean;
  width:number;
  height?:number;
  volume?:number;
  blockAnim?:boolean;
}

// ブロック描画
const DrawNumberBlock:React.FC<{props:Props, children: React.ReactNode}> = ({props, children}) => {
  var blockNum = (props.blockNum == 0 ? "" : props.blockNum.toString())
  const blockHeight = (props.height || props.width)
  const blockVolume = (props.volume || props.width)
  const fontProps = { font: '/fonts/Roboto/Roboto-Black.ttf', fontSize: props.width, letterSpacing: props.width / 2, lineHeight: blockHeight, 'material-toneMapped': false, characters: "0123456789" }

  const fontColor = props.original ? "#555" : "#ffffff";

  const boxRef = React.useRef()
  const NumText = (
    <Text color={props.fontcolor ? props.fontcolor : fontColor} position={[0, -(blockHeight/10),blockVolume]} {...fontProps}>
      {blockNum}
    </Text>
  )

  // ブロックモーション
  useFrame((state) => {
    if (props.blockAnim || false){
      if(boxRef.current != null){
        boxRef.current.position.y = Math.sin(state.clock.elapsedTime) * (blockHeight * 0.03)
      }
    }
  })

  return(
    <mesh position={props.position}>
      <RoundedBox
        ref={boxRef}
        args={[props.width, blockHeight, blockVolume]}
        radius={0.025}
        smoothness={10}
        bevelSegments={4}
        creaseAngle={0.4}
      >
        {NumText}
        {children}
      </RoundedBox>
    </mesh>
  );
}

// 盤面用数字ブロック
export const DrawBoardNumberBlock:React.FC<Props> = (props) => {
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  const [ blockSelector, setBlockSelector] = useRecoilState(BoardBlockSelector);
  const onBlockSelect = () => {
    setBlockSelector({selected:!blockSelector.selected, id:props.blockId});
  }

  const tileColor = (blockSelector.selected && blockSelector.id==props.blockId)? props.selectedColor : props.color;
  
  return(
    <DrawNumberBlock props={props}>
      <meshBasicMaterial color={tileColor}/>
      <Outlines
        color={"#000fff"}
        screenspace={false}
        opacity={Number(hovered)}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={10}
        transparent
        thickness={props.width*0.05}
        angle={Math.PI}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onBlockSelect}
      />
    </DrawNumberBlock>
  );
}

// 手駒用数字ブロック
export const DrawHandpiece:React.FC<Props> = (props) => {
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  const setBlockNumber = useSetRecoilState(BlockNumberSetter);
  const onBlockSelect = () => {
      setBlockNumber(props.blockNum);
  }

  const tileColor = props.color;

  return(
    <DrawNumberBlock props={props}>
      <meshBasicMaterial color={tileColor}/>
      <Outlines
        color={"#ff0f00"}
        screenspace={false}
        opacity={Number(hovered)}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={10}
        transparent
        thickness={props.width*0.05}
        angle={Math.PI}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onBlockSelect}
      />
    </DrawNumberBlock>
  );
}