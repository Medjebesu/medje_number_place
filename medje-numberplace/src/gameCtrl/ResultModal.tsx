import "./resultModal.css"
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import { DifficultyMap, GameDifficulty, GameDifficultyState, GameRefreshSwitch } from "./GameState";
import { ElapsedGameTime, GamePlayScore } from "../hudCtrl";
import { BoardStateResetter } from "./BoardState";
import { BlocksStateReset } from "./BlocksState";
import { GameScene, GameSceneState } from "../AppInitializer";
import { TitleScene, TitleSceneState } from "./TitlePageState";

export const ResultModal: React.FC = () => {

	const showModal = useRecoilValue(ShowResultModalState);
	const [showBoard, setBoardShown] = useRecoilState(ShowBoardInResultState);

	const difficulty = useRecoilValue(GameDifficultyState);
	const clearTime = useRecoilValue(ElapsedGameTime);
	const gameScore = useRecoilValue(GamePlayScore);

	let tempTime = clearTime;
	const elepsedHour = Math.floor(clearTime / 3600);
	tempTime -= (elepsedHour * 3600);
	
  const elepsedMinutes = Math.floor(tempTime / 60);
	tempTime -= (elepsedMinutes * 60);

  const elapsedSecond = Math.floor(tempTime);
	tempTime -= elepsedMinutes;

	const clearTimeStr = ("00" + elepsedHour).slice(-2) + ":" + ("00" + elepsedMinutes).slice(-2) + ":" + ("00" + elapsedSecond).slice(-2) + "." + ("0." + tempTime).slice(-1);

	const boardStateSetter  = useSetRecoilState(BoardStateResetter);
	const blocksStateSetter = useSetRecoilState(BlocksStateReset);
	const gameRefresh = useSetRecoilState(GameRefreshSwitch);
	const modalSwitch = useSetRecoilState(ShowResultModalState);
	const gameSceneState = useSetRecoilState(GameSceneState);
	const titleSceneState = useSetRecoilState(TitleSceneState);

	const OneMoreClickMethod = useSetRecoilState(OneMoreButtonSelector);
	const DifficultySelectClickMethod = useSetRecoilState(DifficultySelectButtonSelector);

	if (showBoard){
		return <div id="overlay-light" onClick={()=>setBoardShown(false)}>
			<h2>Click any to return</h2>
		</div>
	}
	else if(showModal) {
		return <div id="overlay">
			<Paper
				sx={{
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#ffedb7',
					border: 10,
					borderStyle: 'double',
					borderImage: 'linear-gradient(#f6b73c, #4d9f0c) 1;',
					p: '20px',
					width: 620,
					height: 620,
				}}
			>
				<h1 id="result-header-text">Result</h1>
				<div id="result-details">
					<table id="detail-table">
						<tbody>
							<tr>
								<td><span id="difficulty-header">Difficulty</span></td>
								<td><span id="difficulty-body">{DifficultyMap.get(difficulty)}</span></td>
							</tr>
							<tr>
								<td><span id="time-header">Time</span></td>
								<td><span id="time-body">{clearTimeStr}</span></td>
							</tr>
							<tr>
								<td><span id="score-header">Score</span></td>
								<td><span id="score-body">{gameScore}</span></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div id="button-area">
					<Stack spacing={{ sm: 3 }} direction="row" useFlexGap flexWrap="wrap">
						<Button variant="contained" size="large" fullWidth onClick={()=>OneMoreClickMethod(null)}>One more</Button>
						<Button variant="contained" size="large" fullWidth onClick={()=>DifficultySelectClickMethod(null)}>Difficulty Select</Button>
						<Button variant="outlined" size="large" fullWidth onClick={()=>setBoardShown(true)}>Show Board</Button>
					</Stack>
				</div>
			</Paper>
		</div >
	}
	else {
		return <></>
	}
}

export const ShowResultModalState = atom({
	key: "showResultModalState",
	default: false
});

const ShowBoardInResultState = atom({
	key: "showBoardInResultState",
	default: false,
});


const OneMoreButtonSelector = selector({
	key: "oneMoreButtonSelector",
	get: ()=>{
		return null
	},
	set: ({set})=>{
		set(GameRefreshSwitch, null);
		set(BoardStateResetter,null);
		set(BlocksStateReset, null);
		set(ShowResultModalState,false);
	}
});

const DifficultySelectButtonSelector = selector({
	key: "difficultySelectButtonSelector",
	get: ()=>{
		return null
	},
	set: ({set})=>{
		set(BoardStateResetter,null);
		set(BlocksStateReset, null);
		set(GameDifficultyState, GameDifficulty.None);
		set(GameSceneState, GameScene.Title);
		set(TitleSceneState, TitleScene.DiffCultySelect);
	
		set(ShowResultModalState,false);
	}
});