import React from 'react'
import { DrawStageBase } from './DispDraw'
import { BlocksControl } from "./BlocksControl"
import { BoardInitializer } from './BlocksStateControl'
import { GameStatusInitializer } from '../hudCtrl'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { GameLaunchState, GameScene, GameSceneState } from '../AppInitializer'
import { DrawBackGround } from '../draw3ds'
import { TitlePage } from './TitlePage'

export const GameControl:React.FC = () => {
    
  const gameSceneState = useRecoilValue(GameSceneState);

  switch(gameSceneState){
    case GameScene.Loading:
      return <GameControlLoading />;
      
    case GameScene.InGame:
      return <GameControlInGame blockSize={1.0} />;

    case GameScene.Title:
    default:
      return <GameControlTitle />;
  }
}

type Props ={
  blockSize:number
}

const GameControlLoading:React.FC = () => {
  return <GameLaunchIndicator/>
}

const GameControlInGame:React.FC<Props> = (props) => {
  return <>
    <DrawBackGround />
    <DrawStageBase blockSize={props.blockSize} />
    <BlocksControl blockSize={props.blockSize} />
    <BoardInitializer />
    <GameStatusInitializer />
  </>
}

const GameControlTitle:React.FC = () => {
  return <>
    <DrawBackGround />
    <TitlePage />
  </>
}

const GameLaunchIndicator:React.FC = () =>{

  // ロード完了ステートの監視 T.B.D
  //const hudLaunchState  = useRecoilValue(HudLaunchState);
  //const canvasLoadState = useRecoilValue(CanvasLoadState);
  const gameLaunchStateSetter = useSetRecoilState(GameLaunchState);
  const gameSceneState = useSetRecoilState(GameSceneState);

  //if(hudLaunchState && canvasLoadState){
    gameLaunchStateSetter(true);
    gameSceneState(GameScene.Title);
  //}

  // ロード中画面のモーダルの表示管理？ T.B.D
  return <>
  </>
}