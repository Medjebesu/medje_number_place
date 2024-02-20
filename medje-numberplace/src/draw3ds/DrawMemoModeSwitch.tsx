import React from 'react'
import * as THREE from 'three'
import { useCursor } from "@react-three/drei"
import { Box, Text } from "@react-three/drei"
import { useRecoilState, useRecoilValue } from 'recoil'
import { ActMode, HandPieceActMode } from '../gameCtrl/BlocksState'
import { SoundEnableState } from '../AppInitializer'

const modeChangeSE = new Audio("/sounds/puzzle_actmode_change.mp3")

type Props = {
  width?: number,
  height?: number,
  position: THREE.Vector3
}

export const MemoModeSwitch: React.FC<Props> = ({ width, height, position }: Props) => {

  const [nowMode, SetActMode] = useRecoilState(HandPieceActMode);
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  const switchWidth = width ? width : 1.5;
  const switchHeight = height ? height : 1;
  const switchVolume = switchWidth * 0.03;

  const fonrBaseSize = switchHeight / 4;
  const fontProps = {
    font: '/fonts/Roboto/Roboto-Black.ttf',
    fontSize: fonrBaseSize,
    letterSpacing: fonrBaseSize / 2,
    lineHeight: switchWidth,
    'material-toneMapped': false,
    characters: "Memo:Onff"
  }

  const adjustAngleX = -0.01;
  const adjustAngleY = -0.02;

  const dispText = (nowMode == ActMode.NumSet) ? "Memo:OFF" : "Memo:On";
  const switchColor = (nowMode == ActMode.NumSet) ? "#555555" : "#51ff41";
  const outlineColor = (nowMode == ActMode.NumSet) ? "#51ff41" : "#555555";

  const isSoundEnable = useRecoilValue(SoundEnableState);
  const onClickMethod = () => {
    if (isSoundEnable) modeChangeSE.play();
    (nowMode == ActMode.NumSet) ? SetActMode(ActMode.Memo) : SetActMode(ActMode.NumSet);
  }

  const outline = hovered ?
    <Box
      args={[switchWidth * 1.075, switchHeight * 1.1, switchVolume * 0.95]}
      onClick={onClickMethod}
    >
      <meshBasicMaterial attach="material" color={outlineColor} />
    </Box> :
    <></>;

  return <mesh
    position={position}
  >
    <Box
      args={[switchWidth, switchHeight, switchVolume]}
      rotation={new THREE.Euler(adjustAngleX, adjustAngleY, 0.00, 'XYZ')}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshPhongMaterial attach="material" color={switchColor} />
      <Text
        position={new THREE.Vector3(0, 0, 0.03)}
        color={nowMode == ActMode.NumSet ? "#ffffff" : "#555"}
        {...fontProps}
      >
        {dispText}
      </Text>
      {outline}
    </Box>
  </mesh>
}

/* Outlinesつけると画面遷移でこけるので除外中
<Outlines 
color={"#082081"}
screenspace={false}
opacity={Number(hovered)}
toneMapped={true}
polygonOffset
polygonOffsetFactor={10}
transparent
thickness={switchWidth*0.025}
angle={Math.PI}
onPointerOver={() => setHovered(true)}
onPointerOut={() => setHovered(false)}
/>
*/