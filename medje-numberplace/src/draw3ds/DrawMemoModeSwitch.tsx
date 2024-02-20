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
  position: THREE.Vector3
}

export const MemoModeSwitch: React.FC<Props> = ({ width, position }: Props) => {

  const switchWidth = width ? width : 1;
  //const switchColor:THREE.Color | string = color ? color : "#51ff41";

  const fonrBaseSize = switchWidth / 4;
  const fontProps = { font: '/fonts/Roboto/Roboto-Black.ttf', fontSize: fonrBaseSize, letterSpacing: fonrBaseSize / 2, lineHeight: switchWidth, 'material-toneMapped': false, characters: "Memo:Onff" }

  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  const adjustAngleX = -0.01;
  const adjustAngleY = -0.02;

  const [nowMode, SetActMode] = useRecoilState(HandPieceActMode);
  const dispText = (nowMode == ActMode.NumSet) ? "Memo:OFF" : "Memo:On";
  const switchColor = (nowMode == ActMode.NumSet) ? "#555555" : "#51ff41";

  const isSoundEnable = useRecoilValue(SoundEnableState);
  const onClickMethod = () => {
    if (isSoundEnable) modeChangeSE.play();
    (nowMode == ActMode.NumSet) ? SetActMode(ActMode.Memo) : SetActMode(ActMode.NumSet);
  }

  return <mesh
    position={position}
  >
    <Box
      args={[switchWidth * 1.5, switchWidth, switchWidth * 0.03]}
      rotation={new THREE.Euler(adjustAngleX, adjustAngleY, 0.00, 'XYZ')}
      onClick={onClickMethod}
    >
      <meshPhongMaterial attach="material" color={switchColor} />
      <Text
        position={new THREE.Vector3(0, 0, 0.03)}
        color={nowMode == ActMode.NumSet ? "#ffffff" : "#555"}
        {...fontProps}
      >
        {dispText}
      </Text>
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