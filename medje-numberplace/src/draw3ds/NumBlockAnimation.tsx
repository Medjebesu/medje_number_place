import THREE, { Vector3 } from "three"

//
// ブロックアニメーション制御用ステート
//
export const enum AnimStatus {
  Idle = 0,
  InProgress,
  //Cancel
}

export type BlockAnimState = {
  status: AnimStatus;
  pattern: string;
  frame: number;
  endFrame?: number;
}

// ブロックアニメーション設定関数
export function SetBoardBlockPattern(blockId: number, animPattern: string) {

  let animCtrl = AnimationFrameCtrl.get(blockId);
  if (animCtrl == undefined) {
    animCtrl = {
      status: AnimStatus.Idle,
      pattern: animPattern,
      frame: 0,
    } as BlockAnimState
  }
  else {
    animCtrl = {
      status: animCtrl?.status,
      pattern: animPattern,
      frame: animCtrl.pattern == animPattern ? animCtrl.frame : 0,
    } as BlockAnimState
  }

  AnimationFrameCtrl.set(blockId, animCtrl);
}

export function SetBoardClusterPattern(arrblockId: number[], animPattern: string) {

  arrblockId.forEach(blockId => {
    let animCtrl = AnimationFrameCtrl.get(blockId);
    if (animCtrl == undefined) {
      animCtrl = {
        status: AnimStatus.Idle,
        pattern: animPattern,
        frame: 0,
      } as BlockAnimState
    }
    else {
      animCtrl = {
        status: animCtrl?.status,
        pattern: animPattern,
        frame: animCtrl.pattern == animPattern ? animCtrl.frame : 0,
      } as BlockAnimState
    }

    AnimationFrameCtrl.set(blockId, animCtrl);
  });
}

// 盤面ブロックアニメーション制御
export function BoardBlockAnimation(
  refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>,
  //state: BlockAnimState,
  //stateSetter:SetterOrUpdater<BlockAnimState>,
  blockId: number,
  blockBasePos: Vector3,
  blockWidth: number,
  blockHeight: number,
  blockVolume: number,
) {

  let animCtrl = AnimationFrameCtrl.get(blockId);
  if (animCtrl == undefined) {
    animCtrl = animCtrlDefault;
  }

  if (animCtrl.pattern == "default") {
    SetDefaultPosition(refCurrent, blockBasePos);
    return;
  }

  const animation = animationMap.get(animCtrl.pattern);
  let nextPattern: string | null = null;
  if (animation != null) {
    nextPattern = animation(refCurrent, animCtrl, blockBasePos, blockWidth, blockHeight, blockVolume);
  }
  else {
    console.warn("Pattern='" + animCtrl.pattern + "' is not registered.");

    AnimationFrameCtrl.delete(blockId);
    SetDefaultPosition(refCurrent, blockBasePos);
    return;
  }

  // フレーム終了処理
  if (nextPattern == null) {
    animCtrl.frame++;
    AnimationFrameCtrl.set(blockId, animCtrl);
  }
  else {
    SetBoardBlockPattern(blockId, nextPattern);
  }
}

//const ANIM_MAX_FRAME = 20 * 60; // Max:20秒以内のアニメーション

//
// アニメーションフレーム管理用マップ
//
const AnimationFrameCtrl = new Map<number, BlockAnimState>
const animationMap = new Map<string, (refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, state: BlockAnimState, basePos: Vector3, blockWidth: number, blockHeight: number, blockVolume: number) => string | null>();

//
// ブロックアニメーション定義
//
const animations: { name: string, anim: (refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, state: BlockAnimState, basePos: Vector3, blockWidth: number, blockHeight: number, blockVolume: number) => string | null }[] = [
  {
    name: "default", anim: () => {
      return null;
    }
  },
  {
    name: "floating", anim: (refCurrent, state, basePos, blockHeight) => {
      refCurrent.position.x = basePos.x;
      refCurrent.position.y = basePos.y + Math.sin(state.frame / 60) * (blockHeight * 0.03);
      refCurrent.position.z = basePos.z;
      refCurrent.rotation.z = (Math.sin(state.frame / 45) / 32);
      return null;
    }
  },
  {
    name: "swinging", anim: (refCurrent, state, basePos) => {
      if (state.frame < 18) {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.position.z = basePos.z + state.frame * 0.02;
        refCurrent.rotation.z = 0;
        return null;
      }
      else if (state.frame < 30) {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.rotation.z = Math.sin(state.frame) / 12;
        return null;
      }
      else if (state.frame < 48) {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.position.z = refCurrent.position.z - 0.02;
        refCurrent.rotation.z = 0;
        return null;
      }
      // 終了フレーム処理
      else {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.position.z = basePos.z;
        refCurrent.rotation.z = 0;
        return "default";
      }
    }
  },
  {
    name: "turning", anim: (refCurrent, state, basePos) => {
      if (state.frame < 18) {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.position.z = basePos.z + state.frame * 0.02;
        refCurrent.rotation.z = 0;
        return null;
      }
      else if (state.frame < 42) {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.rotation.z = Math.sin(state.frame - 18) / 12;
        return null;
      }
      else if (state.frame < 60) {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.position.z = refCurrent.position.z - 0.02;
        refCurrent.rotation.z = 0;
        return null;
      }
      // 終了フレーム処理
      else {
        refCurrent.position.x = basePos.x;
        refCurrent.position.y = basePos.y;
        refCurrent.position.z = basePos.z;
        refCurrent.rotation.z = 0;
        return "default";
      }
    }
  }
]

// アニメーションのセット
animations.map((anim) => {
  animationMap.set(anim.name, anim.anim);
});

// アニメーション原点(オブジェクトのベース座標)に設定
function SetDefaultPosition(refCurrent: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, basePos: Vector3) {
  refCurrent.position.set(basePos.x, basePos.y, basePos.z);
  refCurrent.rotation.set(0, 0, 0);
}

// アニメーションのデフォルト状態定義
const animCtrlDefault = {
  status: AnimStatus.Idle,
  pattern: "default",
  frame: 0
};
