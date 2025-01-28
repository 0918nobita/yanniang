# 言娘

yánniang

小規模言語交流グループのための共同言語学習アプリ<br>面向语言交流小组的协作语言学习应用

- Axum (Rust)
- React Router v7 (TypeScript)

## 启动前端的开发服务

```bash
cd frontend
bun install
bun run dev
```

## 启动后端

```bash
cd backend
RUST_LOG=trace RUST_BACKTRACE=1 shuttle run
```
