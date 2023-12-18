export const enum Difficulty {
  Light = 1,
  Easy,
  Middle,
  Hard,
  Evil
}

export function GenerateQuestion(difficulty: Difficulty): [number[], number[]] {
  // T.B.D
  switch (difficulty) {
    case Difficulty.Light:
    case Difficulty.Easy:
    case Difficulty.Middle:
      return MiddleDifficultyQuestion();
    case Difficulty.Hard:
    case Difficulty.Evil:
    default:
      console.debug("Invalid parameter. (not registered Difficulty)");
      return MiddleDifficultyQuestion();
  }
}

function MiddleDifficultyQuestion():[number[], number[]] {
  // T.B.D
  const question = [
    7, 0, 2, 8, 0, 4, 0, 9, 0,
    0, 3, 0, 2, 0, 0, 1, 7, 0,
    0, 5, 0, 0, 0, 9, 0, 4, 0,

    0, 0, 0, 0, 8, 0, 0, 3, 0,
    3, 0, 5, 0, 6, 0, 0, 0, 0,
    0, 0, 0, 4, 2, 0, 0, 0, 0,

    0, 1, 0, 6, 9, 0, 7, 0, 0,
    0, 0, 0, 3, 0, 0, 9, 2, 1,
    8, 0, 0, 5, 0, 0, 0, 6, 0
  ]

  const answer = [
    7, 6, 2, 8, 1, 4, 5, 9, 3,
    9, 3, 4, 2, 5, 6, 1, 7, 8,
    1, 5, 8, 7, 3, 9, 2, 4, 6,

    2, 4, 7, 1, 8, 5, 6, 3, 9,
    3, 8, 5, 9, 6, 7, 4, 1, 2,
    6, 9, 1, 4, 2, 3, 8, 5, 7,

    4, 1, 3, 6, 9, 2, 7, 8, 5,
    5, 7, 6, 3, 4, 8, 9, 2, 1,
    8, 2, 9, 5, 7, 1, 3, 6, 4
  ]

  return [question, answer];
}

export function CulculateAnswer(npQuestion: number[]): number[] {
  let npAnswer: number[] = [];

  return npAnswer;
}
