import { useSetRecoilState } from "recoil";
import { GetNPQuestion, NpgqResponse } from "../messagingCtrl/request";
import { GameDifficulty } from "./GameState";
import { NpAnswer, NpQuestion, QAResponseReceived } from "./BoardState";
import { answers, questions } from "./configure";

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
    case GameDifficulty.Debug:
      console.debug("REST: Send requesut npgq.(Debug)")
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
    const idx = Math.floor(Math.random() * questions.length -1);
    
    setQuestion(questions[idx]);
    setAnswer(answers[idx]);

    setReceived(true);
  }
}
