import * as THREE from 'three'
import { Box, Center, Outlines, Text3D, useCursor } from '@react-three/drei'
import React from 'react'

type Props = {
  text: string,
  textScale: number,
  textColor: THREE.Color | string,
  position: THREE.Vector3,
  onClickMethod?: () => void,
}

export const UITextButton: React.FC<Props> = ({ text, textScale, textColor, position, onClickMethod }: Props) => {

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
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  return <>
    <Text3D
      scale={textScale}
      smooth={0.0001}
      position={position}
      {...fontProps}
    >
      <meshPhongMaterial color={textColor} />
      <Outlines
        color={"#088551"}
        screenspace={true}
        opacity={Number(hovered)}
        toneMapped={true}
        polygonOffset
        polygonOffsetFactor={5}
        transparent
        thickness={4}
        angle={Math.PI}
      />
      <Box
        args={[collisionWidth, collisionHeight, collisionVolume]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={collisionPosition}
        onClick={onClickMethod}
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