import { DrawBoardNumberBlock, DrawHandpiece } from "../draw3ds";
import { Vector3 } from "three";

import { BlockStateControlLog, BoardBlocksBasePos, BoardBlocksLocked, BoardBlocksNumber, BoardBlocksOriginal, HandpiecesBasePos } from "./BlocksStateControl";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ReactElement } from "react";

export type SelectState = {
  selected: boolean;
  id:  number;
}

// ブロック群制御コンポーネント
type Prop ={
  blockSize:number;
}
export const BlocksControl: React.FC<Prop>  = (props) =>{

  // ブロックサイズとマージンの定義
  const blockSize = props.blockSize * 0.85;
  const blockMargin = props.blockSize * 0.15;
  const blockWidth = blockSize+blockMargin;

  // ブロック水平・垂直座標群
  const horBoxpos:number[] = []
  const verBoxpos:number[] = []

  // 盤面ブロック配置座標計算
  let adjustSpace = 0;
  for(let i=0; i < 3; i++) {
    adjustSpace = blockMargin * i;
    for(let j=0; j < 3; j++) {
      var idx:number = i*3+j;
      horBoxpos.push((idx-4)*blockWidth + adjustSpace);
      verBoxpos.push((4-idx)*blockWidth - adjustSpace);
    }
  }

  // 手駒ブロック配置座標計算
  verBoxpos.push((4-9)*blockWidth - adjustSpace * 2);

  return <>
    <BoardBlocks 
      blockSize={blockSize} 
      horBoxpos={horBoxpos} 
      verBoxpos={verBoxpos} 
      zIndex={0}
    />
    <Handpieces 
      blockSize={blockSize} 
      horBoxpos={horBoxpos} 
      verBoxpos={verBoxpos[9]} 
      zIndex={0}
    />
    <BlockStateControlLog/>
  </>
}

// 盤面ブロック群コンポーネント
type BoardBlocksProps = {
  blockSize:number;
  horBoxpos:Array<number>;
  verBoxpos:Array<number>;
  zIndex:number;
}
const BoardBlocks:React.FC<BoardBlocksProps> = (props) =>{

  // 盤面ブロック生成
  const boardBlocks = new Array<ReactElement>;
  for (let bbIdx=0; bbIdx < 81; bbIdx++){
    var blockPosSetter = useSetRecoilState(BoardBlocksBasePos[bbIdx]);
    blockPosSetter(new Vector3(props.horBoxpos[bbIdx % 9], props.verBoxpos[Math.floor(bbIdx / 9)], 0));
    boardBlocks.push(
      <BoardBlock 
        id={bbIdx}
        size={props.blockSize}
        key={"boardBlock_" + bbIdx}
      />
    );
  }

  return <>
    {boardBlocks}
  </>
}

// 手駒ブロック群コンポーネント
type HandpiecesProps = {
  blockSize:number;
  horBoxpos:Array<number>;
  verBoxpos:number;
  zIndex:number;
}

const Handpieces:React.FC<HandpiecesProps> = (props) =>{
  // 手駒ブロック生成
  const handpieces = new Array<React.ReactElement>;
  for (let hp=0; hp < 9; hp++){
    var blockPosSetter = useSetRecoilState(HandpiecesBasePos[hp]);
    blockPosSetter(new Vector3(props.horBoxpos[hp], props.verBoxpos, props.zIndex));
    handpieces.push(
      <Handpiece 
        id={hp}
        num={hp+1}
        size={props.blockSize}
        key={"handpiece_" + hp}
      />
    )
  }
  
  return <>
    {handpieces}
  </>
}

// 盤面用ブロックコンポーネント
type BoardBlockProps = {
  id:  number;
  size: number;
}
const BoardBlock:React.FC<BoardBlockProps> = (props) =>{
  const blockNum = useRecoilValue(BoardBlocksNumber[props.id]);
  const isLocked = useRecoilValue(BoardBlocksLocked[props.id]);
  const isOriginal = useRecoilValue(BoardBlocksOriginal[props.id]);

  return (
    <DrawBoardNumberBlock
      blockId={props.id}
      blockNum={blockNum}
      color="orange" // color=
      selectedColor="#088551"
      fontColor={isOriginal ? "#555" : "#ffffff"}
      locked={isLocked}
      original={isOriginal}
      width={props.size}
      volume={0.01}
      blockAnim={blockNum == 0}
    />
  );
}

// 手駒用ブロックコンポーネント
type HandpiecekProps = {
  id:number;
  num:number;
  size:number;
}

const Handpiece:React.FC<HandpiecekProps> = (props) => {

  return (
    <DrawHandpiece
      blockId={props.id}
      blockNum={props.num}
      color="blue"
      fontColor="white"
      width={props.size}
      volume={0.01}
      blockAnim={props.num == 0}
    />
  );
}