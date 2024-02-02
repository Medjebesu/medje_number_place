import { GameDifficulty } from "../gameCtrl/GameState";
import { baseUrl } from "./definition";

const baseURL = baseUrl;
const API_npqg = "npgq"

export type NpgqResponse ={
	question: number[],
	answer: number[],
}

export async function GetNPQuestion(difficulty:GameDifficulty){
	
	//let requestURL = baseURL + "?api=" + API_npqg + "パラメータ→" + difficulty	
	//const response = executeRequest(requestURL);

	/*
	const response = executeRequest(baseURL);
	let resQ = new Array<number>;
	let resA = new Array<number>;

	response.then((data) => {
		console.debug(data.question);
		console.debug(data.answer);
		resQ = data.question;
		resA = data.answer;
	});

	return [resQ, resA];
	*/

	let requestURL = baseURL; // for debug
	return fetch(requestURL);
}

async function executeRequest(requestURL:string){
	const resopnse = await fetch(requestURL);
	return await resopnse.json();
}

async function execute(requestURL:string){
	const response = fetch(requestURL);
	return (await response).json();
}
