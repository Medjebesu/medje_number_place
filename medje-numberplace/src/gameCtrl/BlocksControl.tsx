import { DrawBoardNumberBlock, DrawHandpiece } from "../draw3ds";
import { Vector3 } from "three";
import { GenerateQuestion, Difficulty } from "./GenerateQuestion";

import { ActMode, BlockStateControlLog, BoardBlockNumbers, BoardBlockSetter, SelectHandpiece } from "./BlocksStateControl"; // for dehug
import { SetterOrUpdater, useRecoilState, useRecoilValue } from "recoil";

type Props = {
  blockSize:number
}

export type SelectState = {
  selected: boolean;
  id:  number;
}

// ブロック群制御コンポーネント
export const BlocksControl: React.FC<Props>  = (props) =>{

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
  const boardBlocks = new Array<BoardBlock>;
  const npQuestion = GenerateQuestion(Difficulty.Middle); // T.B.D:難易度選択固定
  npQuestion.forEach((value, index) => 
    boardBlocks.push(
      new BoardBlock(index, value, props.blockSize, new Vector3(props.horBoxpos[index % 9], props.verBoxpos[Math.floor(index / 9)], 0))
    )
  );

  // 盤面ブロックコンポーネントをリスト化
  const boardBlockElements:Array<React.ReactElement> = [];
  for (let y=0; y < 9; y++){
    var linetop = y * 9;
    for (var x=0; x < 9; x++){
      boardBlockElements.push(boardBlocks[linetop + x].getElement());
    }
  }

  return <group>
    {boardBlockElements}
  </group>
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
  const handpieces = new Array<Handpiece>;
    for (let hp=0; hp < 9; hp++){
    handpieces.push(new Handpiece(hp, hp+1, props.blockSize, new Vector3(props.horBoxpos[hp], props.verBoxpos, props.zIndex)));
  }
  
  // 手駒ブロックコンポーネントをリスト化
  const handpieceElements:Array<React.ReactElement> = [];
  for (let hp=0; hp < 9; hp++){
    handpieceElements.push(handpieces[hp].getElement());
  }

  return <group>
    {handpieceElements}
  </group>
}

// 盤面用ブロックオブジェクト
class BoardBlock{
  id:  number;
  getNumber: number;
  setNumber: SetterOrUpdater<number>;
  size: number;
  pos: Vector3;
  selected: boolean;
  locked: boolean;
  original: boolean;
  
  constructor(_id:number, _num:number, _size:number, _position:Vector3) {
    this.id = _id;
    [this.getNumber, this.setNumber] = useRecoilState(BoardBlockNumbers[this.id]);
    this.setNumber(_num);
    this.size = _size;
    this.pos = _position;
    this.selected = false;
    this.locked = _num!=0;
    this.original = _num!=0;
  }

  getElement():React.ReactElement {
    return (
      <DrawBoardNumberBlock
        blockId={this.id}
        blockNum={this.getNumber}
        position={this.pos}
        color="orange"
        selectedColor="#088551"
        locked={this.locked}
        original={this.original}
        width={this.size}
        volume={0.01}
        blockAnim={this.getNumber == 0}
        key={"numBlock_" + this.id}
      />
    );
  }

  setNewNumber(actMode: ActMode, blockNum:number) {
    console.log("SetNum: DestId= " + this.id + " Num= " + blockNum + " Mode= " + actMode);
    switch(actMode){
      case ActMode.NumSet:
        this.locked = true;
        this.setNumber(blockNum);
    }
  }
}

// 手駒用ブロックオブジェクト
class Handpiece{
  id:  number;
  num: number;
  size: number;
  pos: Vector3;
  selected: boolean;
  
  constructor(_id:number, _num:number, _size:number, _position:Vector3) {
    this.id = _id;
    this.num = _num;
    this.size = _size;
    this.pos = _position;
    this.selected = false;
  }

  getElement():React.ReactElement {
    return (
      <DrawHandpiece
        blockId={this.id}
        blockNum={this.num}
        position={this.pos}
        color="blue"
        fontcolor="white"
        width={this.size}
        volume={0.01}
        blockAnim={this.num == 0}
        key={"handpiaceBlock_" + this.id}
      />
    );
  }
}