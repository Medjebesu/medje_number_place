import { DefaultValue, RecoilState, atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { Difficulty, GenerateQuestion } from "./GenerateQuestion";

//盤面データ初期化コンポーネント
type BoardInitializerProps = {
  //seed: number; // ナンプレ初期盤面の生成シード値 T.B.D
}
export const BoardInitializer:React.FC<BoardInitializerProps> = (props) =>{

  const npQuestion = GenerateQuestion(Difficulty.Middle); // T.B.D:難易度選択固定
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
// 盤面ブロック統括制御
//

// 選択状態制御用ステート・セレクタ
export type BoardSelectState = {
  selected: boolean;
  id:  number;
}

export const BoardBlockSelectState = atom({
  key: 'boardBlockSelectState',
  default: {selected: false, id:0} as BoardSelectState,
});

export const BoardBlockSelecter = selector({
  key: 'boardBlockSelecter',
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

      set(
        BoardBlockSelectState, 
        setVal
      );
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

export const HandPieceSetter = atom({
  key: 'handpieceSetter',
  default: {
    blockNum: 0,
    actMode: ActMode.None,
    destId: -1
  } as SelectHandpiece
});

export const HandpieceSelecter = selector({
  key: 'handpieceSelecter',
  get: ({get}):SelectHandpiece => {
    const getVal:SelectHandpiece = {
      blockNum:get(HandPieceLastNum),
      actMode:get(HandPieceActMode),
      destId:get(HandPieceLastDest),
    };

    return getVal;
  },
  set: ({set}, setVal) => {
    set(HandPieceSetter, setVal);
    if(!(setVal instanceof DefaultValue)){

    }
  }
});

//
// デバッグ用ステートログ出力
//
export const BlockStateControlLog: React.FC = () => {

  const settedVal = useRecoilValue(BoardBlockSelecter);
  console.debug("BlockSelecter state Changed:" + " selected=" + settedVal.selected + " id=" + settedVal.id);

  return<>
  </>
}

// デバッグ用手駒用ブロック操作ログ出力
export const HandpieceActLog = () => {

  const settedVal = useRecoilValue(HandPieceSetter);
  console.debug("Handpiece act:" + 
                " BlockNum=" + settedVal.blockNum + 
                " Mode=" + settedVal.actMode + 
                " Mode=" + settedVal.destId
  );
}