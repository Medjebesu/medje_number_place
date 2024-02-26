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

### (Ⅲ)MaterialUI・MaterialIcon・Robotoフォントのインストール
```
$ pnpm add @mui/material @mui/icons-material @emotion/react @emotion/styled
$ pnpm add @fontsource/roboto
```

※コピペ用：(Ⅰ)～(Ⅲ)までまとめてインストールするコマンド
```
$ pnpm add recoil three @types/three @react-three/fiber @react-three/drei three-stdlib camera-controls @mui/material @mui/icons-material @emotion/react @emotion/styled @fontsource/roboto
```

### フォントファイルの配置
「./medje-numberplace/fonts/」下に[Roboto](https://fonts.google.com/specimen/Roboto)フォントファイルを配置

## ローカル実行
```
$ pnpm run dev
```

## デプロイ
T.B.D


## スペシャルサンクス
[効果音ラボ https://soundeffect-lab.info/](https://soundeffect-lab.info/)