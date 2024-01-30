import React from "react";
import { DefaultValue, atom, selector } from "recoil";
import { TitleSceneStateInitializer } from "./gameCtrl/TitlePageState";
import { GameDifficultyState, GameControlInitializer, GameDifficulty } from "./gameCtrl/GameState";

//※ HUD・Canvas間で使用するステートや、Canvas描画前にしておきたい処理を定義・宣言

export const enum GameScene {
  Loading = 0,
  Title,
  InGame,
}

// ゲームシーン管理
export const GameSceneState = atom({
  key: "gameSceneState",
  default: GameScene.Loading
});

// ゲーム状態
export const enum InGameSituation {
  Ready = 0, // 開始前
  End,        // 終了
  InProgress  // 進行中
}

// ゲームシーンセレクター
export type InGameStatus = {
  difficulty: GameDifficulty
  status: InGameSituation,
}

export const InGameStatusState = atom({
  key: "inGameStatusState",
  default: InGameSituation.Ready
});

export const InGameStatusSelecter = selector({
  key: "inGameStatusSelecter",
  get: ({get}):InGameStatus => {
    return {
      difficulty: get(GameDifficultyState),
      status: get(InGameStatusState),
    }
  },
  set: ({set}, newVal) =>{
    if (!(newVal instanceof DefaultValue)){
      set(GameDifficultyState, newVal.difficulty);
      set(InGameStatusState, newVal.status);
    }
  }
});

export const GameSceneSenderInGame = selector({
  key: "gameSceneSelecter",
  get: ({get}):GameDifficulty => {
    return get(InGameStatusSelecter).difficulty;
  },
  set: ({get, set}, newVal) => {
    var nowStatus = get(InGameStatusState);

    // T.B.D 中段したゲームがある場合に再開する判定を入れる
    if (nowStatus != InGameSituation.InProgress){
      set(InGameStatusSelecter, {
          difficulty: newVal,
          status: InGameSituation.InProgress
        } as InGameStatus
      );
      set(GameSceneState, GameScene.InGame)
    }
  }
});

// 初期起動完了フラグ管理
export const GameLaunchState = atom({
  key:"gameLaunchState",
  default: false,
});

export const AppInitializer:React.FC = () =>{
  return <>
    <TitleSceneStateInitializer />
    <GameControlInitializer />
  </>
}