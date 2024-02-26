import { DefaultValue, atom, selector } from 'recoil';

export const enum GameTimer {
  Ready = 0,
  Start,
  End
}
export const GameTimerState = atom({
  key: "gameTimerState",
  default: GameTimer.Ready
});

export const GameStartTime = atom({
  key: "gameStartTime",
  default: 0
});

export const GameEndTime = atom({
  key: "gameEndTime",
  default: 0
});

export const ElapsedGameTime = atom({
  key: "elapsedGameTime",
  default: 0
});

export const TimeRenderSwitch = atom({
  key: "timeRenderSwitch",
  default: false
});

export type GameStartStatus = {
  isStart: boolean;
  startTime: number;
}
export const GameTimerStarter = selector({
  key: "gameTimerStarter",
  get: ({ get }): GameStartStatus | null => {
    return { isStart: false, startTime: get(GameStartTime) } as GameStartStatus;
  },
  set: ({ set }, _) => {
    if (!(_ instanceof DefaultValue)) {
      set(GameTimerState, GameTimer.Start);
      const now = Math.floor(Date.now());
      set(GameStartTime, (now));
      set(ElapsedGameTime, (now));
      set(GameEndTime, 0);
    }
  }
});

export const ElapsedGameTimer = selector({
  key: "elapsedGameTimer",
  get: ({ get }): number => {
    return get(ElapsedGameTime);
  },
  set: ({ get, set }, nowTime) => {
    if (!(nowTime instanceof DefaultValue)) {
      set(ElapsedGameTime, nowTime - get(GameStartTime));
    }
  }
});

export const GamePlayScore = atom({
  key: "gamePlayScore",
  default: 0
});

export const GemePlayScoreSetter = selector({
  key: "gemePlayScoreSetter",
  get: ({ get }): number => {
    return get(GamePlayScore);
  },
  set: ({ get, set }, basePoint) => {
    if (!(basePoint instanceof DefaultValue)) {
      let timeBonus = Math.floor(((45 * 60) - (get(ElapsedGameTime) / 1000)) / 50);
      if (timeBonus < 1) timeBonus = 1;
      set(GamePlayScore, get(GamePlayScore) + basePoint * timeBonus);
    }
  }
});