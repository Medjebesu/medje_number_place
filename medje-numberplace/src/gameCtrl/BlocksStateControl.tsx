import { DefaultValue, atom, selector, useRecoilValue } from "recoil"

export type SelectState = {
  selected: boolean;
  id:  number;
}

// ブロック選択状態群制御用ステート・セレクタ
export const BlockSelectState = atom({
  key: 'blockSelectState',
  default: {selected: false, id:0} as SelectState,
});

export const BlockSelecter = selector({
  key: 'blockSelecter',
  get: ({get}):SelectState => {
    return get(BlockSelectState);
  },
  set: ({get,set}, newVal) => {
    if(newVal instanceof DefaultValue) {
      set(
        BlockSelectState, 
        newVal
      );
    }
    else {
      var oldVal = get(BlockSelectState);
      var setVal:SelectState = newVal;
      if(oldVal.id == newVal.id){
        setVal.selected = !oldVal.selected;
      }
      else{
        setVal.selected = true;
        setVal.id = newVal.id;
      }

      set(
        BlockSelectState, 
        setVal
      );
    }
  },
});

// デバッグ用ステートログ出力
export const BlockStateControlLog: React.FC = () => {

  const settedVal = useRecoilValue(BlockSelecter);
  console.debug("BlockSelecter state Changed:" + " selected=" + settedVal.selected + " id=" + settedVal.id);

  return<>
  </>
}