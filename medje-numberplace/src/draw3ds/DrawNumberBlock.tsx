import React, { forwardRef, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber"
import { Text, useCursor, Box } from "@react-three/drei"
import {
  BoardBlockSelector, BlockNumberSetter, SelectedBlockNum,
  BoardBlocksBasePos, HandpiecesBasePos
} from '../gameCtrl/BlocksState'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { BoardBlockAnimation, SetBoardBlockPattern } from './NumBlockAnimation'
import { GameLaunchState, SoundEnableState } from '../AppInitializer'

export type BlockProps = {
  blockId: number;
  blockNum: number;
  blockMemo?: boolean[];
  color: THREE.ColorRepresentation;
  selectedColor?: THREE.ColorRepresentation | undefined;
  fontColor?: THREE.ColorRepresentation | undefined;
  locked?: boolean;
  original?: boolean;
  width: number;
  height?: number;
  volume?: number;
  blockAnim?: boolean;
}

// ブロック描画
const DrawNumberBlock = forwardRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, { props: BlockProps, children: React.ReactNode, onClick?: () => void }>(({ props, children, onClick }, ref) => {
  const blockNum = (props.blockNum == 0 ? "" : props.blockNum.toString());
  const blockHeight = (props.height || props.width);
  const blockVolume = (props.volume || props.width);

  const numFontProps = { font: '/fonts/Roboto/Roboto-Black.ttf', fontSize: props.width, letterSpacing: props.width / 2, lineHeight: blockHeight, 'material-toneMapped': false, characters: "0123456789" }
  const numFontColor = props.original ? "#555" : "#ffffff";

  const NumText = (
    <Text color={props.fontColor ? props.fontColor : numFontColor} position={[0, -(blockHeight / 10), blockVolume]} {...numFontProps}>
      {blockNum}
    </Text>
  );

  let MemoText = (<Text> </Text>)
  if (props.blockMemo) {
    const memoFontProps = { font: '/fonts/Roboto/Roboto-Black.ttf', fontSize: props.width / 3, letterSpacing: props.width / 18, lineHeight: blockHeight, 'material-toneMapped': false, characters: "0123456789" }
    const memoFontColor = "#ffffff";
    let memoString = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        var idx = i * 3 + j;
        props.blockMemo[idx] ? memoString += (idx + 1) : memoString += "  ";
        memoString += " ";
      }
      memoString += "\n";
    }

    MemoText = (
      <Text color={memoFontColor} position={[0, -(props.width / 6), blockVolume]} {...memoFontProps}>
        {memoString}
      </Text>
    );
  }

  return (
    <mesh ref={ref}>
      <Box
        args={[props.width, blockHeight, blockVolume]}
        onClick={onClick}
      >
        {props.blockNum != 0 ? NumText : MemoText}
        {children}
      </Box>
    </mesh>
  );
});

// 盤面用数字ブロック
export const DrawBoardNumberBlock: React.FC<BlockProps> = (props) => {
  const blockBasePos = useRecoilValue(BoardBlocksBasePos(props.blockId));
  const [blockSelector, setBlockSelector] = useRecoilState(BoardBlockSelector);
  const [selectedBlockNum, setSelectBlockNum] = useRecoilState(SelectedBlockNum);
  const gameLaunchState = useRecoilValue(GameLaunchState);
  const isSEEnable = useRecoilValue(SoundEnableState);

  const blockHeight = (props.height || props.width);
  const blockVolume = (props.volume || props.width);

  //const [hovered, setHovered] = React.useState(false); //※Outlines用
  //useCursor(hovered);

  // 選択時効果音
  const selectSE = isSEEnable ? new Audio("/sounds/puzzle_cursor.mp3") : null;
  if (selectSE) {
    selectSE.loop = false;
    selectSE.muted = false;
  }

  const onBlockSelect = () => {
    if (selectSE) selectSE.play();
    setBlockSelector({ selected: !blockSelector.selected, id: props.blockId });
    setSelectBlockNum(props.blockNum);
  }

  let fontColor = props.fontColor;
  if (blockSelector.selected && (blockSelector.id != props.blockId)) {
    if (selectedBlockNum == props.blockNum) {
      fontColor = "#51ff41";
    }
  }

  const tileColor = (blockSelector.selected && blockSelector.id == props.blockId) ? props.selectedColor : props.color;

  let setProps = { ...props }
  setProps.height = blockHeight;
  setProps.volume = blockVolume;
  setProps.fontColor = fontColor;

  // ブロックアニメーション
  const boxRef = useRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>(null);

  let AnimEnable = true;
  if ((!props.blockAnim || false) && gameLaunchState) {
    AnimEnable = false;
  }
  else if (props.blockNum == 0) {
    SetBoardBlockPattern(props.blockId, "floating");
  }

  useFrame(() => {
    if (boxRef.current != null) {
      BoardBlockAnimation(boxRef.current, props.blockId, blockBasePos, props.width, blockHeight, blockHeight);
    }
    /*
    else if(!props.blockAnim){
      boxRef.current?.position.set(blockBasePos.x, blockBasePos.y, blockBasePos.z);
    }
    */
  });

  return (
    <DrawNumberBlock
      props={setProps}
      ref={boxRef}
      onClick={onBlockSelect}
    >
      <meshBasicMaterial attach="material" color={tileColor} />

    </DrawNumberBlock>
  );
}
/* Outlinesつけると画面遷移でこけるので除外中
<Outlines
color={"#088551"}
screenspace={false}
opacity={Number(hovered)}
toneMapped={true}
polygonOffset
polygonOffsetFactor={10}
transparent
thickness={setProps.width*0.05}
angle={Math.PI}
onPointerOver={() => setHovered(true)}
onPointerOut={() => setHovered(false)}
onClick={onBlockSelect}
/>
*/

// 手駒用数字ブロック
export const DrawHandpiece: React.FC<BlockProps> = (props) => {
  const blockBasePos = useRecoilValue(HandpiecesBasePos(props.blockId));
  const setBlockNumber = useSetRecoilState(BlockNumberSetter);
  const gameLaunchState = useRecoilValue(GameLaunchState);

  const blockHeight = (props.height || props.width);

  //const [hovered, setHovered] = React.useState(false); //※Outlines用
  //useCursor(hovered);

  const onBlockSelect = () => {
    setBlockNumber(props.blockNum);
  }

  const tileColor = props.color;

  // ブロックアニメーション
  //const [blockAnimState, blockAnimStateSetter] = useRecoilState(HandpiecesAnimState(props.blockId));
  const boxRef = useRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>(null);

  let AnimEnable = true;
  if (!props.blockAnim && gameLaunchState) {
    AnimEnable = false;
  }

  useFrame(() => {
    if (AnimEnable && boxRef.current != null) {
      //HandpieceAnimation(boxRef.current, blockAnimState, blockAnimStateSetter, props.width, blockHeight, blockHeight);
    }
    boxRef.current?.position.set(blockBasePos.x, blockBasePos.y, blockBasePos.z);
  });

  return (
    <DrawNumberBlock
      props={props}
      ref={boxRef}
      onClick={onBlockSelect}
    >
      <meshBasicMaterial color={tileColor} />
    </DrawNumberBlock>
  );
}

/* Outlinesつけると画面遷移でこけるので除外中
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
*/