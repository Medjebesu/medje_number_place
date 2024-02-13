import { SetBoardBlockPattern, SetBoardClusterPattern } from "../draw3ds/NumBlockAnimation";
import { GameDifficulty } from "./GameState";

//
// ナンバープレース挙動管理クラス
//
export class NumberPlace {
  private _difficulty:GameDifficulty;
  private _question: number[];
  private _answer: number[];
  private _board: number[];

  constructor(
    difficulty: GameDifficulty,
    question: number[],
    answer: number[]
  ){
    this._difficulty = difficulty; 
    this._question = question;
    this._answer = answer;
    this._board = [...question];
  }
  
  /*
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
  */

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

  getDifficulty():GameDifficulty{
    return this._difficulty;
  }

  setBoardNum(destIdx:number, setNum:number) {

    let resultStatus = 1;
    let tempPoint = 1 * this._difficulty;
    
    if(this._board[destIdx] != 0){
      console.debug("Number is already set. Idx:" + destIdx + " , setNum:" + setNum);
      return [0, 0];
    }

    let establishedColCluster = false;
    let establishedRowCluster = false;
    let establishedBoxCluster = false;

    // 行が成立した時
    const colBelong = colClusterMap.get(destIdx);
    if (colBelong != undefined && this._checkCluster(colCluster[colBelong], destIdx)) {
      resultStatus += 2;
      tempPoint += (10 * this._difficulty);
      establishedColCluster = true;
    }

    // 列が成立した時
    const rowBelong = rowClusterMap.get(destIdx);
    if (rowBelong != undefined && this._checkCluster(rowCluster[rowBelong], destIdx)) {
      resultStatus += 4;
      tempPoint += (10 * this._difficulty);
      establishedRowCluster = true;
    }

    // boxが成立した時
    const boxBelong = boxClusterMap.get(destIdx);
    if (boxBelong != undefined && this._checkCluster(boxCluster[boxBelong], destIdx)) {
      resultStatus += 8;
      tempPoint += (10 * this._difficulty);
      establishedBoxCluster = true;
    }

    if(establishedColCluster || establishedRowCluster || establishedBoxCluster){
      if(establishedColCluster && colBelong != undefined)
        SetBoardClusterPattern(colCluster[colBelong], "swinging_long");
      if(establishedRowCluster && rowBelong != undefined)
        SetBoardClusterPattern(rowCluster[rowBelong], "swinging_long");
      if(establishedBoxCluster && boxBelong != undefined)
        SetBoardClusterPattern(boxCluster[boxBelong], "swinging_long");
    }
    else {
      SetBoardBlockPattern(destIdx, "swinging");
    }

    this._board[destIdx] = setNum;
    return [resultStatus, tempPoint];
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