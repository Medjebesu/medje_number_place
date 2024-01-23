import React from "react";
import { atom } from "recoil";
import { TitleSceneStateInitializer } from "./gameCtrl/TitlePageState";

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

// 初期起動完了フラグ管理
export const GameLaunchState = atom({
  key:"gameLaunchState",
  default: false,
});

export const AppInitializer:React.FC = () =>{
  return <>
    <TitleSceneStateInitializer />
  </>
}