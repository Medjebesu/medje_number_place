import React, { ReactElement } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { UITextButton } from '../draw3ds/DrawUITextButton';
import { UIText } from '../draw3ds/DrawUIText';
import { Color, Euler, Vector3 } from 'three';
import { TitleScene, TitleSceneState } from './TitlePageState';
import { GameSceneSenderInGame } from '../AppInitializer';
import { DifficultyMap } from './GameState';
import { Center } from '@react-three/drei';

export const TitlePage: React.FC = () => {
  const scene = useRecoilValue(TitleSceneState);

  switch (scene) {
    case TitleScene.Top:
      return <TitlePageTop />
    case TitleScene.DiffCultySelect:
      return <TitlePageDiffCultySelect />
  }
}

const TitlePageTop: React.FC = () => {
  const sceneSetter = useSetRecoilState(TitleSceneState);
  const onClickMethod = () => {
    sceneSetter(TitleScene.DiffCultySelect);
  };

  const titlePosition = new Vector3(-5.5, 2.25, 0);
  const startPosition = new Vector3(-1.25, -4, 0);

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
      textColor={"#00ffff"}
      position={startPosition}
      onClickSEPath={'sounds/decide.mp3'}
      onClickMethod={onClickMethod}
    />
  </>
}

const TitlePageDiffCultySelect: React.FC = () => {

  const titlePosition = new Vector3(-2.75, 2.25, 0);

  return <>
    <UIText
      textScale={1.5}
      textColor={"#51ff41"}
      position={titlePosition}
    >
      Difficult
    </UIText>
    <DifficultyButtons />
  </>
}

const DifficultyButtons: React.FC = () => {
  const sceneSetter = useSetRecoilState(GameSceneSenderInGame);

  const buttons = new Array<ReactElement>
  let buttonCnt = 0;
  for (let idx = 1; idx < DifficultyMap.size - 1; idx++) {
    var buttonStr = DifficultyMap.get(idx);
    if (buttonStr !== undefined) {
      var adjustWidth = buttonStr.length * 0.15;
      var buttonPos = new Vector3(-adjustWidth, buttonCnt * -1.25, 0);
    
      buttons.push(
        <UITextButton
          key={`difficultytButton_${idx}`}
          text={buttonStr}
          textScale={0.75}
          textColor={new Color((0x00ffff + (0x330000 - 0x003300 -0x000022) * buttonCnt))}
          position={buttonPos}
          rotation={new Euler(-Math.PI / 135 * buttonCnt, 0, 0, "XYZ")}
          hoverSEPath={'sounds/cursor.mp3'}
          onClickSEPath={'sounds/decide.mp3'}
          onClickMethod={() => sceneSetter(idx)}
        />
      );
      buttonCnt++;
    }
  }

  return <Center position={new Vector3(0.9, -6, 0)} top={true} bottom={true} left={false} >
    {buttons}
  </Center>
}
