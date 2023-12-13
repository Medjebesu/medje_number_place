import * as React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { BoardBlockSelector, HandPieceLastDest, HandPieceLastNum, MissTakeCountState } from '../gameCtrl/BlocksStateControl';
import { useRecoilValue } from 'recoil';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize:'1.0rem'
}));

const ActiveItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#088551',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: "white",
  fontSize:'1.0rem'
}));

const MissTakeItem = styled(Paper)(({ theme }) => ({
  backgroundColor: missProgressBackGroudColor(theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: missProgressFontColor(theme.palette.text.secondary),
  fontSize:'1.5rem'
}));

function missProgressBackGroudColor(defaultColor:string):string {
  const missTakeCountState = useRecoilValue(MissTakeCountState);
  if(missTakeCountState >= 5) return "red";
  else if(missTakeCountState >= 4) return "orange";
  else if(missTakeCountState >= 2) return "yellow";
  return defaultColor;
}
function missProgressFontColor(defaultColor:string):string {
  const missTakeCountState = useRecoilValue(MissTakeCountState);
  if(missTakeCountState >= 5) return "white";
  return defaultColor;
}


export const HeadsUpDisp:React.FC = () =>{
  const boardBlockSelectState = useRecoilValue(BoardBlockSelector);
  const missTakeCountState = useRecoilValue(MissTakeCountState);
  
  const dbgSelectorBlockId = "ID: " + boardBlockSelectState.id;
  const dbgSelectState = boardBlockSelectState.selected ? <ActiveItem>{dbgSelectorBlockId}</ActiveItem> : <Item>{dbgSelectorBlockId}</Item>;

  const dbgHandpieceDestId = "ID: " + 
    useRecoilValue(HandPieceLastDest) + 
    " => " + 
    useRecoilValue(HandPieceLastNum);

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
          <MissTakeItem>Miss:{missTakeCountState}</MissTakeItem>
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