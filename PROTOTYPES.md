# 原型子目录约定

> 每个独立原型放仓库根目录下的一个子文件夹，名字用短横线分隔的小写英文。
> `menu-config.json` 里用 `/子目录名/` 作为 `previewUrl`，汇总页会自动渲染入口卡片。

---

## 📁 目录结构

```
zhongwenlu-yx/
├── index.html              ← 汇总页入口（不要改）
├── menu-config.json        ← ⭐ 唯一需要维护的配置文件
├── README.md               ← 快速使用说明
├── PROTOTYPES.md           ← 本文件：原型子目录约定
├── DEPLOY.md               ← 部署操作记录
│
├── kaodianguanli/          ← 考点管理 原型
│   └── index.html
│
├── req-xxx-yyy/            ← 未来新增的原型（按需建目录）
│   └── index.html
└── ...
```

---

## ➕ 新增原型的 3 步流程

### 1. 创建子目录

```bash
cd ~/Documents/my_project/zhongwenlu/zhongwenlu-yx
mkdir req-new-feature
# 把原型 index.html 放进去
cp ~/Desktop/my-prototype.html req-new-feature/index.html
```

### 2. 在 `menu-config.json` 注册

在对应月份 group 的 `items` 数组里加一项：

```json
{
  "id": "REQ-NEW-001",
  "title": "新需求标题",
  "subtitle": "一句话描述这个原型是做什么的",
  "version": "V0.1",
  "status": "in-progress",
  "tags": ["B端", "学校"],
  "previewUrl": "/req-new-feature/",
  "extras": [
    { "label": "主页面", "url": "/req-new-feature/" },
    { "label": "某个弹窗", "url": "/req-new-feature/#modal-xxx" }
  ],
  "branch": "feature/REQ-NEW-001",
  "updatedAt": "2026-09-28"
}
```

> **关键**：`previewUrl` 用**相对路径** `/子目录名/`，汇总页会用 `target="_blank"` 新窗口打开，部署后访问 `https://zhongwenlu-yx.vercel.app/req-new-feature/` 即可。

### 3. git push 自动部署

```bash
git add req-new-feature/ menu-config.json
git commit -m "feat: 新增 REQ-NEW-001 需求标题"
git push
```

推送后 1-2 分钟 Vercel 自动部署：
- 汇总页：刷新 `https://zhongwenlu-yx.vercel.app` 看新卡片
- 原型页：访问 `https://zhongwenlu-yx.vercel.app/req-new-feature/`

---

## 🔀 多个页面 / 视图

如果一个原型有多个页面（比如详情页、弹窗），可以：

**方案 A**：全部塞进一个 `index.html`，用 hash 路由切换视图（推荐）

```html
<!-- index.html 内部 -->
<a href="#view-detail">详情视图</a>
<a href="#view-edit">编辑视图</a>

<script>
  window.addEventListener('hashchange', () => {
    const v = location.hash.slice(1);
    // 切换显示对应视图
  });
</script>
```

汇总页 extras 用：`/req-new-feature/#view-detail`

**方案 B**：拆成多个 HTML（每个视图一个文件）

```
req-new-feature/
├── index.html       ← 主页面
├── detail.html      ← 详情视图
└── edit.html        ← 编辑视图
```

汇总页 extras 用：
```json
"extras": [
  { "label": "详情视图", "url": "/req-new-feature/detail.html" },
  { "label": "编辑视图", "url": "/req-new-feature/edit.html" }
]
```

---

## 📝 当前已注册的原型

| 子目录 | menu-config.json ID | 状态 |
|---|---|---|
| `kaodianguanli/` | `REQ-KAODIAN-GL` | 进行中（v0.3） |

---

## ⚠️ 注意事项

1. **子目录名要稳定**：一旦 push 部署，后续尽量不要改名（会破坏外部链接）
2. **每个子目录必须有 `index.html`**：否则访问 `/子目录名/` 会 404
3. **不要在原型里引用外部 CDN 之外的资源**：保持单文件可移植
4. **大文件用 Git LFS**（如果未来原型超过 5MB）

