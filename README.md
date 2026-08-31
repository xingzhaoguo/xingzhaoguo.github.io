# Academic Homepage Theme

这是一个面向高校教师、科研人员和研究团队的轻量个人学术主页主题，已经按照 `xingzhaoguo.github.io` 用户站点配置。它不依赖前端框架、数据库或第三方 CDN；GitHub Pages 会直接发布仓库中的静态文件。

## 已包含的页面

- 首页：个人资料、Biography、研究方向、代表项目、代表论文、近期动态
- `Research`：五个主要研究方向
- `Publications`：按年份倒序排列论文
- `Projects`：项目卡片和三个独立项目详情页
- `Teaching`：教学理念、课程、资源与学生机会
- `Team`：研究生、本科生和合作人员
- `News`：学术动态归档
- `CV`：学术履历和 PDF CV 下载入口
- `Contact`：邮箱、单位和学术平台链接
- 自定义 `404` 页面、站点地图和社交分享图片

主导航保持为：`Home | Research | Publications | Projects | Teaching | News | Contact`。`Team` 和 `CV` 可从页脚进入。

## 文件结构

```text
.
├── index.html
├── research/                 # 各栏目页面
├── publications/
├── projects/                 # 项目列表与独立详情页
├── teaching/
├── team/
├── news/
├── cv/
├── contact/
├── assets/
│   ├── css/main.css          # 全站视觉规范和响应式样式
│   ├── js/site.js            # 导航、页脚和数据渲染
│   ├── data/                 # 可维护内容数据
│   ├── images/
│   │   ├── profile/
│   │   └── projects/
│   └── files/                # 放置 cv.pdf
├── scripts/validate-site.mjs # 本地完整性检查
├── .nojekyll                 # 让 GitHub Pages 原样发布静态文件
└── _config.yml               # 站点基础元数据
```

## 修改个人信息

编辑 [`assets/data/profile.json`](assets/data/profile.json)：

- `name`：姓名
- `title`：职称
- `department`：院系
- `institution`：单位
- `location`：所在地
- `tagline`：一句话研究简介
- `biography`：简短个人学术简介
- `email`：邮箱
- `links`：Google Scholar、ORCID 和 GitHub 地址
- `research_interests`：首页研究方向标签

同时建议把各 HTML 文件中的 `<title>`、`description` 和 Open Graph 文案从占位内容改为真实信息；站点主元数据在 [`_config.yml`](_config.yml) 中。

## 更换照片

1. 把照片放入 `assets/images/profile/`，推荐使用压缩后的 WebP 或 JPG，竖向比例约 `4:5`。
2. 在 `assets/data/profile.json` 中把 `photo` 改为相应路径，例如：

```json
"photo": "assets/images/profile/your-name.webp"
```

建议图片宽度为 800–1200 px，文件尽量控制在 500 KB 以内。

## 修改研究方向

- 首页的简短研究方向：编辑 `assets/data/profile.json` 中的 `research_interests`。
- Research 页的完整介绍：编辑 [`assets/data/research.json`](assets/data/research.json)。每一项包含标题、摘要、核心问题和方法标签。

## 添加或修改论文

编辑 [`assets/data/publications.json`](assets/data/publications.json)。每篇论文的格式如下：

```json
{
  "title": "Paper title",
  "authors": "Author A, Your Name, and Author B",
  "venue": "Journal or Conference",
  "year": 2026,
  "type": "Journal Article",
  "selected": true,
  "pdf": "assets/files/paper-name.pdf",
  "doi": "https://doi.org/..."
}
```

- `selected: true` 的论文会出现在首页。
- Publications 页面会自动按 `year` 从新到旧排序。
- 没有 PDF 时把 `pdf` 留空，页面会显示不可点击的 PDF 占位标签，不会产生坏链接。

## 添加或修改项目

项目内容统一存放在 [`assets/data/projects.json`](assets/data/projects.json)。项目图片放在 `assets/images/projects/`。

新增项目时：

1. 在 `projects.json` 中增加一条记录，并设置唯一的 `id`。
2. 复制任一现有项目详情目录，例如 `projects/adaptive-rehabilitation-robot/`。
3. 将新目录改为 `projects/<id>/`，并把其中 `<body>` 的 `data-project-id` 改为相同的 `id`。
4. 修改详情页的 `<title>`、description 和 Open Graph 信息。

页面正文会自动读取 `overview`、`challenge`、`approach` 和 `outcomes`。`featured: true` 的前三个项目会显示在首页。

## 修改新闻

编辑 [`assets/data/news.json`](assets/data/news.json)：

```json
{
  "date": "2026-08-31",
  "title": "News text",
  "url": "https://example.com/optional-link"
}
```

首页显示最新 5 条，News 页面自动按日期倒序显示全部内容。没有外部链接时把 `url` 留空。

## 修改课程、团队和履历

- 教学内容：`assets/data/teaching.json`
- 团队成员：`assets/data/team.json`
- CV 页面条目：`assets/data/cv.json`

## 添加 PDF CV

把公开版 CV 命名为 `cv.pdf`，放到：

```text
assets/files/cv.pdf
```

CV 页面会自动检测该文件并启用 `Download PDF CV` 按钮；文件不存在时按钮保持禁用，因此初始主题不会包含坏链接。

## 本地预览

页面通过 `fetch` 读取 JSON 数据，请不要直接双击打开 `index.html`。在仓库根目录启动任意静态服务器，例如：

```bash
python -m http.server 4173
```

然后访问 `http://localhost:4173/`。

运行结构、路径和数据检查：

```bash
node scripts/validate-site.mjs
```

该脚本只使用 Node.js 内置模块，不需要安装依赖。

## GitHub Pages 部署

本仓库名为 `xingzhaoguo.github.io`，因此部署后的默认地址是：

```text
https://xingzhaoguo.github.io/
```

首次部署需要在 GitHub 仓库中设置：

1. 打开 `Settings → Pages`。
2. 在 `Build and deployment` 下把 `Source` 设为 `Deploy from a branch`。
3. Branch 选择 `main`，目录选择 `/ (root)`，然后保存。
4. 将本地提交推送到 `main`。首次发布通常需要等待几分钟。

仓库中的 `.nojekyll` 会让 GitHub Pages 直接发布静态文件，不需要安装 Ruby、Jekyll、Node 包或配置 GitHub Actions。所有站内路径都支持 GitHub 用户站点，也能在仓库改名后作为项目站点的子路径运行。

如果绑定自定义域名，请在 `Settings → Pages` 中填写域名，并按 GitHub 提示添加 `CNAME` 文件和 DNS 记录；同时把 HTML 中的 Open Graph 图片绝对地址及 `_config.yml` 的 `url` 改为新域名。

## 发布前检查

- 替换姓名、邮箱、单位和学术平台链接
- 替换头像和项目占位图
- 移除示例论文 DOI 或换成真实链接
- 添加公开版 `assets/files/cv.pdf`
- 更新页面的 title、description 和社交分享文案
- 运行 `node scripts/validate-site.mjs`
- 手机和电脑浏览器各检查一次导航、文字长度和图片裁切

