import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Container, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined'
import { BoardBlockSelector, HandPieceLastDest, HandPieceLastNum, MissTakeCountState } from '../gameCtrl/BlocksState';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { GameScene, GameSceneState, SoundEnableState } from '../AppInitializer';
import { ElapsedGameTimer, GameEndTime, GamePlayScore, GameTimer, GameTimerStarter, GameTimerState, TimeRenderSwitch } from './HeadsUpDispState';

// ゲームステータス初期化用コンポーネント
export const GameStatusInitializer: React.FC = () => {
  console.debug("Call GameStatusInitializer.");
  const timerStarter = useSetRecoilState(GameTimerStarter);
  timerStarter(null);

  return <>
  </>
}

// ゲームステータス表示HUDコンポーネント
export const HeadsUpDisp: React.FC = () => {
  const gameSceneState = useRecoilValue(GameSceneState);

  switch (gameSceneState) {
    case GameScene.Title:
      return <HeadsUpDispTitle />

    case GameScene.InGame:
      return <HeadsUpDispInGame />

    default:
      return <HeadsUpDispTitle />
  }
}

const HeadsUpDispTitle: React.FC = () => {
  return <Container>
    <Grid
      container
      justifyContent="space-between"
      flexDirection={{ xs: 'column', sm: 'row' }}
      spacing={2}
    >
      <Grid xs={2} sx={{ order: { xs: 2, sm: 1 } }}>
        <MenuButtonContainer />
      </Grid>
      <Grid xs={2} sx={{ order: { xs: 1, sm: 2 } }}>
        <SoundCtrlContainer />
      </Grid>
    </Grid>
  </Container>
}

const HeadsUpDispInGame: React.FC = () => {
  return <Container>
    <Grid
      container
      justifyContent="space-between"
      flexDirection={{ xs: 'column', sm: 'row' }}
      spacing={2}
    >
      <Grid xs={2} sx={{ order: { xs: 3, sm: 1 } }}>
        <MenuButtonContainer />
      </Grid>
      <Grid xs={8} sx={{ order: { xs: 2, sm: 2 } }}>
        <GameInfoContainer />
      </Grid>
      <Grid xs={2} sx={{ order: { xs: 1, sm: 3 } }}>
        <SoundCtrlContainer />
      </Grid>
    </Grid>
  </Container>
}

const MenuButtonContainer: React.FC = () => {
  return <Grid container spacing={2}>
    <Grid xs={12}>
      <Item>Menu</Item>
    </Grid>
  </Grid>
}

const SoundCtrlContainer: React.FC = () => {
  const [isSEEnable, switchSEEnable] = useRecoilState(SoundEnableState);
  const buttonLabel = isSEEnable ? "ON" : "OFF";
  const onClickMethod =
    () => switchSEEnable(!isSEEnable);

  return <Grid container spacing={2}>
    <Grid xs={8}>
      <Button
        variant={isSEEnable ? "contained" : "outlined"}
        size='large'
        startIcon={isSEEnable ? <VolumeUpOutlinedIcon /> : <VolumeOffOutlinedIcon />}
        onClick={onClickMethod}
      >
        {buttonLabel}
      </Button>
    </Grid>
  </Grid>
}

const GameInfoContainer: React.FC = () => {
  const gameTimerState = useRecoilValue(GameTimerState);
  const DispTime = (gameTimerState == GameTimer.Start) ? <ElapsedTimer /> : <EndTime />;

  return <Grid container spacing={2}>
    <Grid xs={5} md={5} xsOffset={2} mdOffset={2}>
      {DispTime}
    </Grid>
    <Grid xs={5} md={5} xsOffset="auto" mdOffset="auto">
      <ScoreItem />
    </Grid>
    <Grid xs={3} md={3}>
      <DbgSelectState />
    </Grid>
    <Grid xs={4} md={4}>
      <DbgHandpieceDest />
    </Grid>
    <Grid xs={3} md={4} >
      <MissTakeCountItem />
    </Grid>
  </Grid>
}

// 経過時間表示コンポーネント
const ElapsedTimer: React.FC = () => {
  const [elapsedtime, timeSetter] = useRecoilState(ElapsedGameTimer);
  const [timeRenderState, timeRenderSwitch] = useRecoilState(TimeRenderSwitch);

  setTimeout(() => {
    timeSetter(Math.floor(Date.now()));
    timeRenderSwitch(!timeRenderState);
  }, 250);

  const dispTime = TimeToStrFormater(elapsedtime);

  return <Item>
    {dispTime}
  </Item>
}

const EndTime: React.FC = () => {
  const endtime = useRecoilValue(GameEndTime);
  const dispTime = TimeToStrFormater(endtime);
  return <Item>
    {dispTime}
  </Item>
}

function TimeToStrFormater(time: number) {
  let second = Math.floor(time / 1000)
  const hour = Math.floor(second / 3600);
  second = second - (hour * 3600);

  const minutes = Math.floor(second / 60);
  second = second - (minutes * 60);

  return ("00" + hour).slice(-2) + ":" + ("00" + minutes).slice(-2) + ":" + ("00" + second).slice(-2);
}

// ミス回数表示コンポーネント
const MissTakeCountItem: React.FC = () => {
  const missProgressBackGroudColor = (defaultColor: string): string => {
    const missTakeCountState = useRecoilValue(MissTakeCountState);
    if (missTakeCountState >= 5) return "red";
    else if (missTakeCountState >= 4) return "orange";
    else if (missTakeCountState >= 2) return "yellow";
    return defaultColor;
  }
  const missProgressFontColor = (defaultColor: string): string => {
    const missTakeCountState = useRecoilValue(MissTakeCountState);
    if (missTakeCountState >= 5) return "white";
    return defaultColor;
  }

  const MissTakeItem = styled(Paper)(({ theme }) => ({
    backgroundColor: missProgressBackGroudColor(theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: missProgressFontColor(theme.palette.text.secondary),
    fontSize: '1.2rem'
  }));

  const missTakeCountState = useRecoilValue(MissTakeCountState);

  return <MissTakeItem>
    Miss:{missTakeCountState}
  </MissTakeItem>
}

const ScoreItem: React.FC = () => {
  const score = useRecoilValue(GamePlayScore);
  const scoreStr = "Score:" + score;

  return <Item>
    {scoreStr}
  </Item>
}

// Dbg: ブロック選択状況表示コンポーネント
const DbgSelectState: React.FC = () => {
  const ActiveItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#51d941',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: "white",
    fontSize: '1.2rem'
  }));

  const boardBlockSelectState = useRecoilValue(BoardBlockSelector);
  const dbgSelectorBlockId = "ID: " + boardBlockSelectState.id;
  const dbgSelectState = boardBlockSelectState.selected ? <ActiveItem>{dbgSelectorBlockId}</ActiveItem> : <Item>{dbgSelectorBlockId}</Item>;

  return dbgSelectState;
}

// Dbg: 最後に番号を設定した盤面と番号の表示コンポーネント
const DbgHandpieceDest: React.FC = () => {
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
  fontSize: '1.2rem'
}));