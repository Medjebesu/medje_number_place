import * as THREE from 'three'
import { Box, Center, Text3D, useCursor } from '@react-three/drei'
import React from 'react'
import { useRecoilValue } from 'recoil';
import { SoundEnableState } from '../AppInitializer';

type Props = {
  text: string,
  textScale: number,
  textColor: THREE.Color | string,
  position: THREE.Vector3,
  hoverSEPath?: string;
  onClickSEPath?: string;
  onClickMethod?: () => void,
}

export const UITextButton: React.FC<Props> = ({ text, textScale, textColor, position, hoverSEPath, onClickSEPath, onClickMethod }: Props) => {

  const letterSpace = 0.125;
  const collisionPosition =
    new THREE.Vector3(
      letterSpace * (text.length * 3),
      0.5,
      position.z
    );
  const collisionWidth = (text.length * (2 + letterSpace) + letterSpace) / 2.5;
  const collisionHeight = 1.25;
  const collisionVolume = 0.5;

  const fontProps = { font: '/fonts/Roboto/Roboto Black.json', fontSize: 24, letterSpacing: letterSpace, lineHeight: 24, 'material-toneMapped': false, characters: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" }

  const isSEEnable = useRecoilValue(SoundEnableState);
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

  return <>
    <Text3D
      scale={textScale}
      smooth={0.0001}
      position={position}
      {...fontProps}
    >
      <meshPhongMaterial color={textColor} />
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
          opacity={0.5}
        />
      </Box>
      {text}
    </Text3D>
  </>
}

// UIText内でアウトラインを使うと落ちるのでその内直す
// <Outlines
//   color={"#088551"}
//   screenspace={true}
//   opacity={Number(hovered)}
//   toneMapped={true}
//   polygonOffset
//   polygonOffsetFactor={5}
//   transparent
//   thickness={4}
//   angle={Math.PI}
// />
