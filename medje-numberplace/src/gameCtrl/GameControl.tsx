import React from 'react'
import { DrawStageBase } from './DispDraw'
import { BlocksControl } from "./BlocksControl"
import { BoardInitializer } from './BlocksStateControl'
import { GameStatusInitializer } from '../hudCtrl'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const GameControl:React.FC = () => {
    
  const blockSize = 1.0;

  return (
    <>
      <GameLaunchIndicator/>
      <DrawStageBase blockSize={blockSize}/>
      <BlocksControl blockSize={blockSize}/>
      <BoardInitializer/>
      <GameStatusInitializer/>
    </>
  )
}

// 初期起動完了フラグ
export const GameLaunchState = atom({
  key:"gameLaunchState",
  default: false,
});

const GameLaunchIndicator:React.FC = () =>{

  // ロード完了ステートの監視 T.B.D
  //const hudLaunchState  = useRecoilValue(HudLaunchState);
  //const canvasLoadState = useRecoilValue(CanvasLoadState);
  const gameLaunchStateSetter = useSetRecoilState(GameLaunchState);

  //if(hudLaunchState && canvasLoadState){
    gameLaunchStateSetter(true);
  //}

  // ロード中画面のモーダルの表示管理？ T.B.D
  return <>
  </>
}