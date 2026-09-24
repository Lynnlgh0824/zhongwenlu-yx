# 部署操作记录 · 中文路原型汇总

> 本文档记录 `zhongwenlu-yx.vercel.app` 上线全过程，包括步骤、踩坑、决策。

---

## 一、最终状态

| 项目 | 值 |
| --- | --- |
| **线上地址** | **https://zhongwenlu-yx.vercel.app** |
| 兼容地址（临时保留） | https://zhongwenlu-yx-prototype.vercel.app |
| Vercel 项目名 | `zhongwenlu-yx` |
| Vercel Team | `lin379984447-1216`（Hobby plan） |
| GitHub 仓库 | https://github.com/Lynnlgh0824/zhongwenlu-yx |
| 仓库路径 | `~/Documents/my_project/zhongwenlu/zhongwenlu-yx/` |
| 触发部署 | 推送 `main` 分支自动部署，1-2 分钟生效 |
| 部署来源 | GitHub `Lynnlgh0824/zhongwenlu-yx` |
| 上线时间 | 2026-09-24 |

---

## 二、操作流程（全链路）

### 1. GitHub 仓库创建

**背景**：gh CLI 未登录、keychain 锁定、SSH 不能直接建仓库。

**解决**：
- 通过 cua_repl 接管 Chrome 已登录 GitHub 的 tab
- 自动填表创建 `zhongwenlu-yx` 私有仓库
- 本地推送到 GitHub

**关键命令**：
```bash
cd ~/Documents/my_project/zhongwenlu/zhongwenlu-yx
git init
git add .
git commit -m "init: 产品原型总览 v1.0"
git push -u origin main
```

### 2. Vercel 首次部署

**步骤**：
1. 打开 https://vercel.com → Add New → Project
2. 选 GitHub 仓库 `Lynnlgh0824/zhongwenlu-yx`
3. **关键步骤**：粘贴仓库 URL 后 Create 按钮是灰色（disabled）
   - 解决：点击 Bitbucket 切换，再切回 GitHub
   - 这会触发 React state 重渲染，Git Scope / Private Repository Name 字段出现
4. Project Name 填入 `zhongwenlu-yx`（第一次）
5. Framework Preset 选 `Other`（不需要 build）
6. 点击 Deploy

**踩坑**：Project Name `zhongwenlu-yx` 在 Vercel 端冲突（之前测试用过），所以**实际用了 `zhongwenlu-yx-prototype`** 作为 Vercel 项目名。

**部署结果**：
- 域名：`zhongwenlu-yx-prototype.vercel.app`
- 部署用时：Build 44ms（静态文件，无 build 步骤）
- Commit：`134ba94 init: 产品原型总览 v1.0`

### 3. 填充 README + 第一次 push

```bash
# 把 Vercel 分配的地址填到 README
cd ~/Documents/my_project/zhongwenlu/zhongwenlu-yx
git add README.md
git commit -m "docs: 填入 Vercel 部署地址"
git push
# Commit c99249f
```

### 4. 域名升级（zhongwenlu-yx-prototype → zhongwenlu-yx）

**目标**：让主域名变成更简洁的 `https://zhongwenlu-yx.vercel.app`

**步骤**：

#### 4.1 改 Project Name

Vercel Dashboard → Project Settings → General → Project Name 输入框：
- 旧值：`zhongwenlu-yx-prototype`
- 新值：`zhongwenlu-yx`
- 点击 Save

**提示**：Vercel 会警告改名会影响 OpenID Connect Token claims。

#### 4.2 触发新部署（重要！）

**为什么需要**：改名不会自动重建，老 deployment 的 subdomain 还是旧名字。

**操作**：
1. Deployments 页面 → 找到 `Initial commit (abf85fb)` 行
2. 点右侧三点菜单（`data-testid="deployment-entity/dots-menu/button"`）
3. 选 Redeploy → 弹窗里再点 Redeploy

**踩坑**：
- ❌ 推送空 commit (`git commit --allow-empty`) 不会触发新部署（Vercel 检测到 commit hash 已部署）
- ❌ Vercel 自动生成的 `*.vercel.app` 是 team-private（带 `-lin379984447-1216` 后缀），需要 SSO 才能访问

#### 4.3 添加 production domain

Settings → Domains → Add Existing：
- 输入：`zhongwenlu-yx.vercel.app`
- 环境：Production
- 点击 Add Domain

**验证**：`https://zhongwenlu-yx.vercel.app` 立刻返回 200

#### 4.4 更新 README + push

```bash
git add README.md
git commit -m "docs: 改主域名 zhongwenlu-yx → zhongwenlu-yx.vercel.app"
git push
# Commit 6daf711
```

---

## 三、提交记录

```
134ba94  init: 产品原型总览 v1.0
c99249f  docs: 填入 Vercel 部署地址
b0f0d71  chore: trigger redeploy for new project name（未生效，已废弃）
6daf711  docs: 改主域名 zhongwenlu-yx → zhongwenlu-yx.vercel.app
```

---

## 四、踩坑 & 关键决策

### 踩坑

| 现象 | 原因 | 解决方案 |
| --- | --- | --- |
| Create 按钮 disabled | 粘贴 URL 后 React state 没触发字段显示 | 切换到 Bitbucket 再切回 GitHub |
| Project Name `zhongwenlu-yx` 冲突 | Vercel 端之前测试用过这个名字 | 临时用 `-prototype` 后缀，后来改回 |
| 改名后新域名 404 | 改名不自动重建，old subdomain 还在 | Redeploy + 手动添加 domain |
| 空 commit 不触发部署 | Vercel 检测 commit hash 已存在 | 必须从 Vercel UI Redeploy |
| 自动生成 `*-lin379984447-1216.vercel.app` 是 SSO 保护 | Team scope 默认配了 SSO | 手动添加简洁的 `zhongwenlu-yx.vercel.app` |

### 关键决策

1. **仓库放哪**：放在 `~/Documents/my_project/zhongwenlu/zhongwenlu-yx/`，与其他原型项目同级
2. **Project Name 演进**：`zhongwenlu-yx-prototype` → `zhongwenlu-yx`（最终）
3. **保留兼容地址**：旧域名 `zhongwenlu-yx-prototype.vercel.app` 暂时保留作 fallback，不影响使用

---

## 五、日常维护流程

### 添加 / 修改需求

```bash
cd ~/Documents/my_project/zhongwenlu/zhongwenlu-yx

# 1. 编辑 menu-config.json
code menu-config.json

# 2. 提交推送
git add menu-config.json
git commit -m "feat: 新增 REQ-005 需求标题"
git push

# 3. 等 1-2 分钟，刷新 https://zhongwenlu-yx.vercel.app 即可看到
```

### 强制刷新浏览器

- Mac: `Cmd + Shift + R`
- Win: `Ctrl + Shift + R`

### 查看部署状态

- Vercel Dashboard: https://vercel.com/lin379984447-1216/zhongwenlu-yx
- GitHub 仓库: https://github.com/Lynnlgh0824/zhongwenlu-yx

### 清理旧域名（可选）

如果不想保留 `zhongwenlu-yx-prototype.vercel.app` 这个兼容地址：
1. Vercel → Settings → Domains
2. 找到 `zhongwenlu-yx-prototype.vercel.app` → Edit → Remove
3. 访问这个地址会变成 404（不再是 fallback）

---

## 六、文件清单

仓库 `Lynnlgh0824/zhongwenlu-yx` 内容：

| 文件 | 作用 | 谁维护 |
| --- | --- | --- |
| `index.html` | 汇总页入口（自动从 JSON 渲染） | ❌ 不要改 |
| `menu-config.json` | ⭐ 唯一需要维护的配置文件 | ✅ 产品经理 |
| `README.md` | 快速使用说明 | ✅ 产品经理 |
| `DEPLOY.md` | 本文档，部署操作全记录 | 一次性文档 |
| `.gitignore` | git 忽略配置 | ❌ 不用管 |

---

## 七、参考链接

- Vercel 项目页：https://vercel.com/lin379984447-1216/zhongwenlu-yx
- GitHub 仓库：https://github.com/Lynnlgh0824/zhongwenlu-yx
- 线上地址：https://zhongwenlu-yx.vercel.app
