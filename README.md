# medjeworks Numberplace application

Reactベースのナンプレアプリです。

![Screenshot of a medje-numberplace.](screenshots/MainVisual.png)

## 導入

※Node.js インストール済みの環境を前提としています

### React＋Vite インストール
```
$ npm i -g pnpm
$ pnpm create vite medje-numberplace --template react-ts-swc

$ cd medje-numberplace
$ pnpm install
```

### (Ⅰ)React-Recoilのインストール
```
$ pnpm install recoil
```

### (Ⅱ)R3F(React―three-fiber)&Drei インストール
```
$ pnpm install three @types/three @react-three/fiber @react-three/drei three-stdlib camera-controls
```

※コピペ用：(Ⅰ)～(Ⅱ)までまとめてインストールするコマンド
```
$ pnpm install recoil three @types/three @react-three/fiber @react-three/drei three-stdlib camera-controls
```

## ローカル実行
```
$ pnpm run dev
```

## デプロイ
T.B.D
