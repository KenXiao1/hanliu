# Hanliu Online Reader

《漢留》第一集在线阅读站。项目将原始 PDF 转成一个长期可维护的 Next.js 内容站，支持：

- `light / dark mode`
- `简体 / 繁体` 切换
- `版式模式 / 文章模式` 双阅读体验
- 文章字号调节与版式缩放档位
- 全集目录与文章内目录
- `giscus` 整集评论区与文章评论区
- 系列主站 + 分集子域的长期扩展结构

## Current Scope

当前只实现第一集，数据源固定为：

- `Celestial_Reserve_《漢留》第一集（簡體版）20260309.pdf`
- `Celestial_Reserve_《漢留》第一集（繁體版）20260309.pdf`

仓库当前提交的是已经生成好的 `data/` 与 `public/generated/`。如果你之后要重新运行抽取脚本，需要把上面两份 PDF 放回仓库根目录。

以下内容当前不参与构建：

- 同目录 `docx`
- `Celestial_Reserve_《漢留》第一集（簡體版）20260310.pdf`

## Stack

- `Next.js 15` + `App Router` + `TypeScript`
- `Vitest`
- `PyMuPDF` + `pypdf`
- `opencc-python-reimplemented`
- `giscus`

## Project Structure

```text
app/                     Next.js routes
components/site/         阅读站 UI 组件
lib/                     内容模型、仓库、偏好与域名解析
scripts/pdf-extract/     PDF 预处理脚本
data/issues/issue-01/    生成后的 manifest 与页面数据
public/generated/        生成后的页面图与插图资源
reports/lighthouse/      Lighthouse 检查快照
references/design/       视觉参考素材
tests/                   单元测试
```

## Reader Model

### 1. Layout Mode

- 保留原始 PDF 版面
- 每页渲染为图片资源
- 支持固定缩放档位
- 适合封面、题字、插图、跨栏排版

### 2. Article Mode

- 按文章重排正文
- 支持字号调节
- 适合移动端与长文阅读
- 同一文章下保留简繁并行内容

## URL Strategy

项目已经同时支持两套访问方式。

### Preferred: Subdomain per issue

适合正式部署和后续扩集：

- 系列主站：`https://hanliu.example.com/`
- 第一集：`https://issue-01.hanliu.example.com/`
- 第二集：`https://issue-02.hanliu.example.com/`

这套方案的优点是：

- 每一集都能独立传播
- 仍可保留统一主站归档
- 不需要为每一集拆独立代码库

### Fallback: Path-based issue routing

如果当前域名暂时不方便做泛解析子域名，可以先用路径兜底：

- 系列主站：`https://hanliu.example.com/`
- 第一集：`https://hanliu.example.com/issues/issue-01`

这也是开发环境默认入口。即使暂时没有子域名，站点结构也不会变，后面只需要把 DNS / 平台配置补上。

### Recommendation for the "original" link

如果你现在已经有一个既有主域名或原链接，不建议直接把第一集硬塞到根路径并长期耦合。更稳的方案是：

1. 让原链接继续承担系列主站或导航页
2. 第一集优先挂到 `issue-01.<root-domain>`
3. 同时保留 `/issues/issue-01` 作为兼容入口

这样以后换平台、换 CDN、换站点结构时，老链接仍然能落回路径式地址，不会把内容入口绑死在某一种部署方式上。

## Local Development

### Install

```bash
npm install
python -m pip install -r requirements.txt
```

### Generate issue data

```bash
npm run extract:issue01
```

这会生成：

- [data/issues/issue-01/manifest.json](./data/issues/issue-01/manifest.json)
- [data/issues/issue-01/pages.zh-Hans.json](./data/issues/issue-01/pages.zh-Hans.json)
- [data/issues/issue-01/pages.zh-Hant.json](./data/issues/issue-01/pages.zh-Hant.json)
- `public/generated/issue-01/**`

### Run

```bash
npm run dev
```

打开：

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/issues/issue-01`

## Verification

```bash
npm run lint
npm test
npm run build
```

## Giscus Setup

设置以下环境变量后，整集与文章评论区会自动启用：

```bash
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

如果不配置，页面会显示评论占位说明，不会报错。

## Content Pipeline Notes

- 简体 PDF 的 outline 作为全集目录主来源
- 繁体 PDF 只作为并行文本源，不单独信任其 outline
- 异常书签标题会在抽取阶段清洗
- 文章 slug 目前按起始页码稳定生成，例如 `page-003`
- 评论线程 ID 使用稳定逻辑键，例如：
  - 整集：`issue-01`
  - 文章：`issue-01:page-003`

## Deployment Notes

### Vercel / Next-compatible platforms

推荐将同一个项目同时绑定：

- 主域：`hanliu.example.com`
- 泛解析子域：`*.hanliu.example.com`

站点内部会根据 `host` 自动判断当前是系列站还是分集站。

### If wildcard subdomains are not ready yet

先部署路径式版本即可：

- 主站继续用根域名
- 对外先发 `/issues/issue-01`
- 等 DNS 和泛解析准备好后，再启用 `issue-01.<root-domain>`

## Future Expansion

当前内容模型已经给后续集数预留扩展位。新增后续集时，建议做法是：

1. 新增 `issue-02` 的 PDF 与抽取脚本参数
2. 生成 `data/issues/issue-02` 和 `public/generated/issue-02`
3. 在主站上自动列出第二集入口
4. 将子域名 `issue-02.<root-domain>` 指向同一项目
