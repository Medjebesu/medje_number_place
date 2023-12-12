import * as React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { BoardBlockSelecter, HandPieceSetter } from '../gameCtrl/BlocksStateControl';
import { useRecoilValue } from 'recoil';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ActiveItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#088551',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: "white",
}));

export const HeadsUpDisp:React.FC = () =>{
  const BoardBlockSelectState = useRecoilValue(BoardBlockSelecter);
  const dbgSelecterBlockId = "ID: " + BoardBlockSelectState.id;
  const dbgSelectState = BoardBlockSelectState.selected ? <ActiveItem>{dbgSelecterBlockId}</ActiveItem> : <Item>{dbgSelecterBlockId}</Item>;

  const HandpieceSelectState = useRecoilValue(HandPieceSetter);
  const dbgHandpieceDestId = "ID: " + HandpieceSelectState.destId + " => " + HandpieceSelectState.blockNum;

  return (
    <Container fixed>
      <Grid container spacing={2}>
        <Grid xs={2}>
          <Item>Menu</Item>
        </Grid>
        <Grid xs={4} md={4} xsOffset={2} mdOffset={2}>
          <Item>hh:mm:ss</Item>
        </Grid>
        <Grid xs={2} md={2} xsOffset={2} mdOffset={2}>
          <Item>Miss:XX</Item>
        </Grid>
        <Grid xs={2} >
          {dbgSelectState}
        </Grid>
        <Grid xs={3} >
          <Item>{dbgHandpieceDestId}</Item>
        </Grid>
        <Grid xs={2} >
          <Item>Debug3</Item>
        </Grid>
        <Grid xs md={4} mdOffset="auto">
          <Item>Score:XXXXXX</Item>
        </Grid>
      </Grid>
    </Container>
  );
}