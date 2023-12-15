import { DefaultValue, RecoilState, atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { Difficulty, GenerateQuestion } from "./GenerateQuestion";
import { GemePlayScoreSetter } from "../hudCtrl";

//盤面データ初期化コンポーネント
type BoardInitializerProps = {
  //seed: number; // ナンプレ初期盤面の生成シード値 T.B.D
}

let npQuestion:number[];
let npAnswer:number[];
let npBoard:number[];

export const BoardInitializer:React.FC<BoardInitializerProps> = (props) =>{
  [npQuestion, npAnswer] = GenerateQuestion(Difficulty.Middle); // T.B.D:難易度選択固定
  npQuestion.forEach((value, idx) => {
    var setBlockNum = useSetRecoilState(BoardBlocksNumber[idx])
    var setBlockLocked = useSetRecoilState(BoardBlocksLocked[idx])
    var setBlockOriginal = useSetRecoilState(BoardBlocksOriginal[idx])

    setBlockNum(value);
    if (value != 0){
      setBlockLocked(true);
      setBlockOriginal(true);
    }
  });

  return <>
  </>
}

//
// UI表示用ステート
//
export const MissTakeCountState = atom({
  key:"missTakeCountState",
  default: 0
});

//
// 盤面ブロック統括制御
//

// 選択状態制御用ステート・セレクタ
export type BoardSelectState = {
  selected: boolean;
  id: number;
}

export const BoardBlockSelectState = atom({
  key: 'boardBlockSelectState',
  default: {selected: false, id:0, blockNum:0} as BoardSelectState,
});

export const SelectedBlockNum = atom({
  key:"selectedBlockNum",
  default: 0
})

export const BoardBlockSelector = selector({
  key: 'boardBlockSelector',
  get: ({get}):BoardSelectState => {
    return get(BoardBlockSelectState);
  },
  set: ({get,set}, newVal) => {
    if(newVal instanceof DefaultValue) {
      set(
        BoardBlockSelectState, 
        newVal
      );
    }
    else {
      var oldVal = get(BoardBlockSelectState);
      var setVal:BoardSelectState = newVal;
      if(oldVal.id == newVal.id){
        setVal.selected = !oldVal.selected;
      }
      else{
        setVal.selected = true;
        setVal.id = newVal.id;
      }

      set(BoardBlockSelectState, setVal);
    }
  },
});

//
// 盤面ブロック(各要素)制御用ステート
//
export const BoardBlocksLocked:Array<RecoilState<boolean>> = [];
export const BoardBlocksOriginal:Array<RecoilState<boolean>> = [];
export const BoardBlocksNumber:Array<RecoilState<number>> = [];
for (let i = 0; i < 81; i++){
  BoardBlocksNumber.push(atom({
    key: 'boardBlocksNumber_' + i,
    default: 0
  }));
  BoardBlocksLocked.push(atom({
    key: 'boardBlocksLocked_' + i,
    default: false
  }));
  BoardBlocksOriginal.push(atom({
    key: 'boardBlocksOriginal_' + i,
    default: false
    }));
}

// ブロックナンバー設定処理用セレクター
export const BlockNumberSetter = selector({
  key: 'blockNumberSelector',
  get: ({get}):number => {
    return get(HandPieceLastNum);
  },
  set: ({set, get}, setVal) => {
    if(!(setVal instanceof DefaultValue)){
      const selectState = get(BoardBlockSelectState);
      const isLocked = get(BoardBlocksLocked[selectState.id]);
      if(BlockNumberSetterFilter(selectState, isLocked)){

        if(CheckAnswer(selectState.id, setVal)){
          set(HandPieceLastDest, selectState.id);
          set(HandPieceLastNum, setVal);
          set(BoardBlocksNumber[selectState.id], setVal);
          set(BoardBlocksLocked[selectState.id], true);

          set(GemePlayScoreSetter, EvaluateSetNumber(selectState.id, setVal));
          set(SelectedBlockNum, setVal);
        }
        else{
          set(MissTakeCountState, get(MissTakeCountState)+1)
        }
      }
    }
  }
});

const BlockNumberSetterFilter = (_selectState:BoardSelectState, _isLocked:boolean) =>{
  // 番号設定先の盤面ブロックが選択されていない場合
  if( !_selectState.selected){
    return false;
  }
  // 選択した盤面に既に番号が入っている場合
  if(_isLocked) {
    return false;
  }

  return true;
}

const CheckAnswer = (destId:number, setNum:number) =>{
  if(npAnswer[destId] != setNum) return false;
  return true;
}

// ナンバー入力に対する得点の評価
const EvaluateSetNumber = (destId:number, num:number) => {

  // 入力時に行に1~9の数値が揃った
  // 入力時に列に1~9の数値が揃った
  // 入力時にbox内に1~9の数値が揃った
  // T.B.D

  return 5;
}

// 手駒用動作モード定義
export const enum ActMode {
  None = 0,
  NumSet,
  Memo
}

// 手駒用ブロック選択状態制御用ステート・セレクタ
export type SelectHandpiece = {
  blockNum:  number;
  actMode: ActMode;
  destId: number;
}

export const HandPieceActMode = atom({
  key: 'handpieceActMode',
  default: ActMode.NumSet
});

export const HandPieceLastDest = atom({
  key: 'handpieceLastDest',
  default: -1
});

export const HandPieceLastNum = atom({
  key: 'handpieceLastNum',
  default: 0
});

//
// デバッグ用ステートログ出力
//
export const BlockStateControlLog: React.FC = () => {

  const settedVal = useRecoilValue(BoardBlockSelector);
  console.debug("BlockSelector state Changed:" + " selected=" + settedVal.selected + " id=" + settedVal.id);

  return<>
  </>
}

// デバッグ用手駒用ブロック操作ログ出力
/*
export const HandpieceActLog = () => {

  const settedVal = useRecoilValue(HandPieceSetter);
  console.debug("Handpiece act:" + 
                " BlockNum=" + settedVal.blockNum + 
                " Mode=" + settedVal.actMode + 
                " Mode=" + settedVal.destId
  );
}
*/