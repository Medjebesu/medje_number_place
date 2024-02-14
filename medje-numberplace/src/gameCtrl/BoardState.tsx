import { atom, atomFamily } from "recoil";


// ナンプレ問題取得済みフラグ
export const QAResponseReceived = atom({
  key: "qaResponseReceived",
  default: false
});

export const NpQuestion = atom({
  key: "npQuestion",
  default: new Array<number>
});

export const NpAnswer = atom({
  key: "npAnswer",
  default: new Array<number>
});
