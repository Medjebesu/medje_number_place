export const enum Difficulty {
    Light  = 1,
    Easy,
    Middle,
    Hard,
    Evil
}

export function GenerateQuestion(difficulty:Difficulty): number[] {

    // T.B.D
    switch(difficulty){
        case difficulty.Light:
        case difficulty.Easy:
        case difficulty.Middle:
        case difficulty.Hard:
        case difficulty.Evil:
        default:
            return MiddleDifficultyQuestion();
    }
}

function MiddleDifficultyQuestion(){

    // T.B.D
    const question = [
        7,0,2, 8,0,4, 0,9,0,
        0,3,0, 2,0,0, 1,7,0,
        0,5,0, 0,0,9, 0,4,0,
      
        0,0,0, 0,8,0, 0,3,0,
        3,0,5, 0,6,0, 0,0,0,
        0,0,0, 4,2,0, 0,0,0,
      
        0,1,0, 6,9,0, 7,0,0,
        0,0,0, 3,0,0, 9,2,1,
        8,0,0, 5,0,0, 0,6,0
    ]

    return question;
}