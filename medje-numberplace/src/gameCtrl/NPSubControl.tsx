import * as THREE from 'three'
import { MemoModeSwitch } from '../draw3ds/DrawMemoModeSwitch';

export const NPSubControl:React.FC = () =>{
	
	const memoModeSwitchPosition = new THREE.Vector3(6, -5.25, 0);

  return<>
		<MemoModeSwitch position={memoModeSwitchPosition}/>
	</>
}