import React from 'react'
import { atom, useRecoilValue, useSetRecoilState} from 'recoil'
import { UITextButton } from '../draw3ds/DrawUITextButton';
import { UIText } from '../draw3ds/DrawUIText';
import { Vector3 } from 'three';
import { TitleScene, TitleSceneState } from './TitlePageState';

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
      key={"titleUIText"}
      textScale={1.5}
      textColor={"#51ff41"}
      position={titlePosition}
    >
      Number Place
    </UIText>
    <UITextButton
      key={"titleUIStartButton"}
      text={"Start"}
      textScale={1.25}
      textColor={"#ffffff"}
      position={startPosition}
      onClickMethod = {onClickMethod}
    />
  </>
}

const TitlePageDiffCultySelect:React.FC = () =>{
  //const sceneSetter = useSetRecoilState(TitleSceneState);
  //const onClickMethod = () => {
  //  sceneSetter(TitleScene.DiffCultySelect);
  //};
  
  const titlePosition = new Vector3(0,3,0);
  const startPosition = new Vector3(-2,-1,0);

  return <>
    <UIText
      key={"titleUIDifficultText"}
      textScale={2}
      textColor={"#51ff41"}
      position={titlePosition}
    >
      Difficult
    </UIText>
    <UITextButton
      key={"titleUIMiddleButton"}
      text='middle'
      textScale={2}
      textColor={"#ffffff"}
      position={startPosition}
    />
  </>
}

function JumpToScene(_scene:TitleScene) {
  const setter = useSetRecoilState(TitleSceneState);
  return ()=>{
    setter(_scene);
  }
}
