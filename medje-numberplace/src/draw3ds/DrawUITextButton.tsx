import * as THREE from 'three'
import { Box, Text3D, useCursor } from '@react-three/drei'
import React from 'react'
import { useRecoilValue } from 'recoil';
import { SoundEnableState } from '../AppInitializer';

type Props = {
  text: string,
  textScale: number,
  textColor: THREE.Color | string,
  position: THREE.Vector3,
  rotation?: THREE.Euler,
  hoverSEPath?: string;
  onClickSEPath?: string;
  onClickMethod?: () => void,
  debugMode?: boolean,
}

export const UITextButton: React.FC<Props> = ({ text, textScale, textColor, position, rotation, hoverSEPath, onClickSEPath, onClickMethod, debugMode }: Props) => {
  const isSEEnable = useRecoilValue(SoundEnableState);

  const letterSpace = 0.125;
  const collisionPosition =
    new THREE.Vector3(
      letterSpace * (text.length * 3.25),
      0.45,
      position.z
    );
  const collisionWidth = (text.length * (2 + letterSpace) + letterSpace * 10) / 2.5;
  const collisionHeight = 1.5;
  const collisionVolume = 0.125;

  const fontProps = {
    font: '/fonts/Roboto/Roboto Black.json',
    fontSize: 24,
    letterSpacing: letterSpace,
    lineHeight: 24,
    'material-toneMapped': false,
    characters: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  }

  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  let hoverSE: HTMLAudioElement | null = null;
  if (hoverSEPath != undefined && hoverSEPath != "") {
    hoverSE = new Audio(hoverSEPath);
    hoverSE.loop = false;
    hoverSE.muted = false;
  }

  let onClickSE: HTMLAudioElement | null = null;
  if (onClickSEPath != undefined && onClickSEPath != "") {
    onClickSE = new Audio(onClickSEPath);
    onClickSE.loop = false;
    onClickSE.muted = false;
  }

  const textMaterial = hovered ? <meshBasicMaterial color={textColor} /> : <meshPhongMaterial color={textColor} />;

  return <>
    <Text3D
      scale={textScale}
      smooth={0.0001}
      position={position}
      rotation={rotation ? rotation : new THREE.Euler(undefined)}
      {...fontProps}
    >
      {textMaterial}
      <Box
        args={[collisionWidth, collisionHeight, collisionVolume]}
        onPointerOver={() => {
          if (hoverSE && isSEEnable) hoverSE.play();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        position={collisionPosition}
        onClick={() => {
          if (onClickSE && isSEEnable) onClickSE.play();
          if (onClickMethod) onClickMethod();
        }}
      >
        <meshPhongMaterial
          transparent={true}
          alphaToCoverage={true}
          opacity={debugMode ? 0.5 : 0}
        />
      </Box>
      {text}
    </Text3D>
  </>
}