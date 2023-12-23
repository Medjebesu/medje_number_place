import THREE, { Vector3 } from "three"
import { AnimStatus, BlockAnimState } from "../gameCtrl/BlocksStateControl";

export function SetBoardBlockPattern(blockId:number, animPattern:string){

  let animCtrl = AnimationFrameCtrl.get(blockId);
  if(AnimationFrameCtrl.get(blockId) == undefined){
    animCtrl = {
      status:AnimStatus.Idle,
      pattern: animPattern,
      frame: 0
    } as BlockAnimState  
  }
  else{
    // WIP
    animCtrl = {
      status:animCtrl?.status,
      pattern: animPattern,
      frame: 0
    } as BlockAnimState
  }

  AnimationFrameCtrl.set(blockId, animCtrl);
}

export function BoardBlockAnimation(
  refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>,
  //state: BlockAnimState,
  //stateSetter:SetterOrUpdater<BlockAnimState>,
  blockId:number,
  blockBasePos:Vector3,
  blockWidth:number,
  blockHeight:number,
  blockVolume:number,
){
  
  let animCtrl = AnimationFrameCtrl.get(blockId);
  if (animCtrl == undefined){
    animCtrl = animCtrlDefault;
  }

  if(animCtrl.pattern == "default"){
    SetDefaultPosition(refCurrent, blockBasePos);
    return;
  }

  const animation = animationMap.get(animCtrl.pattern);
  if(animation != null){
    animation(refCurrent, animCtrl, blockBasePos, blockWidth, blockHeight, blockVolume);
  }
  else {
    console.warn("Pattern='" + animCtrl.pattern + "' is not registered.");

    AnimationFrameCtrl.delete(blockId);
    SetDefaultPosition(refCurrent, blockBasePos);
    return;
  }

  // アニメーション終了フレーム判定
    // 連動パターンへの切替
    // 稼働状態ステートの更新
  
  // アニメーションパターン分岐
    // フレーム値に応じたポジション・回転等の設定
      
  // フレーム終了処理
  animCtrl.frame++;
  AnimationFrameCtrl.set(blockId, animCtrl);
}

//const ANIM_MAX_FRAME = 20 * 60; // Max:20秒以内のアニメーション

//
// アニメーションフレーム管理用マップ
//
const AnimationFrameCtrl = new Map<number, BlockAnimState>
const animationMap = new Map<string, (refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, state:BlockAnimState, basePos:Vector3, blockWidth:number, blockHeight:number, blockVolume:number)=>void>();

//
// ブロックアニメーション定義
//
const animations: {name:string, anim:(refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, state:BlockAnimState, basePos:Vector3, blockWidth:number, blockHeight:number, blockVolume:number)=>void}[] = [
  {
    name: "default", anim: ()=>void{}
  },
  {
    name: "floating", anim: (refCurrent, state, basePos, blockHeight) => {
      refCurrent.position.x = basePos.x;
      refCurrent.position.y = basePos.y + Math.sin(state.frame / 60) * (blockHeight * 0.03);
      refCurrent.position.z = basePos.z;
    }
  }
]

// アニメーションセット
animations.map((anim) =>{
  animationMap.set(anim.name, anim.anim);
});

function SetDefaultPosition(refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, basePos:Vector3){
  refCurrent.position.set(basePos.x, basePos.y, basePos.z);
  refCurrent.rotation.set(0,0,0);
}

const animCtrlDefault = {
  status: AnimStatus.Idle,
  pattern: "default",
  frame: 0
};
