import { useSetRecoilState } from "recoil";
import { GetNPQuestion, NpgqResponse } from "../messagingCtrl/request";
import { GameDifficulty } from "./GameControlState";
import { NpAnswer, NpQuestion, QAResponseReceived } from "./BoardControlState";

const selfGenerate = false; // サーバ無しの場合はtrue, 有りの場合はfalse

export function GenerateQuestion(difficulty: GameDifficulty) {

  switch (difficulty) {
    case GameDifficulty.Middle:
    case GameDifficulty.Light:
    case GameDifficulty.Easy:
    case GameDifficulty.Hard:
    case GameDifficulty.Expart:
    case GameDifficulty.Extra:
      InquiryQandA(difficulty);
      break;

    default:
      console.warn("Invalid parameter. (not registered Difficulty)");
      InquiryQandA(GameDifficulty.Middle);
  }
}

function InquiryQandA(difficulty: GameDifficulty) {

  const setReceived = useSetRecoilState(QAResponseReceived);
  const setQuestion = useSetRecoilState(NpQuestion);
  const setAnswer = useSetRecoilState(NpAnswer)

  // サーバ有りの場合
  if (!selfGenerate) {

    const npgq = GetNPQuestion(difficulty); // Promise

    const waitResponse = async () => {
      const fn = async() => {
        const npgqPro = await (npgq.then((response) => {
          return response.json();
        }) as Promise<NpgqResponse>);
        setQuestion(npgqPro.question);
        setAnswer(npgqPro.answer);

        setReceived(true);
      }
      fn();
    }

    waitResponse();
  }
  // サーバ無しの場合
  else{
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

    setQuestion(question);
    setAnswer(answer);

    setReceived(true);
  }
}
