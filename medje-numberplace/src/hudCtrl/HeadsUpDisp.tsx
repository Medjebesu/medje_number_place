import * as React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { BoardBlockSelector, HandPieceLastDest, HandPieceLastNum, MissTakeCountState } from '../gameCtrl/BlocksStateControl';
import { DefaultValue, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

// ゲームステータス初期化用コンポーネント
export const GameStatusInitializer: React.FC = () =>{

  const timerStarter = useSetRecoilState(GameTimerStarter);
  timerStarter(null);

  return <> 
  </>
}

// ゲームステータス表示HUDコンポーネント
export const HeadsUpDisp:React.FC = () =>{
  
  return <Container fixed>
    <Grid container spacing={2}>
      <Grid xs={2}>
        <Item>Menu</Item>
      </Grid>
      <Grid xs={4} md={4} xsOffset={2} mdOffset={2}>
        <ElapsedTimer/>
      </Grid>
      <Grid xs={3} md={3} xsOffset={1} mdOffset={1}>
        <MissTakeCountItem/>
      </Grid>
      <Grid xs={2} >
        <DbgSelectState/>
      </Grid>
      <Grid xs={3} >
        <DbgHandpieceDest/>
      </Grid>
      <Grid xs={2} >
        <Item>Debug3</Item>
      </Grid>
      <Grid xs md={4} mdOffset="auto">
        <Item>Score:XXXXXX</Item>
      </Grid>
    </Grid>
  </Container>
}

// 経過時間表示コンポーネント
const ElapsedTimer:React.FC = () => {

  let [elapsedSecond, timeSetter] = useRecoilState(ElapsedGameTimer);
  
  const elepsedHour = Math.floor(elapsedSecond / 3600);
  elapsedSecond = elapsedSecond - (elepsedHour * 3600);

  const elepsedMinutes = Math.floor(elapsedSecond / 60);
  elapsedSecond = elapsedSecond - (elepsedMinutes * 60);

  const gameStartState = useRecoilValue(GameStartState);
  const [timeRenderState , timeRenderSwitch] = useRecoilState(TimeRenderSwitch);

  if (gameStartState){
    setTimeout(() => {
      timeSetter(Math.floor(Date.now() / 1000));
      timeRenderSwitch(!timeRenderState);
    }, 500);
  }

  return <Item>
    {("00" + elepsedHour).slice(-2) + ":" + ("00" + elepsedMinutes).slice(-2) + ":" + ("00" + elapsedSecond).slice(-2)}
  </Item>
}

// ミス回数表示コンポーネント
const MissTakeCountItem:React.FC = () => {

  const missProgressBackGroudColor = (defaultColor:string):string => {
    const missTakeCountState = useRecoilValue(MissTakeCountState);
    if(missTakeCountState >= 5) return "red";
    else if(missTakeCountState >= 4) return "orange";
    else if(missTakeCountState >= 2) return "yellow";
    return defaultColor;
  }
  const missProgressFontColor = (defaultColor:string):string => {
    const missTakeCountState = useRecoilValue(MissTakeCountState);
    if(missTakeCountState >= 5) return "white";
    return defaultColor;
  }
  
  const MissTakeItem = styled(Paper)(({ theme }) => ({
    backgroundColor: missProgressBackGroudColor(theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: missProgressFontColor(theme.palette.text.secondary),
    fontSize:'1.5rem'
  }));
  
  const missTakeCountState = useRecoilValue(MissTakeCountState);  

  return <MissTakeItem>
    Miss:{missTakeCountState}
  </MissTakeItem>
}

// Dbg: ブロック選択状況表示コンポーネント
const DbgSelectState:React.FC = () =>{
  const ActiveItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#088551',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: "white",
    fontSize:'1.5rem'
  }));

  const boardBlockSelectState = useRecoilValue(BoardBlockSelector);
  const dbgSelectorBlockId = "ID: " + boardBlockSelectState.id;
  const dbgSelectState = boardBlockSelectState.selected ? <ActiveItem>{dbgSelectorBlockId}</ActiveItem> : <Item>{dbgSelectorBlockId}</Item>;

  return dbgSelectState;
}

// Dbg: 最後に番号を設定した盤面と番号の表示コンポーネント
const DbgHandpieceDest:React.FC = () =>{
  const dbgHandpieceDestId = "ID: " + 
    useRecoilValue(HandPieceLastDest) + 
    " => " + 
  useRecoilValue(HandPieceLastNum);

  return <Item>
    {dbgHandpieceDestId}
  </Item>
}

// <Item>コンポーネント定義
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize:'1.5rem'
}));

//
// 表示ステータス管理用ステート
//
const GameStartState = atom({
  key:"gameStartState",
  default: false
});

export const GameStartTime = atom({
  key:"gameStartTime",
  default: 0
});

export const GameEndTime = atom({
  key:"gameEndTime",
  default: 0
});

const ElapsedGameTime = atom({
  key:"elapsedGameTime",
  default: 0
});

const TimeRenderSwitch = atom({
  key: "timeRenderSwitch",
  default: false
});

type GameStartStatus = {
  isStart: boolean;
  startTime: number;
} 
const GameTimerStarter = selector({
  key: "gameTimerStarter",
  get:({get}):GameStartStatus | null => {
    return {isStart:false, startTime:get(GameStartTime)};
  },
  set:({set}, _) => {
    if(!(_ instanceof DefaultValue)) {
      set(GameStartState, true);
      const now = Math.floor(Date.now() /1000);
      set(GameStartTime, (now));
      set(ElapsedGameTime, (now));
    }
  }
});

const ElapsedGameTimer = selector({
  key: "elapsedGameTimer",
  get:({get}):number => {
    return get(ElapsedGameTime);
  },
  set:({get, set}, nowTime) => {
    if(!(nowTime instanceof DefaultValue)) {
      set(ElapsedGameTime, nowTime - get(GameStartTime));
    }
  }
});
