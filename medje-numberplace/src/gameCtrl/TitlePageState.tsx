import { atom } from "recoil";

export const enum TitleScene {
  Top = 1,
  //ModeSelect,
  DiffCultySelect = 20,
  GameOption = 30,
}

export const TitleSceneState = atom({
  key: "titleSceneState",
  default: TitleScene.Top
});

export const TitleSceneStateInitializer: React.FC = () => {
  return <>
  </>
}