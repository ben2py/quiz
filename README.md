# 📝 MCQ Quiz

一个基于 Markdown 的选择题刷题工具，支持 AI 辅导和错题分析。

## 功能

- **Markdown 题库** — 拖拽 `.md` 文件即可开始做题，支持多种格式自动解析
- **在线题库** — 部署后直接从仓库加载题目，无需手动上传
- **做题进度保存** — 未完成的测试下次打开自动恢复
- **题目收藏** — 标记重点题目，导出为新的 `.md` 文件
- **错题导出** — 一键导出错题记录
- **🤖 AI 辅导** — 答错后与 AI 对话，针对性讲解
- **🤖 AI 错题分析** — 分析错题模式，找出薄弱知识点
- **深色/浅色主题** — 一键切换
- **移动端适配** — 支持手势滑动切换题目

## 快速开始

### 纯前端（不需要 AI 功能）

直接用浏览器打开 `index.html`，或部署到 GitHub Pages：

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

然后去 repo 的 **Settings → Pages → Source** 选 `main` 分支，目录选 `/ (root)`。

访问地址：`https://你的用户名.github.io/仓库名/`

### 启用 AI 功能

AI 功能需要一个轻量 Node.js 后端来代理 API 调用：

```bash
cd server
cp .env.example .env
# 编辑 .env 填入你的 API Key
npm install
npm start
```

服务启动后，前端会自动连接 `http://localhost:3001`。

## AI 服务配置

编辑 `server/.env`，支持任何兼容 OpenAI 格式的 API：

```env
API_KEY=你的key
API_BASE=https://api.deepseek.com/v1
MODEL=deepseek-chat
```

### 常用服务商配置

| 服务 | API_BASE | MODEL | 注册地址 |
|------|----------|-------|---------|
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` | platform.deepseek.com |
| Kimi (Moonshot) | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` | platform.moonshot.cn |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-turbo` | dashscope.aliyun.com |
| 智谱GLM | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-flash` | open.bigmodel.cn |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` | platform.openai.com |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.1-8b-instant` | console.groq.com |
| Ollama (本地) | `http://localhost:11434/v1` | `llama3` | ollama.com |

## 题库格式

题目使用 Markdown 编写，基本格式：

```markdown
# 题库标题

**Q1.** 这是题目内容？

- A) 选项一
- B) 选项二
- C) 选项三
- D) 选项四

<details>
<summary>Answer</summary>

**B.** 这里是解析内容。

</details>
```

解析器兼容多种变体写法，包括：
- 题号：`**Q1.**` / `Q1.` / `Q1)` / `Question 1:` 等
- 选项：`- A)` / `A)` / `- (A)` / `a)` 等，大小写均可
- 答案：`**A.**` / `Answer: A` / `答案：A` 等

### 添加题库

1. 把 `.md` 文件放入 `questions/` 目录
2. 在 `questions/index.json` 中添加文件名：

```json
[
  "你的题库.md",
  "另一个题库.md"
]
```

部署后首页会自动显示题库列表。

## 项目结构

```
├── index.html          # 主页面
├── app.js              # 核心逻辑（做题、计分、进度）
├── parser.js           # Markdown 题目解析器
├── ai.js               # AI 辅导 & 分析（前端）
├── style.css           # 样式
├── questions/           # 题库目录
│   ├── index.json       # 题库清单
│   └── *.md             # 题目文件
└── server/              # AI 后端
    ├── index.js         # Express 代理服务
    ├── .env.example     # 配置模板
    └── package.json
```

## License

MIT
