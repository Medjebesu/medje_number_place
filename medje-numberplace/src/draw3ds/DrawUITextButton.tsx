import * as THREE from 'three'
import { Box, Center, Outlines, Text3D, useCursor } from '@react-three/drei'
import React from 'react'

type Props = {
  text: string,
  textSize: number,
  textColor: THREE.Color | string,
  position: THREE.Vector3,
  onClickMethod?: () => void,
}

export const UITextButton: React.FC<Props> = ({ text, textSize, textColor, position, onClickMethod }: Props) => {

  const letterSpace = textSize / 16;
  const collisionPosition = 
    new THREE.Vector3(
      letterSpace * (text.length * 2.7),
      textSize / 4.25,
      0
    );
  const collisionWidth = (text.length * (textSize + letterSpace) + letterSpace) / 2.5;
  const collisionHeight = textSize / 1.75;
  const collisionVolume = textSize / 1.75;

  const fontProps = { font: '/fonts/Roboto/Roboto Black.json', fontSize: textSize, letterSpacing: letterSpace, lineHeight: textSize, 'material-toneMapped': false, characters: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" }
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  return <>
    <Text3D
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
        onClick={onClickMethod}
      />
      <Box
        args={[collisionWidth, collisionHeight, collisionVolume]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={collisionPosition}
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