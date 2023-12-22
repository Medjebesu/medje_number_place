import React, { forwardRef, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber"
import { Text, RoundedBox, Outlines, useCursor } from "@react-three/drei"
import { BoardBlockSelector, BlockNumberSetter, SelectedBlockNum, BoardBlocksAnimState, AnimStatus, HandpiecesAnimState } from '../gameCtrl/BlocksStateControl'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { NumBlockAnimation } from './NumBlockAnimation'
import { GameLaunchState } from '../gameCtrl/GameControl'

export type BlockProps = {
  blockId:number;
  blockNum:number;
  position:THREE.Vector3;
  color:THREE.ColorRepresentation;
  selectedColor?:THREE.ColorRepresentation  | undefined;
  fontColor?:THREE.ColorRepresentation  | undefined;
  locked?: boolean;
  original?: boolean;
  width:number;
  height?:number;
  volume?:number;
  blockAnim?:boolean;
}

// ブロック描画
const DrawNumberBlock = forwardRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, {props:BlockProps, children: React.ReactNode}>( ({props, children}, ref) => {
  const blockNum = (props.blockNum == 0 ? "" : props.blockNum.toString());
  const blockHeight = (props.height || props.width);
  const blockVolume = (props.volume || props.width);
  const fontProps = { font: '/fonts/Roboto/Roboto-Black.ttf', fontSize: props.width, letterSpacing: props.width / 2, lineHeight: blockHeight, 'material-toneMapped': false, characters: "0123456789" }

  const fontColor = props.original ? "#555" : "#ffffff";

  const NumText = (
    <Text color={props.fontColor ? props.fontColor : fontColor} position={[0, -(blockHeight/10),blockVolume]} {...fontProps}>
      {blockNum}
    </Text>
  );

  return(
    <mesh position={props.position}>
      <RoundedBox
        ref={ref}
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
});

// 盤面用数字ブロック
export const DrawBoardNumberBlock:React.FC<BlockProps> = (props) => {
  const blockHeight = (props.height || props.width);
  const blockVolume = (props.volume || props.width);

  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  const [blockSelector, setBlockSelector] = useRecoilState(BoardBlockSelector);
  const [selectedBlockNum, setSelectBlockNum] = useRecoilState(SelectedBlockNum);
  const gameLaunchState = useRecoilValue(GameLaunchState);

  const onBlockSelect = () => {
    setBlockSelector({selected:!blockSelector.selected, id:props.blockId});
    setSelectBlockNum(props.blockNum);
  }

  let fontColor = props.fontColor;
  if(blockSelector.selected && (blockSelector.id != props.blockId)){
    if(selectedBlockNum == props.blockNum) {
      fontColor = "#0AA662";
    }
  }

  const tileColor = (blockSelector.selected && blockSelector.id==props.blockId)? props.selectedColor : props.color;
  
  let setProps= {
    blockId:props.blockId,
    blockNum:props.blockNum,
    position:props.position,
    color:props.color,
    selectedColor:props.selectedColor,
    locked:props.locked,
    original:props.original,
    width:props.width,
    height:blockHeight,
    volume:blockVolume,
    blockAnim:props.blockAnim,

    fontColor: fontColor,
  } as BlockProps;

  // ブロックアニメーション
  // 自ブロック専用のアニメーションステート(稼働状態・パターン・現フレーム)を取得
  const [blockAnimState, blockAnimStateSetter] = useRecoilState(BoardBlocksAnimState[props.blockId]);
  const boxRef = useRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>(null);
  
  let AnimEnable = true;
  if ((!props.blockAnim || false) && gameLaunchState){
    AnimEnable = false;
  }

  useFrame(() => {
    if(AnimEnable && boxRef.current != null){
      NumBlockAnimation(boxRef.current, blockAnimState, blockAnimStateSetter, props.position, props.width, blockHeight, blockHeight);
    }
  });

  return(
    <DrawNumberBlock
      props={setProps}
      ref={boxRef}
    >
      <meshBasicMaterial color={tileColor}/>
      <Outlines
        color={"#000fff"}
        screenspace={false}
        opacity={Number(hovered)}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={10}
        transparent
        thickness={setProps.width*0.05}
        angle={Math.PI}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onBlockSelect}
      />
    </DrawNumberBlock>
  );
}

// 手駒用数字ブロック
export const DrawHandpiece:React.FC<BlockProps> = (props) => {
  const blockHeight = (props.height || props.width);
  
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  const setBlockNumber = useSetRecoilState(BlockNumberSetter);
  const gameLaunchState = useRecoilValue(GameLaunchState);

  const onBlockSelect = () => {
      setBlockNumber(props.blockNum);
  }

  const tileColor = props.color;

  // ブロックアニメーション
  const [blockAnimState, blockAnimStateSetter] = useRecoilState(HandpiecesAnimState[props.blockId]);
  const boxRef = useRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>(null);

  let AnimEnable = true;
  if (!props.blockAnim && gameLaunchState){
    AnimEnable = false;
  }

  useFrame(() => {
    if(AnimEnable && boxRef.current != null){
      NumBlockAnimation(boxRef.current, blockAnimState, blockAnimStateSetter, props.position, props.width, blockHeight, blockHeight);
    }
  });

  return(
    <DrawNumberBlock
      props={props}
      ref={boxRef}
    >
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