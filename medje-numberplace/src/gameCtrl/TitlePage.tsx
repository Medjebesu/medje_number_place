import React from 'react'
import { useRecoilValue, useSetRecoilState} from 'recoil'
import { UITextButton } from '../draw3ds/DrawUITextButton';
import { UIText } from '../draw3ds/DrawUIText';
import { Vector3 } from 'three';
import { TitleScene, TitleSceneState } from './TitlePageState';
import { GameSceneSenderInGame } from '../AppInitializer';
import { GameDifficulty } from './GameState';

export const TitlePage:React.FC = () =>{
  const scene = useRecoilValue(TitleSceneState);
  
  switch(scene){
    case TitleScene.Top:
      return <TitlePageTop/>
    case TitleScene.DiffCultySelect:
      return <TitlePageDiffCultySelect/>
    //case TitleScene.DiffCultySelect:
    //  return <TitlePageDiffCultySelect/>
  }
}

const TitlePageTop:React.FC = () =>{
  const sceneSetter = useSetRecoilState(TitleSceneState);
  const onClickMethod = () => {
    sceneSetter(TitleScene.DiffCultySelect);
  };
  
  const titlePosition = new Vector3(-6.5,2,0);
  const startPosition = new Vector3(-2.5,-4,0);

  return <>
    <UIText
      textScale={1.5}
      textColor={"#51ff41"}
      position={titlePosition}
    >
      Number Place
    </UIText>
    <UITextButton
      text={"Start"}
      textScale={1.25}
      textColor={"#ffffff"}
      position={startPosition}
      onClickSEPath={'sounds/decide.mp3'}
      onClickMethod = {onClickMethod}
    />
  </>
}

const TitlePageDiffCultySelect:React.FC = () =>{
  const sceneSetter = useSetRecoilState(GameSceneSenderInGame);
  
  const titlePosition = new Vector3(-4,2,0);
  const difficultPosition = new Array<Vector3>;
  difficultPosition.push(new Vector3(-3,-4,0));
  difficultPosition.push(new Vector3(-2,-6,0));

  return <>
    <UIText
      textScale={1.5}
      textColor={"#51ff41"}
      position={titlePosition}
    >
      Difficult
    </UIText>
    <UITextButton
      text='middle'
      textScale={1.25}
      textColor={"#ffffff"}
      position={difficultPosition[0]}
      hoverSEPath={'sounds/cursor.mp3'}
      onClickSEPath={'sounds/decide.mp3'}
      onClickMethod = {()=>sceneSetter(GameDifficulty.Middle)}
    />
    <UITextButton
      text='test'
      textScale={1.25}
      textColor={"#ffffff"}
      position={difficultPosition[1]}
      hoverSEPath={'sounds/cursor.mp3'}
      onClickSEPath={'sounds/decide.mp3'}
      onClickMethod = {()=>sceneSetter(GameDifficulty.Debug)}
    />
  </>
}