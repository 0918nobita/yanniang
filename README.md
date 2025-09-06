# 言娘

yánniang

小規模言語交流グループのための共同言語学習アプリ<br>面向语言交流小组的协作语言学习应用

- Axum (Rust)
- React Router (TypeScript)

## 环境配置

启动前，请在 `frontend` 目录下创建一个 `.env.vars` 文件来配置环境变量：

```text
BACKEND_HOST = "localhost:8000"
```

## 启动前端的开发服务

```bash
cd frontend
bun install
bun run dev
```

## 启动后端

```bash
cd backend
shuttle run
```
