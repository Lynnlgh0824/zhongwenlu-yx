# 中文路 · 产品原型总览

> **一句话**：产品经理改 `menu-config.json`，git push，1-2 分钟后页面自动更新。

---

## 📁 文件结构

```
prototype-overview/
├── index.html            ← 汇总页入口（不要改）
├── menu-config.json      ← ⭐ 产品经理维护的唯一文件
├── README.md             ← 本文件（说明）
└── .gitignore            ← git 忽略配置
```

---

## 🚀 第一次接入（一次性操作）

### 1. 在 GitHub 创建仓库

- 仓库名：`prototype-overview`（或你喜欢的名字）
- 权限：Private（不要公开）
- 不要勾选 README / .gitignore

### 2. 本地关联并推送

```bash
cd "/Users/yuzhoudeshengyin/Documents/New project/prototype-overview"

git init
git add .
git commit -m "init: 产品原型总览 v1.0"

git remote add origin https://github.com/你的用户名/prototype-overview.git
git branch -M main
git push -u origin main
```

### 3. 接 Vercel 自动部署

1. 打开 https://vercel.com → Import Project
2. 选 GitHub 仓库 `prototype-overview`
3. Framework Preset 选 `Other`
4. 点击 Deploy
5. 部署完会得到一个固定地址，例如：`https://zhongwenlu-yx.vercel.app`

### 4. 把地址加到 README

把 Vercel 分配的地址填到本文件最下方「📦 部署地址」一节。

---

## ✏️ 日常更新流程（产品经理）

### 场景 A：新增一个需求

1. 用 VSCode 打开 `menu-config.json`
2. 在对应月份 group 里加一项：
   ```json
   {
     "id": "REQ-005",
     "title": "新需求标题",
     "subtitle": "一句话描述这个需求是做什么的",
     "version": "V0.1",
     "status": "in-progress",
     "tags": ["B端", "学校"],
     "previewUrl": "http://localhost:4173/mockup-xxx.html",
     "branch": "explore/REQ-005-xxx",
     "updatedAt": "2026-09-25"
   }
   ```
3. 提交推送：
   ```bash
   git add menu-config.json
   git commit -m "feat: 新增 REQ-005 需求标题"
   git push
   ```
4. **1-2 分钟后 Vercel 自动部署，刷新页面就能看到**

### 场景 B：更新需求状态

比如某个需求从「开发中」→「已交付」：

```diff
-  "status": "in-progress",
+  "status": "delivered",
+  "deliveredAt": "2026-09-25",
```

其他字段（如 `version`、`updatedAt`）也一起更新。

### 场景 C：新增一个月

直接在 `groups` 数组里加一项：

```json
{
  "id": "2026-10",
  "title": "2026 年 10 月",
  "subtitle": "下月规划",
  "expanded": false,
  "color": "blue",
  "items": []
}
```

---

## 🎯 status 取值

| 取值 | 含义 | 视觉 |
|---|---|---|
| `designing` | 需求设计中（未做原型） | 灰色 |
| `in-progress` | 开发中（原型持续迭代）| 蓝色 |
| `review` | 评审中（待技术评审/产品评审）| 黄色 |
| `delivered` | 已交付开发 | 绿色 ✓ |
| `archived` | 已归档（被替代/下线）| 灰色 |

---

## 🔗 原型地址写法

`previewUrl` 字段填什么地址都行，常用几种：

| 场景 | 地址格式 |
|---|---|
| 本地预览（你自己看） | `http://a.localhost:4173/mockup-xxx.html` |
| Vercel 部署的子项目 | `https://xxx.vercel.app/xxx.html` |
| GitHub Pages | `https://用户名.github.io/仓库名/xxx.html` |
| 临时路径 | 相对路径 `mockup-xxx.html` |
| 还没做 | 填 `#` 或留空（卡片显示「原型未上传」）|

---

## 🎨 tags 取值

`tags` 数组里填标签 ID，需要先在 `tags` 配置区定义。常用标签：

- **端**：`B端` / `C端`
- **场景**：`学校` / `会员` / `DSE`
- **能力**：`AI整理` / `拖拽`
- **业务**：`续费` / `财务` / `订单`

新增标签：在 `tags` 数组加一个 `{ id, color }`，color 可选 blue/pink/purple/cyan/amber/orange/indigo/green/gray。

---

## 📦 部署地址

- **线上地址**：https://zhongwenlu-yx.vercel.app
- **GitHub 仓库**：https://github.com/Lynnlgh0824/zhongwenlu-yx

---

## ⚠️ 常见问题

**Q1：改了 JSON 但页面没更新？**
- 强制刷新浏览器：Cmd + Shift + R (Mac) / Ctrl + Shift + R (Win)
- 看 Vercel 是否部署成功（Vercel Dashboard → Deployments）
- 看 git push 是否成功

**Q2：JSON 写错了页面打不开？**
- 浏览器 Console 会报错，指出第几行
- VSCode 会自动提示 JSON 语法错误
- 实在搞不定，git 回滚：`git checkout menu-config.json`

**Q3：怎么给某个需求加 PRD 链接？**
- 把 PRD 文件放到仓库里（如 `requirements/REQ-001/PRD.md`）
- 在 `prdUrl` 字段填 `requirements/REQ-001/PRD.md`

**Q4：怎么加多个原型链接（一个需求多个页面）？**
- 主入口放 `previewUrl`
- 额外链接放 `extras` 数组：
  ```json
  "extras": [
    { "label": "导入弹窗", "url": "..." },
    { "label": "AI 分类", "url": "..." }
  ]
  ```

---

## 🗓️ 版本历史

- **v1.0** (2026-09-24) · 初始化版本
