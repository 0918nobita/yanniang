# 言娘

yánniang

小規模言語交流グループのための共同言語学習アプリ

Cloudflare Pages にデプロイすることを想定して開発しています。

## 依存パッケージのインストール

```bash
bun install
```

## `wrangler.toml` について

`wrangler.toml.example` を参考に作成してください。

## 型定義の生成

```bash
bun run typegen
```

## 開発用サーバの起動

```bash
bun run dev
```

## ビルド

```bash
bun run build
```

## Lint

```bash
bun run lint
```

## フォーマット

```bash
bun run format
```

## デプロイ

```bash
bun run build
bun run deploy
```
