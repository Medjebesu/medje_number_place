import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { BoardBlocksLocked, BoardBlocksMemos, BoardBlocksNumber, BoardBlocksOriginal } from "./BlocksState";
import { NumberPlace } from "./Board";
import { GenerateQuestion } from "./GenerateQuestion";
import { GameDifficultyState } from "./GameState";

//盤面データ初期化コンポーネント
type BoardInitializerProps = {
  //seed: number; // ナンプレ初期盤面の生成シード値 T.B.D
}

export let np: NumberPlace | null = null;

export const BoardInitializer: React.FC<BoardInitializerProps> = (/* props */) => {
  console.debug("Call BoardInitializer.");
  const gameDifficulty = useRecoilValue(GameDifficultyState);
  const qaReceived = useRecoilValue(QAResponseReceived);

  if (!qaReceived) {
    console.debug("Call GenerateQuestion.");
    return <GenerateQuestion difficulty={gameDifficulty} />
  }
  else {
    if (!np) {
      return <BlocksDataInitializer />
    }
    else {
      console.debug("Call np is null?");
      return <></>
    }
  }
}

const BlocksDataInitializer: React.FC = () => {
  console.debug("Call BlocksDataInitializer.");
  const gameDifficulty = useRecoilValue(GameDifficultyState);
  const npQuestion = useRecoilValue(NpQuestion);
  const npAnswer = useRecoilValue(NpAnswer);

  np = new NumberPlace(gameDifficulty, npQuestion, npAnswer);
  const tempArray = new Array<boolean>;
  for (let i = 0; i < 9; i++) { tempArray.push(false); }
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

  return <></>
}

export const BoardStateReset = selector({
  key: "boardStateReset",
  get: () => { return null; },
  set: ({ set }, _) => {
    set(QAResponseReceived, false);
    set(NpQuestion, new Array<number>);
    set(NpAnswer, new Array<number>);
    np = null;
  }
});

// ナンプレ問題取得済みフラグ
export const QAResponseReceived = atom({
  key: "qaResponseReceived",
  default: false
});

export const NpQuestion = atom({
  key: "npQuestion",
  default: new Array<number>
});

export const NpAnswer = atom({
  key: "npAnswer",
  default: new Array<number>
});
