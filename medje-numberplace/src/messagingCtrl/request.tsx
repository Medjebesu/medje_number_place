import { GameDifficulty } from "../gameCtrl/GameState";
import { baseUrl } from "./definition";

const baseURL = baseUrl;
const API_npqg = "npgq"

export type NpgqResponse ={
	question: number[],
	answer: number[],
}

export async function GetNPQuestion(difficulty:GameDifficulty){
	let requestURL = `${baseURL}/${API_npqg}?difficulty=${difficulty}`; // for debug
	return fetch(requestURL);
}