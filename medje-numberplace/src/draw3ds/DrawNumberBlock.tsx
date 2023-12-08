import React from 'react'
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber"
import { Text, RoundedBox, Outlines, useCursor } from "@react-three/drei"
import { BlockSelecter } from '../gameCtrl/BlocksStateControl'
import { useRecoilState } from 'recoil'

type Props = {
  blockId:number;
  blockNum:number;
  position:THREE.Vector3 | undefined;
  color:THREE.ColorRepresentation  | undefined;
  selectedColor?:THREE.ColorRepresentation  | undefined;
  width:number;
  height?:number;
  volume?:number;
  blockAnim?:boolean;
}

// ブロック描画
export const DrawNumberBlock:React.FC<Props> = (props) => {
  var blockNum = (props.blockNum == 0 ? "" : props.blockNum.toString())
  const blockHeight = (props.height || props.width)
  const blockVolume = (props.volume || props.width)
  const fontProps = { font: '/fonts/Roboto/Roboto-Black.ttf', fontSize: props.width, letterSpacing: props.width / 2, lineHeight: blockHeight, 'material-toneMapped': false, characters: "0123456789" }

  const boxRef = React.useRef()
  const NumText = (
    <Text color="#555" position={[0, -(blockHeight/10),blockVolume]} {...fontProps}>
      {blockNum}
    </Text>
  )

  // ブロックモーション
  useFrame((state) => {
    if (props.blockAnim || false){
      if(boxRef.current != null){
        boxRef.current.position.y = Math.sin(state.clock.elapsedTime) * (blockHeight * 0.03)
      }
    }
  })

  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  const [ blockSelecter, setBlockSelecter] = useRecoilState(BlockSelecter);
  const onBlockSelect = () => {
    setBlockSelecter({selected:!blockSelecter.selected, id:props.blockId});
  }

  const tileColor = (blockSelecter.selected && blockSelecter.id==props.blockId)? props.selectedColor : props.color;

  return(
    <mesh position={props.position}>
      <RoundedBox
        ref={boxRef}
        args={[props.width, blockHeight, blockVolume]}
        radius={0.025}
        smoothness={10}
        bevelSegments={4}
        creaseAngle={0.4}
      >
        {NumText}
        <meshBasicMaterial color={tileColor}/>
        <Outlines
          color={"#550000"}
          screenspace={false}
          opacity={Number(hovered)}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={10}
          transparent
          thickness={props.width*0.05}
          angle={Math.PI}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onBlockSelect}
        />
      </RoundedBox>
    </mesh>
  );
}