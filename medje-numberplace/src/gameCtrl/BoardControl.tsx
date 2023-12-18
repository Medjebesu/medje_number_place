import { Difficulty, GenerateQuestion } from "./GenerateQuestion";

//
// ナンバープレース挙動管理クラス
//
export class NumberPlace {
  private _difficulty:Difficulty;
  private _question: number[];
  private _answer: number[];
  private _board: number[];

  constructor(difficulty: Difficulty) {
    this._difficulty = difficulty; 
    [this._question, this._answer] = GenerateQuestion(difficulty);
    this._board = this._question;
  }
  
  _isValidSetNum(npBoard: number[], destIdx: number, setNum: number) {
    // 指定した要素と同じ行の重複チェック
    for (const val of this._colCluster[this._colClusterMap.get(destIdx)] ){
      if(npBoard[val] == setNum) return false;
    }

    // 指定した要素と同じ列の重複チェック
    for (const val of this._rowCluster[this._rowClusterMap.get(destIdx)] ){
      if(npBoard[val] == setNum) return false;
    }

    // 指定した要素と同じbox内の重複チェック
    for (const val of this._boxCluster[this._boxClusterMap.get(destIdx)] ){
      if(npBoard[val] == setNum) return false;
    }
  
    return true;
  }

  checkGameComplete():boolean {
    let result = true;
    this._board.forEach((value, idx) => {
      if(this._answer[idx] != value) {
        result = false;
        return;
      }
    });
    return result;
  }

  checkAnswer(destIdx:number, setNum:number):boolean{
    if(this._answer[destIdx] != setNum) return false;
    return true;
  }

  getQuestion():number[] {
    return this._question;
  }

  getDifficulty():Difficulty{
    return this._difficulty;
  }

  setBoardNum(destIdx:number, setNum:number):number {
    let tempPoint = 1 * this._difficulty;
    if(this._board[destIdx] != 0){
      console.debug("Number is already set. Idx:" + destIdx + " , setNum:" + setNum);
      return 0;
    }

    // 行が成立した時
    if (this._checkCluster(colCluster[colClusterMap.get(destIdx)], destIdx)) {
      tempPoint += (10 * this._difficulty);
    }

    // 列が成立した時
    if (this._checkCluster(rowCluster[rowClusterMap.get(destIdx)], destIdx)) {
      tempPoint += (10 * this._difficulty);
    }

    // boxが成立した時
    if (this._checkCluster(boxCluster[boxClusterMap.get(destIdx)], destIdx)) {
      tempPoint += (10 * this._difficulty);
    }

    this._board[destIdx] = setNum;
    return tempPoint;
  }

  _checkCluster(cluster:number[], destIdx:number){
    let result = true;
    cluster.forEach((idx) => {
      if(idx != destIdx){
        if(this._board[idx] == 0) {
          result = false;
          return;
        }
      }
    });

    return result;
  }
}

// 計算効率化用クラスタ生成
const colCluster = new Array<number[]>;
const colClusterMap = new Map<number, number>;
const rowCluster = new Array<number[]>;
const rowClusterMap = new Map<number, number>;
const boxCluster = new Array<number[]>;
const boxClusterMap = new Map<number, number>;

// 行クラスタの登録
for (let column=0; column < 9; column++){
  let colTop = column*9;
  let tempArr:number[] = [];
  for(let idxInCol=0; idxInCol < 9; idxInCol++){
    let destIdx = colTop + idxInCol;
    tempArr.push(destIdx);
    colClusterMap.set(destIdx, column);
  }
  colCluster.push(tempArr);
}
  
// 列クラスタの登録
for (let row=0; row < 9; row++){
  let tempArr = [];
  for(let idxInRow=0; idxInRow < 9; idxInRow++){
    let destIdx = row + idxInRow*9;
    tempArr.push(destIdx);
    rowClusterMap.set(destIdx, row);
  }
  rowCluster.push(tempArr);
}
  
// ※ box = ナンプレ盤面内にある3x3の集合
// boxクラスタの登録
for (let boxRow = 0; boxRow < 3; boxRow++) {
  let boxLineTopIdx = boxRow * 27;
  for (let boxCol = 0; boxCol < 3; boxCol++) {
    let boxTopIdx = boxLineTopIdx + boxCol * 3;
    let tempArr = new Array<number>;
    for (let lineRow = 0; lineRow < 3; lineRow++) {
      let lineTopIdx = boxTopIdx + lineRow * 9;
      for (let lineCol = 0; lineCol < 3; lineCol++) {
        let idx = lineTopIdx + lineCol;
        tempArr.push(idx);
        boxClusterMap.set(idx, boxRow*3 + boxCol); // boxインデックスと盤面要素インデックスをマップ
      }
    }
    boxCluster.push(tempArr); // boxに属するインデックスを格納
  }
}