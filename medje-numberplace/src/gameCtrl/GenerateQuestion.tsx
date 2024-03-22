import { useSetRecoilState } from "recoil";
import { GetNPQuestion, NpgqResponse } from "../messagingCtrl/request";
import { GameDifficulty } from "./GameState";
import { NpAnswer, NpQuestion, QAResponseReceived } from "./BoardState";
import { answers, questions } from "./configure";
import { GamePlayScore } from "../hudCtrl";

const selfGenerate = false; // サーバ無しの場合はtrue, 有りの場合はfalse

export const GenerateQuestion: React.FC<{ difficulty: GameDifficulty }> = ({ difficulty }) => {

  const gameScoreSetter = useSetRecoilState(GamePlayScore);
  gameScoreSetter(0);

  switch (difficulty) {
    case GameDifficulty.Middle:
    case GameDifficulty.Light:
    case GameDifficulty.Easy:
    case GameDifficulty.Hard:
    case GameDifficulty.Expart:
    case GameDifficulty.Extra:
      return <InquiryQandA difficulty={difficulty} />
    case GameDifficulty.None:
    case GameDifficulty.Debug:
      console.debug("REST: Send requesut npgq.(Debug)")
      return <InquiryQandA difficulty={difficulty} />
    default:
      console.warn("Invalid parameter. (not registered Difficulty)");
      return <InquiryQandA difficulty={GameDifficulty.Middle} />
  }
}

const InquiryQandA: React.FC<{ difficulty: GameDifficulty }> = ({ difficulty }) => {
  const setReceived = useSetRecoilState(QAResponseReceived);
  const setQuestion = useSetRecoilState(NpQuestion);
  const setAnswer = useSetRecoilState(NpAnswer);

  // サーバ有りの場合
  if (!selfGenerate) {
    const npgq = GetNPQuestion(difficulty); // Promise
    const waitResponse = async () => {
      const fn = async () => {
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
  else {
    const idx = Math.floor(Math.random() * questions.length - 1);

    setQuestion(questions[idx]);
    setAnswer(answers[idx]);

    setReceived(true);
  }

  return <></>
}