import React from 'react'
import { useRecoilValue, useSetRecoilState} from 'Recoil'
import { UITextButton } from '../draw3ds/DrawUITextButton';
import { UIText } from '../draw3ds/DrawUIText';
import { Vector3 } from 'three';
import { TitleScene, TitleSceneState } from './TitlePageState';

export const TitlePage:React.FC = () =>{
  //const scene = useRecoilValue(TitleSceneState);
  const scene = TitleScene.Top;

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
  //const sceneSetter = useSetRecoilState(TitleSceneState);
  const onClickMethod = () => {
    //sceneSetter(TitleScene.DiffCultySelect);
  };
  
  const titlePosition = new Vector3(-4.25,3,0);
  const startPosition = new Vector3(-1.75,-4,0);

  return <>
    <UIText
      textSize={2}
      textColor={"#51ff41"}
      position={titlePosition}
    >
      Number Place
    </UIText>
    <UITextButton
      text={"Start"}
      textSize={2}
      textColor={"#ffffff"}
      position={startPosition}
      onClickMethod = {onClickMethod}
    />
  </>
}

const TitlePageDiffCultySelect:React.FC = () =>{
  const sceneSetter = useSetRecoilState(TitleSceneState);
  const onClickMethod = () => {
    sceneSetter(TitleScene.DiffCultySelect);
  };
  
  const titlePosition = new Vector3(0,3,0);
  const startPosition = new Vector3(-2,-1,0);

  return <>
    <UIText
      textSize={2}
      textColor={"#51ff41"}
      position={titlePosition}
    >
      Difficult
    </UIText>
    <UITextButton
      text='middle'
      textSize={2}
      textColor={"0x000000"}
      position={startPosition}
      onClickMethod = {onClickMethod}
    />
  </>
}

function JumpToScene(_scene:TitleScene) {
  const setter = useSetRecoilState(TitleSceneState);
  return ()=>{
    setter(_scene);
  }
}
