import { DrawNumberBlock } from "./draw3ds";
import { Vector3 } from "three";
import { GenerateQuestion, Difficulty } from "./GenerateQuestion";

import { BlockStateControlLog } from "./BlocksStateControl"; // for dehug

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

  // ブロック配置座標計算
  for(let i=0; i < 3; i++) {
    var adjustSpace = blockMargin * i;
    for(let j=0; j < 3; j++) {
      var idx:number = i*3+j;
      horBoxpos.push((idx-4)*blockWidth + adjustSpace);
      verBoxpos.push((4-idx)*blockWidth - adjustSpace);
    }
  }

  // ブロック生成
  const blocks = new Array<Block>;
  const npQuestion = GenerateQuestion(Difficulty.Middle); // T.B.D:難易度選択固定
  npQuestion.forEach((value, index) => 
    blocks.push(
      new Block(index, value, blockSize, new Vector3(horBoxpos[index % 9], verBoxpos[Math.floor(index / 9)], 0))
    )
  );

  // ブロックコンポーネントをリスト化
  const blockElements:Array<React.ReactElement> = [];
  for (let y=0; y < 9; y++){
    var linetop = y * 9;
    for (var x=0; x < 9; x++){
      blockElements.push(blocks[linetop + x].getElement());
    }
  }

  return <>
    <group key="numberBlocks">
      {blockElements}
    </group>
    <BlockStateControlLog/>
  </>
}

// ブロックオブジェクト
class Block{
  id:  number;
  num: number;
  size: number;
  pos: Vector3;
  selected: boolean;
  element: React.ReactElement;
  
  constructor(_id:number, _num:number, _size:number, _position:Vector3) {
    this.id = _id;
    this.num = _num;
    this.size = _size;
    this.pos = _position;
    this.selected = false;
    this.element = 
      <DrawNumberBlock
        blockId={this.id}
        blockNum={this.num}
        position={this.pos}
        color="orange"
        selectedColor="#088551"
        width={this.size}
        volume={0.01}
        blockAnim={this.num == 0}
        key={"numBlock_" + this.id}
      />;
  }

  getElement() {
    return this.element;
  }

  setSelect(_selected:boolean) {
    this.selected = _selected;
  }
}