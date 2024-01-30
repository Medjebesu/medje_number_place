import { atom } from "recoil";

export const enum GameDifficulty {
  None = 0,
  Light,
  Easy,
  Middle,
  Hard,
  Expart,
  Extra
}

export const GameDifficultyState = atom({
  key: "gameDifficultyState",
  default: GameDifficulty.None
});

export const GameControlInitializer:React.FC = () => {
  return <></>
}