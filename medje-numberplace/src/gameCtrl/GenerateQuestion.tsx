export const enum Difficulty {
  Light = 1,
  Easy,
  Middle,
  Hard,
  Evil
}

export function GenerateQuestion(difficulty: Difficulty): [number[], number[]] {

  // T.B.D
  switch (difficulty) {
    case difficulty.Light:
    case difficulty.Easy:
    case difficulty.Middle:
      return MiddleDifficultyQuestion();
    case difficulty.Hard:
    case difficulty.Evil:
    default:
      return MiddleDifficultyQuestion();
  }
}

function MiddleDifficultyQuestion():[number[], number[]] {
  // T.B.D
  const question = [
    7, 0, 2, 8, 0, 4, 0, 9, 0,
    0, 3, 0, 2, 0, 0, 1, 7, 0,
    0, 5, 0, 0, 0, 9, 0, 4, 0,

    0, 0, 0, 0, 8, 0, 0, 3, 0,
    3, 0, 5, 0, 6, 0, 0, 0, 0,
    0, 0, 0, 4, 2, 0, 0, 0, 0,

    0, 1, 0, 6, 9, 0, 7, 0, 0,
    0, 0, 0, 3, 0, 0, 9, 2, 1,
    8, 0, 0, 5, 0, 0, 0, 6, 0
  ]

  const answer = [
    7, 6, 2, 8, 1, 4, 5, 9, 3,
    9, 3, 4, 2, 5, 6, 1, 7, 8,
    1, 5, 8, 7, 3, 9, 2, 4, 6,

    2, 4, 7, 1, 8, 5, 6, 3, 9,
    3, 8, 5, 9, 6, 7, 4, 1, 2,
    6, 9, 1, 4, 2, 3, 8, 5, 7,

    4, 1, 3, 6, 9, 2, 7, 8, 5,
    5, 7, 6, 3, 4, 8, 9, 2, 1,
    8, 2, 9, 5, 7, 1, 3, 6, 4
  ]

  return [question, answer];
}

export function CulculateAnswer(npQuestion: number[]): number[] {
  let npAnswer: number[] = [];

  return npAnswer;
}

class NumberPlace {
  private _question: number[];
  private _Answer: number[];
  private _Board: number[];

  private _colCluster:number[][];
  private _colClusterMap:Map<number,number>;
  private _rowCluster:number[][];
  private _rowClusterMap:Map<number,number>;
  private _boxCluster:number[][];
  private _boxClusterMap:Map<number,number>;
  
  constructor(question: number[]) {
    this._question = question;
    this._Answer = question;
    this._Board = question;

    
    this._colCluster = [[]];
    this._colClusterMap = new Map<number, number>
    this._rowCluster = [[]];
    this._rowClusterMap = new Map<number, number>
    this._boxCluster = [[]];
    this._boxClusterMap = new Map<number, number>
    this._ClusterRegister();
  }

  _isValid(npBoard: number[], destIdx: number, setNum: number) {

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