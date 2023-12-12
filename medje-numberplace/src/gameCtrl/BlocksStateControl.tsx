import { DefaultValue, RecoilState, atom, selector, useRecoilState, useRecoilValue } from "recoil"

// 盤面ブロック選択状態制御用ステート・セレクタ
export type BoardSelectState = {
  selected: boolean;
  id:  number;
}

export const BoardBlockSelectState = atom({
  key: 'boardBlockSelectState',
  default: {selected: false, id:0} as BoardSelectState,
});

export const BoardBlockSelecter = selector({
  key: 'boardBlockSelecter',
  get: ({get}):BoardSelectState => {
    return get(BoardBlockSelectState);
  },
  set: ({get,set}, newVal) => {
    if(newVal instanceof DefaultValue) {
      set(
        BoardBlockSelectState, 
        newVal
      );
    }
    else {
      var oldVal = get(BoardBlockSelectState);
      var setVal:BoardSelectState = newVal;
      if(oldVal.id == newVal.id){
        setVal.selected = !oldVal.selected;
      }
      else{
        setVal.selected = true;
        setVal.id = newVal.id;
      }

      set(
        BoardBlockSelectState, 
        setVal
      );
    }
  },
});

// 手駒用動作モード定義
export const enum ActMode {
  None = 0,
  NumSet,
  Memo
}

// 手駒用ブロック選択状態制御用ステート・セレクタ
export type SelectHandpiece = {
  blockNum:  number;
  actMode: ActMode;
  destId: number;
}

export const HandPieceActMode = atom({
  key: 'handpieceActMode',
  default: ActMode.NumSet
});

export const HandPieceLastDest = atom({
  key: 'handpieceLastDest',
  default: -1
});

export const HandPieceLastNum = atom({
  key: 'handpieceLastNum',
  default: 0
});

export const HandPieceSetter = atom({
  key: 'handpieceSetter',
  default: {
    blockNum: 0,
    actMode: ActMode.None,
    destId: -1
  } as SelectHandpiece
});

export const HandpieceSelecter = selector({
  key: 'handpieceSelecter',
  get: ({get}):SelectHandpiece => {
    const getVal:SelectHandpiece = {
      blockNum:get(HandPieceLastNum),
      actMode:get(HandPieceActMode),
      destId:get(HandPieceLastDest),
    };

    return getVal;
  },
  set: ({set}, setVal) => {
    set(HandPieceSetter, setVal);
    if(!(setVal instanceof DefaultValue)){

    }
  }
});

// 盤面ブロック用ナンバー設定ステート群
export const BoardBlockNumbers:Array<RecoilState<number>> = [];
  for (let i = 0; i < 81; i++){
  BoardBlockNumbers.push(atom({
      key: 'handpieceActMode_' + i,
      default: 0,
      effects: [
        ({ onSet }) => {
          onSet: (newValue:number, oldValue:number) => {
            console.log(oldValue + "から" + newValue + "に更新しました。");
          };
        },
      ],
    })
  );
}

// 盤面にナンバーがセットされた際の更新処理
type BoardBlockSetterProp = {
  callBack: (hpInfo:SelectHandpiece) => void;
}
export const BoardBlockSetter:React.FC<BoardBlockSetterProp> = (props) =>{
  const [setState] = useRecoilState(HandPieceSetter);

  if(setState.actMode != ActMode.None){
    props.callBack(setState)
  }

  return <>
  </>;
}

// デバッグ用ステートログ出力
export const BlockStateControlLog: React.FC = () => {

  const settedVal = useRecoilValue(BoardBlockSelecter);
  console.debug("BlockSelecter state Changed:" + " selected=" + settedVal.selected + " id=" + settedVal.id);

  return<>
  </>
}

// デバッグ用手駒用ブロック操作ログ出力
export const HandpieceActLog = () => {

  const settedVal = useRecoilValue(HandPieceSetter);
  console.debug("Handpiece act:" + 
                " BlockNum=" + settedVal.blockNum + 
                " Mode=" + settedVal.actMode + 
                " Mode=" + settedVal.destId
  );
}