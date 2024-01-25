import { GameDifficulty } from "./GameControlState";

export function GenerateQuestion(difficulty: Difficulty): [number[], number[]] {
  // T.B.D
  switch (difficulty) {
    case GameDifficulty.Middle:
      return MiddleDifficultyQuestion();

    case GameDifficulty.Light:
    case GameDifficulty.Easy:
    case GameDifficulty.Hard:
    case GameDifficulty.Expart:
    case GameDifficulty.Extra:
    default:
      console.warn("Invalid parameter. (not registered Difficulty)");
      return MiddleDifficultyQuestion();
  }
}

function MiddleDifficultyQuestion():[number[], number[]] {
  // T.B.D
  const question = [
    3, 0, 8, 2, 0, 4, 0, 9, 0,
    0, 7, 0, 8, 0, 0, 5, 3, 0,
    0, 1, 0, 0, 0, 9, 0, 4, 0,

    0, 0, 0, 0, 2, 0, 0, 7, 0,
    7, 0, 1, 0, 6, 0, 0, 0, 0,
    0, 0, 0, 4, 8, 0, 0, 0, 0,

    0, 5, 0, 6, 9, 0, 3, 0, 0,
    0, 0, 0, 7, 0, 0, 9, 8, 5,
    2, 0, 0, 1, 0, 0, 0, 6, 0
  ]

  const answer = [
    3, 6, 8, 2, 5, 4, 1, 9, 7,
    9, 7, 4, 8, 1, 6, 5, 3, 2,
    5, 1, 2, 3, 7, 9, 8, 4, 6,

    8, 4, 3, 5, 2, 1, 6, 7, 9,
    7, 2, 1, 9, 6, 3, 4, 5, 8,
    6, 9, 5, 4, 8, 7, 2, 1, 3,

    4, 5, 7, 6, 9, 8, 3, 2, 1,
    1, 3, 6, 7, 4, 2, 9, 8, 5,
    2, 8, 9, 1, 3, 5, 7, 6, 4
  ]

  return [question, answer];
}

export function CulculateAnswer(npQuestion: number[]): number[] {
  let npAnswer: number[] = [];

  return npAnswer;
}
