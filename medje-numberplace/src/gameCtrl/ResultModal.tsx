import "./resultModal.css"
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import { DifficultyMap, GameDifficulty, GameDifficultyState, GameRefreshSwitch } from "./GameState";
import { GameEndTime, GamePlayScore } from "../hudCtrl";
import { BoardStateReset } from "./BoardState";
import { BlocksStateReset } from "./BlocksState";
import { GameScene, GameSceneState } from "../AppInitializer";
import { TitleScene, TitleSceneState } from "./TitlePageState";

export const ResultModal: React.FC = () => {
  const showModal = useRecoilValue(ShowResultModalState);
  const [showBoard, setBoardShown] = useRecoilState(ShowBoardInResultState);
  const OneMoreClickMethod = useSetRecoilState(OneMoreButtonSelector);
  const DifficultySelectClickMethod = useSetRecoilState(DifficultySelectButtonSelector);

  if (showBoard) {
    return <div id="overlay-light" onClick={() => setBoardShown(false)}>
      <h2>Click any to return</h2>
    </div>
  }
  else if (showModal) {
    return <div id="overlay">
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffedb7',
          border: 10,
          borderStyle: 'double',
          borderImage: 'linear-gradient(#f6b73c, #4d9f0c) 1;',
          p: '20px',
          width: 620,
          height: 620,
        }}
      >
        <h1 id="result-header-text">Result</h1>
        <div id="result-details">
          <table id="detail-table">
            <tbody>
              <tr>
                <td><span id="difficulty-header">Difficulty</span></td>
                <td><span id="difficulty-body"><Difficulty /></span></td>
              </tr>
              <tr>
                <td><span id="time-header">Time</span></td>
                <td><span id="time-body"><ClearTime /></span></td>
              </tr>
              <tr>
                <td><span id="score-header">Score</span></td>
                <td><span id="score-body"><GameScore /></span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="button-area">
          <Stack spacing={{ sm: 3 }} direction="row" useFlexGap flexWrap="wrap">
            <Button variant="contained" size="large" fullWidth onClick={() => OneMoreClickMethod(null)}>One more</Button>
            <Button variant="contained" size="large" fullWidth onClick={() => DifficultySelectClickMethod(null)}>Difficulty Select</Button>
            <Button variant="outlined" size="large" fullWidth onClick={() => setBoardShown(true)}>Show Board</Button>
          </Stack>
        </div>
      </Paper>
    </div >
  }
  else {
    return <></>
  }
}

const Difficulty: React.FC = () => {
  const difficulty = useRecoilValue(GameDifficultyState);

  return <>
    {DifficultyMap.get(difficulty)}
  </>
}

const ClearTime: React.FC = () => {
  const clearTime = useRecoilValue(GameEndTime);

  let tempTime = Math.floor(clearTime / 1000);
  const miliSecond = Math.floor((clearTime % 1000) / 10); //mSec頭2桁まで使用

  const hour = Math.floor(tempTime / 3600);
  tempTime -= (hour * 3600);

  const minutes = Math.floor(tempTime / 60);
  tempTime -= (minutes * 60);

  const second = Math.floor(tempTime);

  const hourtStr = hour < 1 ? "" : "" + hour + ":";
  const clearTimeStr = hourtStr + ("00" + minutes).slice(-2) + ":" + ("00" + second).slice(-2) + "." + miliSecond;

  return <>
    {clearTimeStr}
  </>
}

const GameScore: React.FC = () => {
  const gameScore = useRecoilValue(GamePlayScore);
  return <>
    {gameScore}
  </>
}

export const ShowResultModalState = atom({
  key: "showResultModalState",
  default: false
});

const ShowBoardInResultState = atom({
  key: "showBoardInResultState",
  default: false,
});


const OneMoreButtonSelector = selector({
  key: "oneMoreButtonSelector",
  get: () => {
    return null
  },
  set: ({ set }) => {
    set(GameRefreshSwitch, null);
    set(BoardStateReset, null);
    set(BlocksStateReset, null);
    set(ShowResultModalState, false);
  }
});

const DifficultySelectButtonSelector = selector({
  key: "difficultySelectButtonSelector",
  get: () => {
    return null
  },
  set: ({ set }) => {
    set(BoardStateReset, null);
    set(BlocksStateReset, null);
    set(GameDifficultyState, GameDifficulty.None);
    set(TitleSceneState, TitleScene.DiffCultySelect);
    set(GameSceneState, GameScene.Title);

    set(ShowResultModalState, false);
  }
});