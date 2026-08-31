# 网站内容修改指南

本网站采用“页面结构、文字数据、视觉样式分离”的方式维护。大多数个人信息和学术内容都不需要修改 HTML，只需编辑对应的 JSON 数据文件。

## 一、先理解四类文件

| 内容类型 | 文件位置 | 主要用途 |
| --- | --- | --- |
| 中文内容数据 | `assets/data/zh/*.json` | 中文首页、研究、论文、项目、教学、团队、动态和履历 |
| 英文内容数据 | `assets/data/*.json` | `/en/` 下对应的英文内容 |
| 页面固定文案 | 根目录各页面及 `en/` 中的 HTML | 页面标题、栏目介绍、SEO 描述和静态按钮文字 |
| 全站公共逻辑 | `assets/js/site.js` | 导航栏、页脚、语言切换及数据渲染 |

视觉样式统一存放在 `assets/css/main.css`；照片、项目图和 PDF 分别放在 `assets/images/` 与 `assets/files/`。

## 二、中英文内容对应关系

中文是默认版本，地址为 `/`；英文版本地址为 `/en/`。

修改内容时建议始终成对更新：

```text
中文：assets/data/zh/profile.json
英文：assets/data/profile.json

中文：assets/data/zh/research.json
英文：assets/data/research.json
```

其他 JSON 文件也遵循相同规则。中英文项目必须使用相同的 `id`，这样 `中文 / EN` 才能切换到对应的项目详情页。

## 三、各部分文字在哪里修改

| 网站区域 | 中文文件 | 英文文件 | 关键字段或说明 |
| --- | --- | --- | --- |
| 姓名、身份、单位、简介、邮箱 | `assets/data/zh/profile.json` | `assets/data/profile.json` | `name`、`title`、`department`、`institution`、`biography`、`email` |
| 首页个人简介 | 同上 | 同上 | `biography`，显示在姓名、身份和单位下方 |
| 首页研究方向 | 同上 | 同上 | `research_interests`，数组中的每一项是一张方向卡片 |
| 首页教育背景与工作经历 | `assets/data/zh/cv.json` | `assets/data/cv.json` | `education` 和 `appointments` |
| Research 页面 | `assets/data/zh/research.json` | `assets/data/research.json` | 每项包含 `title`、`summary`、`questions`、`methods` |
| 论文列表 | `assets/data/zh/publications.json` | `assets/data/publications.json` | `title`、`authors`、`venue`、`year`、`pdf`、`doi` |
| 项目列表与详情正文 | `assets/data/zh/projects.json` | `assets/data/projects.json` | `summary`、`overview`、`challenge`、`approach`、`outcomes` |
| 教学与学生指导 | `assets/data/zh/teaching.json` | `assets/data/teaching.json` | `statement`、`activities`、`honors` |
| 学术动态 | `assets/data/zh/news.json` | `assets/data/news.json` | `date`、`title`、`url` |
| 团队成员 | `assets/data/zh/team.json` | `assets/data/team.json` | `intro`、`groups`、`members` |
| CV 页面全部条目 | `assets/data/zh/cv.json` | `assets/data/cv.json` | 工作、教育、项目、成果、荣誉与学术服务 |
| Contact 页面个人信息 | `assets/data/zh/profile.json` | `assets/data/profile.json` | 自动复用姓名、身份、单位、地址、邮箱和平台链接 |

首页代表内容的筛选逻辑：

- `projects.json` 中 `featured: true` 的前三个项目显示在首页。
- `publications.json` 中 `selected: true` 的前四篇论文显示在首页。
- `news.json` 中日期最新的五条动态显示在首页。

## 四、修改个人资料

中文文件：`assets/data/zh/profile.json`

```json
{
  "name": "郭兴召",
  "name_zh": "Xingzhao Guo",
  "title": "硕士生导师",
  "department": "机械与动力工程学院",
  "institution": "郑州大学",
  "location": "中国 · 河南郑州",
  "biography": "个人学术简介……",
  "email": "邮箱地址",
  "photo": "assets/images/profile/xingzhao-guo.webp"
}
```

`links` 中填写学术平台地址；暂时没有的平台可以保留为空字符串：

```json
"links": {
  "google_scholar": "",
  "orcid": "",
  "github": "https://github.com/xingzhaoguo"
}
```

英文版在 `assets/data/profile.json` 中填写同一信息的英文表达。

## 五、修改研究方向

首页只显示方向名称，在 `profile.json` 的 `research_interests` 中修改：

```json
"research_interests": [
  "康复机器人",
  "机器人智能控制",
  "生物力学分析"
]
```

Research 页的详细说明在 `research.json` 中修改：

```json
{
  "number": "01",
  "title": "康复机器人",
  "summary": "研究方向概述。",
  "questions": "希望解决的核心科学或工程问题。",
  "methods": ["研究方法一", "研究方法二", "研究方法三"]
}
```

增删研究方向时，应同时更新中英文 `profile.json` 和 `research.json`，并保持顺序一致。

## 六、添加或修改论文

论文按年份倒序存放：

```json
{
  "title": "论文标题",
  "authors": "作者列表",
  "venue": "期刊或会议名称",
  "year": 2026,
  "type": "Journal Article",
  "selected": true,
  "pdf": "assets/files/paper-name.pdf",
  "doi": "https://doi.org/..."
}
```

- `selected: true`：在首页显示。
- `selected: false`：只在 Publications 页面显示。
- 没有公开 PDF 时将 `pdf` 设为 `""`。
- PDF 文件放在 `assets/files/`，路径区分大小写。
- DOI 必须填写完整链接，例如 `https://doi.org/10.xxxx/xxxxx`。

论文标题、作者和期刊名称通常可以在中英文数据中保持原始英文；类型及补充说明可以分别本地化。

## 七、添加或修改项目

项目正文位于 `projects.json`：

```json
{
  "id": "project-slug",
  "title": "项目名称",
  "period": "2026–2028",
  "status": "在研",
  "funding": "项目来源",
  "summary": "卡片上的简短介绍。",
  "image": "assets/images/projects/project-image.webp",
  "image_alt": "项目图片的简短文字说明",
  "featured": true,
  "has_detail": true,
  "overview": "项目概述。",
  "challenge": "研究问题。",
  "approach": "研究方法。",
  "outcomes": ["成果一", "成果二"]
}
```

新增带详情页的项目时：

1. 在中英文 `projects.json` 中添加记录，两个版本使用相同的 `id`。
2. 将项目图片放入 `assets/images/projects/`。
3. 复制一个现有中文项目目录到 `projects/<id>/`。
4. 复制对应英文项目目录到 `en/projects/<id>/`。
5. 将两个详情页 `<body>` 中的 `data-project-id` 改为新的 `id`。
6. 分别修改两个详情页的 `<title>`、description 和 Open Graph 信息。

如果项目不需要独立详情页，设置 `"has_detail": false`，无需创建 HTML 目录。

## 八、添加学术动态

```json
{
  "date": "2026-08-31",
  "display_date": "2026年8月",
  "title": "动态内容",
  "url": ""
}
```

- `date` 必须使用 `YYYY-MM-DD`，并按日期从新到旧排列。
- `display_date` 是页面显示文字，可按需填写。
- 没有新闻链接时将 `url` 留空。

## 九、修改教育、工作经历和 CV

`cv.json` 包含以下栏目：

| 字段 | 页面含义 |
| --- | --- |
| `appointments` | 工作经历，同时显示在首页 |
| `education` | 教育背景，同时显示在首页 |
| `funding` | 主持或参与的科研项目 |
| `outputs` | 论文、专利、软件著作权等科研成果 |
| `honors` | 获奖与学生指导成果 |
| `service` | 学术兼职与审稿服务 |

每条记录统一使用：

```json
{
  "period": "2024–至今",
  "title": "身份或事项",
  "place": "单位或说明"
}
```

公开版 PDF 简历放在 `assets/files/cv.pdf`。文件存在时，中文和英文 CV 页面会自动启用下载按钮。

## 十、修改教学和团队内容

教学内容在 `teaching.json`：

- `statement`：Teaching 页顶部的教学理念。
- `activities`：毕业设计、科研训练和学生项目。
- `honors`：学生竞赛及优秀毕业论文等成果。

团队内容在 `team.json`：

- `intro`：Team 页顶部介绍。
- `groups`：研究生、本科生、合作人员等分组。
- `members`：姓名、身份、研究方向和姓名缩写。

## 十一、哪些文字需要修改 HTML

JSON 负责主要内容，但以下固定文字写在 HTML 中：

- 页面浏览器标题 `<title>`。
- 搜索引擎摘要 `<meta name="description">`。
- 社交分享标题和摘要 `og:title`、`og:description`。
- 页面顶部大标题、栏目引导语和静态按钮文案。

中文页面分别位于：

```text
index.html
research/index.html
publications/index.html
projects/index.html
teaching/index.html
news/index.html
contact/index.html
team/index.html
cv/index.html
```

英文对应页面位于 `en/` 下。修改页面顶部介绍时，应同步修改相应中英文 HTML。

全站导航、页脚公共标签和项目详情标签集中在 `assets/js/site.js` 顶部的 `ui` 对象中。只有需要调整栏目名称时才修改这里；日常更新个人成果无需改动 JavaScript。

## 十二、更换图片

- 个人照片：放入 `assets/images/profile/`，然后修改中英文 `profile.json` 的 `photo`。
- 项目图片：放入 `assets/images/projects/`，然后修改中英文 `projects.json` 的 `image`。
- 社交分享图片：`assets/images/og-xingzhao-guo.png`。

推荐照片使用 WebP 或 JPG，宽度 800–1200 px，尽量控制在 500 KB 内。图片文件名建议只使用小写英文字母、数字和连字符。

## 十三、JSON 编辑注意事项

- 文件使用 UTF-8 编码。
- 字符串必须使用英文双引号。
- 每一项之间需要英文逗号，最后一项后不要加逗号。
- `true`、`false` 不加引号。
- 不要修改已有项目的 `id`，除非同时修改详情页目录和 `data-project-id`。
- 中英文数组尽量保持相同数量和顺序。

## 十四、推荐修改流程

1. 先修改 `assets/data/zh/` 中的中文内容。
2. 再同步修改 `assets/data/` 中的英文内容。
3. 如果改变页面标题或栏目介绍，同步修改中英文 HTML。
4. 本地启动网页服务器预览：

   ```bash
   python -m http.server 4173
   ```

5. 分别检查 `http://localhost:4173/` 和 `http://localhost:4173/en/`。
6. 运行完整性检查：

   ```bash
   node scripts/validate-site.mjs
   ```

7. 检查无误后提交并推送到 GitHub，GitHub Pages 会自动更新。
