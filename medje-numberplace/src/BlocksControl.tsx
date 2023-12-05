import { DrawNumberBlock } from "./draw3ds";
import { Vector3 } from "three";

type Props = {
  blockSize:number
}

export const BlocksControl: React.FC<Props>  = (props) =>{
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

  const blocks = new Blocks(props.blockSize, testNum);

  // ※Textのanchor座標は文字列描画の位置の左上(X,Yの正負が反転してる？)
  return <group key="numberBlock">
    {blocks.getBlocks()}
  </group>;
}

// ブロックオブジェクト管理クラス
class Block{
  id:  number;
  num: number;
  size: number;
  pos: Vector3;
  selected: boolean;
  element: React.ReactElement;
  
  constructor(_id:number, _num:number, _size:number, _position:Vector3, _selectCb:(_id:number) => void) {
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
        selectCb={_selectCb}
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

class Blocks {
  blocks:Block[];
  selectId:number|boolean;

  constructor(_blockSize:number, _fieldNums: number[]) {
    this.blocks = new Array<Block>;
    this.selectId=false;

    const blockSize = _blockSize * 0.85;
    const blockMargin = _blockSize * 0.15;
    const blockWidth = blockSize+blockMargin;
  
    const horBoxpos:number[] = []
    const verBoxpos:number[] = []

    for(let i=0; i < 3; i++) {
      let adjustSpace = blockMargin * i;
      for(let j=0; j < 3; j++) {
        let idx:number = i*3+j;
        horBoxpos.push((idx-4)*blockWidth + adjustSpace);
        verBoxpos.push((4-idx)*blockWidth - adjustSpace);
      }
    }
    
    _fieldNums.forEach((value, index) => 
      this.blocks.push(
        new Block(index, value, blockSize, new Vector3(horBoxpos[index % 9], verBoxpos[Math.floor(index / 9)], 0), this.changeSelected.bind(this))
      )
    );
  }

  getBlocks() {
    const blockElements:Array<React.ReactElement> = [];

    for (let y=0; y < 9; y++){
      let linetop = y * 9;
      for (let x=0; x < 9; x++){
        blockElements.push(this.blocks[linetop + x].getElement());
      }
    }

    return (
      <group>
        {blockElements}
      </group>
    )
  }

  changeSelected(_id?:number) {
    this.setUnSelect();
    if (_id != null) this.blocks[_id].setSelect(true);
  }

  setUnSelect() {
    this.blocks.forEach(v => v.setSelect(false));
    this.selectId = false;
  }
}