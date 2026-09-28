# 原型目录约定

> 所有原型文件统一放在**中文月度文件夹**下，例如 `2026.09/考点管理/`。
> `menu-config.json` 里用 `/<年月>/<原型名>/` 作为 `previewUrl`，汇总页会自动渲染入口卡片。

---

## 📁 目录结构

```
zhongwenlu-yx/
├── index.html              ← 汇总页入口（不要改）
├── menu-config.json        ← ⭐ 唯一需要维护的配置文件
├── README.md               ← 快速使用说明
├── PROTOTYPES.md           ← 本文件：原型目录约定
├── DEPLOY.md               ← 部署操作记录
│
├── 2026.09/                ← 月度文件夹（按年月组织）
│   └── 考点管理/            ← 考点管理 原型源文件
│       ├── index.html      ← 入口 HTML
│       ├── 考点管理-需求文档.md
│       └── gangao-tiku.html
│
├── 2026.10/                ← 下月新增原型时建对应文件夹
│   └── 某需求/
│       └── index.html
│
└── ...
```

---

## ➕ 新增原型的 3 步流程

### 1. 创建文件夹

```bash
cd ~/Documents/my_project/zhongwenlu/zhongwenlu-yx

# 例如：在 2026.10 文件夹下新建「黄金会员续费」原型
mkdir -p 2026.10/黄金会员续费

# 把原型 HTML 放进去
cp ~/Desktop/my-prototype.html 2026.10/黄金会员续费/index.html

# （可选）放需求文档、截图等
cp ~/Desktop/PRD.md 2026.10/黄金会员续费/
```

### 2. 在 `menu-config.json` 注册

在对应月份 group 的 `items` 数组里加一项：

```json
{
  "id": "REQ-VIP-002",
  "title": "新需求标题",
  "subtitle": "一句话描述",
  "version": "V0.1",
  "status": "in-progress",
  "tags": ["C端", "会员"],
  "previewUrl": "/2026.10/黄金会员续费/",
  "extras": [
    { "label": "主页面", "url": "/2026.10/黄金会员续费/" },
    { "label": "某个弹窗", "url": "/2026.10/黄金会员续费/#modal-xxx" }
  ],
  "branch": "feature/REQ-VIP-002",
  "updatedAt": "2026-09-28"
}
```

> **关键**：`previewUrl` 用**相对路径** `/<年月>/<原型名>/`，部署后访问 `https://zhongwenlu-yx.vercel.app/2026.10/黄金会员续费/` 即可。
> Vercel / Cloudflare Pages 都支持中文路径，无需额外转义。

### 3. git push 自动部署

```bash
git add 2026.10/ menu-config.json
git commit -m "feat: 新增 REQ-VIP-002 黄金会员续费 V0.1"
git push
```

推送后 1-2 分钟自动部署：
- 汇总页：刷新 `https://zhongwenlu-yx.vercel.app` 看新卡片
- 原型页：访问 `https://zhongwenlu-yx.vercel.app/2026.10/黄金会员续费/`

---

## 🔀 多个页面 / 视图

如果一个原型有多个视图（详情页、弹窗等），可以：

**方案 A**：全部塞进一个 `index.html`，用 hash 路由切换视图（推荐）

```html
<!-- index.html 内部 -->
<a href="#view-detail">详情视图</a>
<a href="#view-edit">编辑视图</a>
```

汇总页 extras 用：`/2026.09/考点管理/#view-detail`

**方案 B**：拆成多个 HTML（每个视图一个文件）

```
2026.09/考点管理/
├── index.html       ← 主页面
├── detail.html      ← 详情视图
└── edit.html        ← 编辑视图
```

---

## 📝 当前已注册的原型

| 月份 | 原型文件夹 | menu-config.json ID | 状态 |
|---|---|---|---|
| 2026-09 | `2026.09/考点管理/` | `REQ-KAODIAN-GL` | 进行中（v0.3） |

---

## ⚠️ 注意事项

1. **文件夹名要稳定**：一旦 push 部署，后续尽量不要改名（会破坏外部链接）
2. **每个原型文件夹必须有 `index.html`**：否则访问 `/<年月>/<原型名>/` 会 404
3. **中文路径已验证可用**：Vercel / Cloudflare Pages 都支持，无需 URL 转义
4. **大文件用 Git LFS**（如果未来原型超过 5MB）

