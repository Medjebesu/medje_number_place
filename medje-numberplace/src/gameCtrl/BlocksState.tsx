import { DefaultValue, atom, atomFamily, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { GemePlayScoreSetter, GameStartState, GameEndTime, ElapsedGameTime, GameStartTime } from "../hudCtrl";
import { NumberPlace } from "./Board"
import { Vector3 } from "three";
import { GameDifficultyState } from "./GameState";
import { NpAnswer, NpQuestion, QAResponseReceived } from "./BoardState";
import { GenerateQuestion } from "./GenerateQuestion";
import { SoundEnableState } from "../AppInitializer";

// 効果音読み込み
//const incorrectSE = new Audio("/sounds/puzzle_num_incorrect.mp3");
//const singleCorrectSE = new Audio("/sounds/puzzle_num_correct_s.mp3");
//const groupCorrectSE = new Audio("/sounds/puzzle_num_correct_g.mp3");
//const changeMemoSE = new Audio("/sounds/puzzle_memo_in.mp3");

//盤面データ初期化コンポーネント
type BoardInitializerProps = {
  //seed: number; // ナンプレ初期盤面の生成シード値 T.B.D
}

let np: NumberPlace | null = null;

export const BoardInitializer: React.FC<BoardInitializerProps> = (/* props */) => {
  const gameDifficulty = useRecoilValue(GameDifficultyState);

  const qaReceived = useRecoilValue(QAResponseReceived);
  var npQuestion = useRecoilValue(NpQuestion);
  const npAnswer = useRecoilValue(NpAnswer);

  if(!qaReceived){
    GenerateQuestion(gameDifficulty);
  }
  else{
    if(!np) {
      np = new NumberPlace(gameDifficulty, npQuestion, npAnswer);
      const tempArray = new Array<boolean>;
      for(let i = 0; i < 9; i++){tempArray.push(false);}
      np.getQuestion().forEach((value, idx) => {
        var setBlockNum = useSetRecoilState(BoardBlocksNumber(idx))
        var setBlockMemo = useSetRecoilState(BoardBlocksMemos(idx));
        var setBlockLocked = useSetRecoilState(BoardBlocksLocked(idx))
        var setBlockOriginal = useSetRecoilState(BoardBlocksOriginal(idx))

        setBlockNum(value);
        setBlockMemo(tempArray);
        if (value != 0) {
          setBlockLocked(true);
          setBlockOriginal(true);
        }
      });
    }
  }

  return <>
  </>
}


//
// UI表示用ステート
//
export const MissTakeCountState = atom({
  key: "missTakeCountState",
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
  default: { selected: false, id: 0, blockNum: 0 } as BoardSelectState,
});

export const SelectedBlockNum = atom({
  key: "selectedBlockNum",
  default: 0
});

export const BoardBlockSelector = selector({
  key: 'boardBlockSelector',
  get: ({ get }): BoardSelectState => {
    return get(BoardBlockSelectState);
  },
  set: ({ get, set }, newVal) => {
    if (newVal instanceof DefaultValue) {
      set(
        BoardBlockSelectState,
        newVal
      );
    }
    else {
      var oldVal = get(BoardBlockSelectState);
      var setVal: BoardSelectState = newVal;
      if (oldVal.id == newVal.id) {
        setVal.selected = !oldVal.selected;
      }
      else {
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
export const BoardBlocksBasePos = atomFamily<Vector3, number>({
  key: "boardBlockBasePos",
  default: new Vector3(0, 0, 0)
});
export const BoardBlocksLocked = atomFamily<boolean, number>({
  key: 'boardBlocksLocked',
  default: false
});
export const BoardBlocksOriginal = atomFamily<boolean, number>({
  key: 'boardBlocksOriginal',
  default: false
});
export const BoardBlocksNumber = atomFamily<number, number>({
  key: 'boardBlocksNumber',
  default: 0
});
export const BoardBlocksMemos = atomFamily<boolean[], number>({
  key: 'boardBlocksMemos',
  default: new Array<boolean>
});

// ブロックナンバー設定処理用セレクター
export const BlockNumberSetter = selector({
  key: 'blockNumberSelector',
  get: ({ get }): number => {
    return get(HandPieceLastNum);
  },
  set: ({ set, get }, setVal) => {
    if (setVal instanceof DefaultValue) return;
    
    const selectState = get(BoardBlockSelectState);
    const isLocked = get(BoardBlocksLocked(selectState.id));

    if (!BlockNumberSetterFilter(selectState, isLocked)) return;
    if(!np) return;

    // メモモード時
    if(get(HandPieceActMode) == ActMode.Memo){
      const changeMemoSE = new Audio("/sounds/puzzle_memo_in.mp3");
      if(get(SoundEnableState)) changeMemoSE.play();
      const setArray = [...get(BoardBlocksMemos(selectState.id))];
      setArray[setVal-1] = !setArray[setVal-1];
      set(BoardBlocksMemos(selectState.id), setArray);
      return;
    }

    // 入力モード時
    if (!np.checkAnswer(selectState.id, setVal)){
      if(get(SoundEnableState)) {
        const incorrectSE = new Audio("/sounds/puzzle_num_incorrect.mp3");
        incorrectSE.play();
      }
      set(MissTakeCountState, get(MissTakeCountState) + 1);
      return;
    }
    
    set(HandPieceLastDest, selectState.id);
    set(HandPieceLastNum, setVal);
    set(BoardBlocksNumber(selectState.id), setVal);
    set(BoardBlocksLocked(selectState.id), true);

    let [resultStatus, tempScore] = np.setBoardNum(selectState.id, setVal);
    set(GemePlayScoreSetter, tempScore);
    set(SelectedBlockNum, setVal);
          
    if(get(SoundEnableState)){
      switch(resultStatus){
        case 0: 
          const incorrectSE = new Audio("/sounds/puzzle_num_incorrect.mp3");
          incorrectSE.play();
          return;
        case 1: 
          const singleCorrectSE = new Audio("/sounds/puzzle_num_correct_s.mp3");
          singleCorrectSE.play();
          return;
        default: 
          const groupCorrectSE = new Audio("/sounds/puzzle_num_correct_g.mp3");
          groupCorrectSE.play();
      }
    }
    if (np.checkGameComplete()) {
      set(GameStartState, false);
      set(GameEndTime, get(ElapsedGameTime) - get(GameStartTime));
    }
  }
});

const BlockNumberSetterFilter = (_selectState: BoardSelectState, _isLocked: boolean) => {
  // 番号設定先の盤面ブロックが選択されていない場合
  if (!_selectState.selected) {
    return false;
  }
  // 選択した盤面に既に番号が入っている場合
  if (_isLocked) {
    return false;
  }

  return true;
}

//
// 手駒用ブロック制御ステート
//
export const HandpiecesBasePos = atomFamily<Vector3, number>({
  key: "handpiecesBasePos",
  default: new Vector3(0, 0, 0)
});

// 手駒用動作モード定義
export const enum ActMode {
  NumSet,
  Memo
}

// 手駒用ブロック選択状態制御用ステート・セレクタ
export type SelectHandpiece = {
  blockNum: number;
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

  return <>
  </>
}
