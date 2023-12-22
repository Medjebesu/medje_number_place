import THREE, { Vector3 } from "three"
import { AnimStatus, BlockAnimState } from "../gameCtrl/BlocksStateControl";
import { SetterOrUpdater } from "recoil";

export function BoradBlockAnimation(
  refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>,
  state: BlockAnimState,
  stateSetter:SetterOrUpdater<BlockAnimState>,
  blockBasePos:Vector3,
  blockWidth:number,
  blockHeight:number,
  blockVolume:number,
){
  
  const animation = animationMap.get(state.pattern);
  if(animation != null){
    animation(refCurrent, state, blockBasePos, blockWidth, blockHeight, blockVolume);
  }
  else {
    SetDefault(refCurrent, blockBasePos);
    stateSetter({
      status: AnimStatus.Idle,
      pattern: "default",
      frame: 0
    } as BlockAnimState);

    console.warn("Pattern='" + state.pattern + "' is not registerd.");
    return;
  }

  // アニメーション終了フレーム判定
    // 連動パターンへの切替
    // 稼働状態ステートの更新
  
  // アニメーションパターン分岐
    // フレーム値に応じたポジション・回転等の設定
      
  // フレーム終了処理
  if(state.pattern != "default"){
    stateSetter({
      status: state.status,
      pattern: state.pattern,
      frame: state.frame >= ANIM_MAX_FRAME ? 0 :state.frame + 1,
    });
  }
}

const ANIM_MAX_FRAME = 20 * 60; // Max:20秒以内のアニメーション
const animationMap = new Map<string, (refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, state:BlockAnimState, basePos:Vector3, blockWidth:number, blockHeight:number, blockVolume:number)=>void>();

//
// ブロックアニメーション定義
//
const animations: {name:string, anim:(refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, state:BlockAnimState, basePos:Vector3, blockWidth:number, blockHeight:number, blockVolume:number)=>void}[] = [
  {
    name: "default", anim: (refCurrent, _, basePos)=> {
      SetDefault(refCurrent, basePos);
    },
  },
  {
    name: "floating", anim: (refCurrent, state, _, blockHeight) => {
      refCurrent.position.y = Math.sin(state.frame / 60) * (blockHeight * 0.03);
    }
  }
]

// アニメーションセット
animations.map((anim) =>{
  animationMap.set(anim.name, anim.anim);
});

function SetDefault(refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, basePos:Vector3){
  refCurrent.position.set(basePos.x, basePos.y, basePos.z);
  refCurrent.rotation.set(0,0,0);
}