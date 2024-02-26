import { atom, selector } from "recoil";

export const enum GameDifficulty {
  None = 0,
  Light,
  Easy,
  Middle,
  Hard,
  Expart,
  Extra,
  Debug = 99,
}

export const DifficultyMap = new Map([
  [GameDifficulty.None, "None"],
  [GameDifficulty.Light, "Light"],
  [GameDifficulty.Easy, "Easy"],
  [GameDifficulty.Middle, "Middle"],
  [GameDifficulty.Hard, "Hard"],
  [GameDifficulty.Expart, "Expart"],
  [GameDifficulty.Extra, "Extra"],
  [GameDifficulty.Debug, "Debug"]
]);

export const GameDifficultyState = atom({
  key: "gameDifficultyState",
  default: GameDifficulty.None
});

export const GameControlInitializer: React.FC = () => {
  return <></>
}

export const GameRefreshSwitchState = atom({
  key: "gameRefreshSwitchState",
  default: false
});

export const GameRefreshSwitch = selector({
  key: "gameRefreshSwitch",
  get: () => {
    return null;
  },
  set: ({ get, set }, _) => {
    set(GameRefreshSwitchState, !get(GameRefreshSwitchState));
  }
})