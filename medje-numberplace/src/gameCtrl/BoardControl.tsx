

//
// ナンバープレース挙動管理クラス

import { Difficulty, GenerateQuestion } from "./GenerateQuestion";

//
class NumberPlace {
  private _difficulty:Difficulty;
  private _question: number[];
  private _answer: number[];
  private _board: number[];

  private _colCluster:number[][];
  private _colClusterMap:Map<number,number>;
  private _rowCluster:number[][];
  private _rowClusterMap:Map<number,number>;
  private _boxCluster:number[][];
  private _boxClusterMap:Map<number,number>;
    
  constructor(difficulty: Difficulty) {
    this._difficulty = difficulty; 
    [this._question, this._answer] = GenerateQuestion(difficulty);
    this._board = this._question;
      
    this._colCluster = [[]];
    this._colClusterMap = new Map<number, number>
    this._rowCluster = [[]];
    this._rowClusterMap = new Map<number, number>
    this._boxCluster = [[]];
    this._boxClusterMap = new Map<number, number>
    this._ClusterRegister();
  }
  
  _isValidSetNum(npBoard: number[], destIdx: number, setNum: number) {
    // 指定した要素と同じ行の重複チェック
    this._colCluster[this._colClusterMap.get(destIdx)].forEach((value) => {
      if(npBoard[value] == setNum) return false;
    });
    // 指定した要素と同じ列の重複チェック
    this._rowCluster[this._rowClusterMap.get(destIdx)].forEach((value) => {
      if(npBoard[value] == setNum) return false;
    });
  
    // 指定した要素と同じbox内の重複チェック
    this._boxCluster[this._boxClusterMap.get(destIdx)].forEach((value) => {
      if(npBoard[value] == setNum) return false;
    });
  
    return true;
  }
  
  // 計算効率化用クラスタ生成
  _ClusterRegister(){  
    // 行クラスタの登録
    for (let column=0; column < 9; column++){
      let colTop = column*9;
      let tempArr = [];
      for(let idxInCol=0; idxInCol < 9; idxInCol){
        let destIdx = colTop + idxInCol;
        tempArr.push(destIdx);
        this._colClusterMap.set(destIdx, column)
      }
      this._colCluster.push(tempArr);
    }
  
    // 列クラスタの登録
    for (let row=0; row < 9; row++){
      let tempArr = [];
      for(let idxInRow=0; idxInRow < 9; idxInRow){
        let destIdx = row + idxInRow*9;
        tempArr.push(destIdx);
        this._rowClusterMap.set(destIdx, row)
      }
      this._rowCluster.push(tempArr);
    }
  
    // ※ box = ナンプレ盤面内にある3x3の集合
    // boxクラスタの登録
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      let boxTopIdx = boxRow * 27;
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        boxTopIdx += (boxCol * 3);
        let tempArr: number[] = [];
        for (let lineRow = 0; lineRow < 3; lineRow++) {
          let lineTopIdx = boxTopIdx + lineRow * 3;
          for (let lineCol = 0; lineCol < 3; lineCol++) {
            let idx = lineTopIdx + lineCol;
            tempArr.push(idx);
            this._boxClusterMap.set(idx, boxRow*3 + boxCol); // boxインデックスと盤面要素インデックスをマップ
          }
        }
        this._boxCluster.push(tempArr); // boxに属するインデックスを格納
      }
    }
  }
}
  