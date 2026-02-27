# 腾讯云服务器搭建 VitePress 文档博客 —— 新手完全指南

> 本指南同时适用于 **Ubuntu**（推荐）和 **CentOS** 系统。文中涉及系统差异的命令会分别列出，请根据你的系统选择对应命令执行。

---
账号: ubuntu

## 目录

- [第一部分：连接你的服务器](#第一部分连接你的服务器)
- [第二部分：安装基础环境](#第二部分安装基础环境)
- [第三部分：开放服务器端口](#第三部分开放服务器端口)
- [第四部分：创建 VitePress 项目](#第四部分创建-vitepress-项目)
- [第五部分：配置站点](#第五部分配置站点)
- [第六部分：本地预览测试](#第六部分本地预览测试)
- [第七部分：构建并部署](#第七部分构建并部署)
- [第八部分：绑定域名（可选但推荐）](#第八部分绑定域名可选但推荐)
- [第九部分：日常写作流程](#第九部分日常写作流程)
- [第十部分：Git 管理与自动部署（使用 GitHub）](#第十部分git-管理与自动部署使用-github)
- [第十一部分：常见问题排查](#第十一部分常见问题排查)

---

## 第一部分：连接你的服务器

### 1.1 什么是 SSH

SSH（Secure Shell）是一种远程登录协议，你可以通过它在自己的电脑上操作远程服务器，就像在服务器面前敲键盘一样。所有的数据传输都是加密的，非常安全。

### 1.2 Windows 用户连接服务器

#### 方式一：使用 Windows Terminal（推荐，Win10/11 自带）

按 `Win + R`，输入 `cmd`，回车，然后输入：

```bash
ssh root@你的服务器公网IP
```

比如你的服务器 IP 是 `10.110.1.123`：

```bash
ssh root@10.110.1.123
```

第一次连接会出现以下提示：

```
The authenticity of host '10.110.1.123' can't be established.
Are you sure you want to continue connecting (yes/no)?
```

输入 `yes` 回车，然后输入密码。

> **注意**：密码输入时屏幕上不会显示任何字符（没有星号也没有圆点），这是正常的安全机制，直接输完密码按回车即可。

#### 方式二：使用腾讯云网页终端（最简单）

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入「轻量应用服务器」
3. 找到你的服务器实例
4. 点击「登录」按钮

即可在浏览器中直接打开终端，无需任何配置。

#### 方式三：使用第三方工具

推荐 [MobaXterm](https://mobaxterm.mobatek.net/)（免费版即可），它自带文件管理器，可以方便地上传下载文件。

### 1.3 确认你已登录

登录成功后，你会看到类似这样的提示：

```bash
# Ubuntu 系统
root@VM-0-1-ubuntu:~#

# CentOS 系统
[root@VM-0-1-centos ~]#
```

- `root`：当前用户名（root 是最高权限用户）
- `VM-0-1-ubuntu` 或 `VM-0-1-centos`：服务器的主机名
- `~`：当前所在目录（`~` 代表用户的家目录，即 `/root/`）
- `#`：表示当前是 root 用户（普通用户显示的是 `$`）

> **Ubuntu 特别说明**：腾讯云 Ubuntu 系统默认使用 `ubuntu` 用户登录，而非 root。登录后需要先切换到 root：
> ```bash
> sudo -i
> ```
> 或者在每条需要权限的命令前加 `sudo`。

---

## 第二部分：安装基础环境

### 2.1 更新系统软件包

**Ubuntu 系统：**

```bash
apt update && apt upgrade -y
```

**CentOS 系统：**

```bash
yum update -y
```

**解释**：
- `apt` / `yum`：系统的包管理工具（类似手机上的应用商店），用来安装、更新、卸载软件
- `update`：更新软件包索引（Ubuntu）或更新已安装软件（CentOS）
- `upgrade`：Ubuntu 中实际执行升级操作
- `-y`：遇到询问（"是否继续？"）时自动回答"是"，省去手动确认

> 这一步可能需要几分钟，耐心等待即可。

### 2.2 安装 Git

**Ubuntu 系统：**

```bash
apt install -y git
```

**CentOS 系统：**

```bash
yum install -y git
```

**解释**：Git 是代码版本管理工具，类似于"文件的时光机"，可以记录每次修改，随时回退。后续我们用它来管理文档。

验证安装成功：

```bash
git --version
```

看到类似 `git version 2.x.x` 的输出就表示安装成功。

### 2.3 安装 Node.js

Node.js 是 VitePress 的运行环境。我们通过 `nvm`（Node Version Manager，Node 版本管理器）来安装，方便后续管理和切换版本。

#### 第一步：安装 nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**解释**：
- `curl`：一个命令行下载工具
- `-o-`：将下载的内容输出到标准输出
- `|`：管道符，把前一个命令的输出作为后一个命令的输入
- `bash`：用 bash 来执行下载的脚本

简单说就是：从网上下载 nvm 的安装脚本并立即执行。

> **如果下载失败**（国内网络问题），可以使用 gitee 镜像：
> ```bash
> git clone https://gitee.com/mirrors/nvm.git ~/.nvm
> echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
> echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
> source ~/.bashrc
> ```

#### 第二步：让 nvm 生效

```bash
source ~/.bashrc
```

**解释**：安装完 nvm 后，它会把自身的配置写入 `~/.bashrc` 文件（bash 的配置文件）。`source` 命令重新加载这个文件，让新配置立即生效。否则需要断开 SSH 重新连接才能使用 nvm。

#### 第三步：安装 Node.js 18

```bash
nvm install 18
```

**解释**：安装 Node.js 18.x 版本。18 是 LTS（Long Term Support，长期支持）版本，稳定可靠，适合生产环境。

> **如果下载慢**，可以先设置 Node.js 的下载镜像：
> ```bash
> export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
> nvm install 18
> ```

#### 第四步：验证安装

```bash
node -v
npm -v
```

分别看到版本号就表示成功，例如：

```
v18.19.0
10.2.3
```

**小知识**：`npm`（Node Package Manager）是 Node.js 的包管理工具（类似 Python 的 pip），安装 Node.js 时会自动附带。

#### 第五步：配置 npm 镜像源（加速下载）

```bash
npm config set registry https://registry.npmmirror.com
```

**解释**：npm 默认从国外的服务器下载包，在国内网速很慢。这条命令把下载源切换到国内的淘宝镜像，速度会快很多。

验证是否配置成功：

```bash
npm config get registry
```

输出 `https://registry.npmmirror.com` 就对了。

### 2.4 安装 Nginx

**Ubuntu 系统：**

```bash
apt install -y nginx
```

**CentOS 系统：**

```bash
yum install -y nginx
```

**解释**：Nginx（发音：engine-x）是一个高性能的 Web 服务器软件。用户通过浏览器访问你的博客时，实际上是 Nginx 在提供网页文件。你可以把它理解为一个"前台接待员"，负责把正确的文件送给访问者的浏览器。

> **Ubuntu 说明**：Ubuntu 安装 Nginx 后会自动启动，并自动设置开机自启。

启动 Nginx 并设置开机自启：

```bash
# 立即启动 Nginx
systemctl start nginx

# 设置开机自动启动（服务器重启后不需要手动启动）
systemctl enable nginx
```

**解释**：
- `systemctl`：系统服务管理命令
- `start`：启动服务
- `enable`：开机自启动

验证 Nginx 是否正在运行：

```bash
systemctl status nginx
```

看到绿色的 `active (running)` 字样表示正在运行。按 `q` 键退出查看。

---

## 第三部分：开放服务器端口

你的服务器默认只开放了 SSH 的 22 端口。Nginx 使用 80 端口（HTTP）和 443 端口（HTTPS），需要手动开放。

### 3.1 腾讯云防火墙配置

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 左侧菜单找到「轻量应用服务器」并点击
3. 点击你的服务器实例名称，进入详情页
4. 点击上方的「防火墙」选项卡
5. 点击「添加规则」按钮
6. 分别添加以下两条规则：

| 应用类型 | 协议 | 端口 | 策略 | 备注 |
|---------|------|------|------|------|
| HTTP | TCP | 80 | 允许 | 网站访问 |
| HTTPS | TCP | 443 | 允许 | 加密访问 |

7. 点击「确定」保存

### 3.2 验证端口是否生效

在你**自己电脑**的浏览器中（不是服务器上），输入：

```
http://你的服务器公网IP
```

例如：`http://10.110.1.123`

如果看到 Nginx 的欢迎页面（显示 "Welcome to nginx!"），说明 Nginx 运行正常，端口也已开放。

> **如果看不到页面**，检查以下几点：
> 1. 防火墙规则是否添加成功
> 2. Nginx 是否在运行：`systemctl status nginx`
> 3. 服务器本地防火墙是否拦截：
     >    - Ubuntu：`ufw status`（如果是 active，执行 `ufw allow 80/tcp && ufw allow 443/tcp`）
>    - CentOS：`systemctl stop firewalld`（临时关闭系统防火墙测试）

---

## 第四部分：创建 VitePress 项目

### 4.1 创建项目目录

```bash
mkdir -p /home/my-docs
cd /home/my-docs
```

**解释**：
- `mkdir`：创建目录（文件夹）的命令
- `-p`：如果父目录不存在就一并创建（这里 `/home/` 已经存在，加上 `-p` 只是保险）
- `cd`：切换到指定目录（Change Directory）

### 4.2 初始化 npm 项目

```bash
npm init -y
```

**解释**：这会在当前目录创建一个 `package.json` 文件。这个文件是 Node.js 项目的"身份证"，记录了项目的名称、版本、依赖等信息。`-y` 表示所有选项都使用默认值。

### 4.3 安装 VitePress

```bash
npm install -D vitepress
```

**解释**：
- `npm install`：安装一个 npm 包
- `-D`：作为开发依赖安装（写入 `package.json` 的 `devDependencies` 中）
- `vitepress`：要安装的包名

安装过程可能需要一两分钟，完成后你会看到 `added xxx packages` 的提示。

### 4.4 初始化 VitePress

```bash
npx vitepress init
```

**解释**：`npx` 是 npm 附带的工具，可以直接运行项目中已安装的命令行工具，不需要全局安装。

执行后会出现一系列交互式问题，按以下方式回答：

```
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs                          ← 直接按回车，使用默认值
│
◇  Site title:
│  我的知识库                       ← 输入你想要的站点名称，然后回车
│
◇  Site description:
│  个人知识点记录                    ← 输入站点描述，然后回车
│
◇  Theme:
│  Default Theme                   ← 选择默认主题，直接回车
│
◇  Use TypeScript for config and theme files?
│  No                              ← 选 No，新手不需要 TypeScript
│
◇  Add VitePress npm scripts to package.json?
│  Yes                             ← 选 Yes，会自动添加构建命令
│
└  Done! Now run npm run docs:dev and start writing.
```

### 4.5 查看项目结构

```bash
ls -la docs/
ls -la docs/.vitepress/
```

此时你的项目结构如下：

```
/home/my-docs/
├── package.json               # 项目配置文件
├── package-lock.json          # 依赖版本锁定文件（自动生成）
├── node_modules/              # 依赖包目录（自动生成，不用管）
└── docs/                      # 文档根目录（你主要在这里写东西）
    ├── .vitepress/
    │   └── config.mjs         # 站点配置文件（配置导航栏、侧边栏等）
    ├── index.md               # 站点首页
    ├── api-examples.md        # VitePress 自带的示例页面
    └── markdown-examples.md   # VitePress 自带的示例页面
```

> **重要目录说明**：
> - `docs/`：所有文档都放在这里，每个 `.md` 文件就是一个页面
> - `docs/.vitepress/config.mjs`：站点的核心配置文件
> - `node_modules/`：自动生成的依赖目录，不要手动修改

---

## 第五部分：配置站点

### 5.1 vi 编辑器入门

接下来我们需要编辑文件。服务器上最常用的编辑器是 `vi`（或 `vim`）。它和记事本完全不同，需要简单学习。

#### vi 的三种模式

```
                     按 i
    ┌──────────┐  ─────────►  ┌──────────┐
    │ 命令模式  │              │ 编辑模式  │
    │(不能打字) │  ◄─────────  │(可以打字) │
    └──────────┘    按 Esc     └──────────┘
         │
         │ 输入 :
         ▼
    ┌──────────┐
    │底行命令模式│
    │(输入命令) │
    └──────────┘
```

#### 常用操作速查

| 操作 | 按键 | 说明 |
|------|------|------|
| 进入编辑模式 | `i` | 在当前光标位置开始输入 |
| 退出编辑模式 | `Esc` | 回到命令模式 |
| 保存并退出 | `:wq` + 回车 | w=write(保存)，q=quit(退出) |
| 不保存退出 | `:q!` + 回车 | 强制退出，丢弃所有修改 |
| 删除整行 | `dd` | 在命令模式下使用 |
| 清空文件 | `gg` 然后 `dG` | gg 跳到开头，dG 删除到末尾 |
| 粘贴 | 右键 或 `Shift+Insert` | 在 SSH 终端中粘贴内容 |

### 5.2 编辑站点配置文件

```bash
vi docs/.vitepress/config.mjs
```

进入编辑器后：
1. 按 `gg` 跳到文件开头
2. 按 `dG` 清空所有内容
3. 按 `i` 进入编辑模式
4. 粘贴以下内容（右键粘贴或 `Shift+Insert`）：

```javascript
import { defineConfig } from 'vitepress'

export default defineConfig({
  // ========== 站点基本信息 ==========
  title: "我的知识库",           // 站点标题，显示在浏览器标签页和导航栏
  description: "个人学习笔记与知识点记录",  // 站点描述，用于 SEO

  // ========== 主题配置 ==========
  themeConfig: {

    // ---------- 顶部导航栏 ----------
    // 显示在页面最上方的导航链接
    // text: 显示的文字
    // link: 点击后跳转的路径（对应 docs 目录下的 .md 文件）
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/frontend/javascript' },
      { text: '后端', link: '/backend/java' },
      { text: '运维', link: '/devops/linux' }
    ],

    // ---------- 左侧侧边栏 ----------
    // 根据 URL 路径前缀显示不同的侧边栏
    // 比如访问 /frontend/xxx 时，显示前端相关的侧边栏
    sidebar: {
      // 当 URL 以 /frontend/ 开头时，显示这个侧边栏
      '/frontend/': [
        {
          text: '前端技术',       // 分组标题
          items: [               // 分组下的链接列表
            { text: 'JavaScript', link: '/frontend/javascript' },
            { text: 'CSS', link: '/frontend/css' },
            { text: 'Vue.js', link: '/frontend/vue' }
          ]
        }
      ],
      // 当 URL 以 /backend/ 开头时，显示这个侧边栏
      '/backend/': [
        {
          text: '后端技术',
          items: [
            { text: 'Java', link: '/backend/java' },
            { text: '数据库', link: '/backend/database' }
          ]
        }
      ],
      // 当 URL 以 /devops/ 开头时，显示这个侧边栏
      '/devops/': [
        {
          text: '运维知识',
          items: [
            { text: 'Linux', link: '/devops/linux' },
            { text: 'Docker', link: '/devops/docker' }
          ]
        }
      ]
    },

    // ---------- 社交链接 ----------
    // 显示在导航栏右侧的图标链接（可选，不需要可以删除）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/你的用户名' }
    ],

    // ---------- 搜索功能 ----------
    // 使用本地搜索，不需要额外配置第三方服务
    search: {
      provider: 'local'
    },

    // ---------- 中文化 ----------
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    outlineTitle: '本页目录',
    lastUpdatedText: '最后更新于',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '深色模式'
  }
})
```

5. 按 `Esc` 退出编辑模式
6. 输入 `:wq` 回车保存退出

### 5.3 编辑首页

```bash
vi docs/index.md
```

同样清空后粘贴以下内容：

```markdown
---
layout: home

hero:
  name: "我的知识库"
  text: "学习笔记与知识点记录"
  tagline: 好记性不如烂笔头
  actions:
    - theme: brand
      text: 开始阅读
      link: /frontend/javascript
    - theme: alt
      text: GitHub
      link: https://github.com/你的用户名

features:
  - title: 前端技术
    details: JavaScript、CSS、Vue.js 等前端开发知识
  - title: 后端技术
    details: Java、数据库等后端开发知识
  - title: 运维知识
    details: Linux、Docker 等运维相关知识
---
```

> **语法说明**：
> - `---` 之间的内容叫做 Frontmatter，是 YAML 格式的页面配置
> - `layout: home` 表示使用首页专用布局
> - `hero` 区域是首页的大标题区
> - `features` 是首页下方的特性卡片

### 5.4 创建文档目录和文件

首先创建分类目录：

```bash
mkdir -p docs/frontend docs/backend docs/devops
```

#### 创建前端文档

**JavaScript 笔记：**

```bash
vi docs/frontend/javascript.md
```

```markdown
# JavaScript 笔记

## 数据类型

JavaScript 有 8 种数据类型：

### 基本类型（7种）

| 类型 | 说明 | 示例 |
|------|------|------|
| `string` | 字符串 | `'hello'`、`"world"` |
| `number` | 数字 | `42`、`3.14` |
| `boolean` | 布尔值 | `true`、`false` |
| `null` | 空值 | `null` |
| `undefined` | 未定义 | `undefined` |
| `symbol` | 符号（ES6） | `Symbol('id')` |
| `bigint` | 大整数（ES2020） | `9007199254740991n` |

### 引用类型（1种）

- `object` — 对象（包括普通对象、数组、函数、日期等）

## 变量声明

```js
// let — 块级作用域，可以重新赋值（推荐使用）
let name = '张三'
name = '李四' // ✅ 可以重新赋值

// const — 块级作用域，不可重新赋值（推荐用于常量）
const age = 18
// age = 19 // ❌ 报错！不能重新赋值

// var — 函数作用域（不推荐使用，有变量提升问题）
var old = true
```

> **最佳实践**：优先使用 `const`，需要重新赋值时才用 `let`，永远不用 `var`。

## 箭头函数

```js
// 传统函数写法
function add(a, b) {
  return a + b
}

// 箭头函数写法（更简洁）
const add = (a, b) => a + b

// 只有一个参数时，可以省略括号
const double = n => n * 2

// 函数体有多行时，需要花括号和 return
const greet = (name) => {
  const message = `你好，${name}！`
  return message
}
```

## 数组常用方法

```js
const arr = [1, 2, 3, 4, 5]

// map — 对每个元素执行操作，返回新数组
const doubled = arr.map(n => n * 2)         // [2, 4, 6, 8, 10]

// filter — 过滤出符合条件的元素
const evens = arr.filter(n => n % 2 === 0)  // [2, 4]

// find — 找到第一个符合条件的元素
const found = arr.find(n => n > 3)          // 4

// reduce — 将数组归纳为一个值
const sum = arr.reduce((acc, n) => acc + n, 0)  // 15
```
```

**CSS 笔记：**

```bash
vi docs/frontend/css.md
```

```markdown
# CSS 笔记

## Flexbox 弹性布局

Flex 是目前最常用的 CSS 布局方式之一，擅长处理一维布局（一行或一列）。

### 基本概念

```css
.container {
  display: flex;          /* 开启 flex 布局 */
}
```

设置 `display: flex` 后，容器内的子元素会自动变成弹性项目，默认横向排列。

### 常用容器属性

```css
.container {
  display: flex;

  /* 主轴方向 */
  flex-direction: row;            /* 横向排列（默认） */
  flex-direction: column;         /* 纵向排列 */

  /* 主轴对齐方式 */
  justify-content: flex-start;    /* 左对齐（默认） */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐，中间等距 */
  justify-content: space-around;  /* 每个元素两侧等距 */

  /* 交叉轴对齐方式 */
  align-items: stretch;           /* 拉伸填满（默认） */
  align-items: center;            /* 居中 */
  align-items: flex-start;        /* 顶部对齐 */
  align-items: flex-end;          /* 底部对齐 */

  /* 是否换行 */
  flex-wrap: nowrap;              /* 不换行（默认） */
  flex-wrap: wrap;                /* 换行 */
}
```

### 经典场景：水平垂直居中

```css
.container {
  display: flex;
  justify-content: center;   /* 水平居中 */
  align-items: center;       /* 垂直居中 */
  height: 100vh;             /* 让容器占满整个视口高度 */
}
```
```

**Vue.js 笔记：**

```bash
vi docs/frontend/vue.md
```

```markdown
# Vue.js 笔记

> 待补充...
```

#### 创建后端文档

**Java 笔记：**

```bash
vi docs/backend/java.md
```

```markdown
# Java 笔记

> 待补充...
```

**数据库笔记：**

```bash
vi docs/backend/database.md
```

```markdown
# 数据库笔记

> 待补充...
```

#### 创建运维文档

**Linux 笔记：**

```bash
vi docs/devops/linux.md
```

```markdown
# Linux 笔记

## 常用命令速查表

### 文件与目录操作

| 命令 | 作用 | 示例 | 说明 |
|------|------|------|------|
| `ls` | 列出文件 | `ls -la` | `-l` 详细信息，`-a` 显示隐藏文件 |
| `cd` | 切换目录 | `cd /home` | `cd ..` 返回上级，`cd ~` 回到家目录 |
| `pwd` | 显示当前路径 | `pwd` | 不确定自己在哪时使用 |
| `mkdir` | 创建目录 | `mkdir -p a/b/c` | `-p` 递归创建多层目录 |
| `rm` | 删除文件/目录 | `rm -rf dir/` | `-r` 递归删除，`-f` 强制删除，**慎用！** |
| `cp` | 复制 | `cp -r dir1/ dir2/` | `-r` 复制整个目录 |
| `mv` | 移动/重命名 | `mv old.txt new.txt` | 也可以用来重命名文件 |
| `cat` | 查看文件内容 | `cat file.txt` | 适合查看小文件 |
| `less` | 分页查看 | `less file.txt` | 按 `q` 退出，适合查看大文件 |
| `tail` | 查看末尾 | `tail -f log.txt` | `-f` 实时跟踪文件更新（看日志常用） |

### 系统管理

| 命令 | 作用 | 示例 |
|------|------|------|
| `systemctl start xxx` | 启动服务 | `systemctl start nginx` |
| `systemctl stop xxx` | 停止服务 | `systemctl stop nginx` |
| `systemctl restart xxx` | 重启服务 | `systemctl restart nginx` |
| `systemctl status xxx` | 查看服务状态 | `systemctl status nginx` |
| `systemctl enable xxx` | 开机自启动 | `systemctl enable nginx` |

### 网络相关

| 命令 | 作用 | 示例 |
|------|------|------|
| `curl` | 发送 HTTP 请求 | `curl http://localhost` |
| `ping` | 测试网络连通 | `ping baidu.com` |
| `netstat -tlnp` | 查看端口占用 | 看哪些端口在监听 |
```

**Docker 笔记：**

```bash
vi docs/devops/docker.md
```

```markdown
# Docker 笔记

> 待补充...
```

---

## 第六部分：本地预览测试

在正式部署之前，我们先在服务器上启动开发模式预览一下效果。

### 6.1 启动开发服务器

```bash
cd /home/my-docs
npx vitepress dev docs --host 0.0.0.0 --port 5173
```

**解释**：
- `vitepress dev docs`：以开发模式启动 VitePress，`docs` 是文档目录
- `--host 0.0.0.0`：允许外部 IP 访问（默认只允许 127.0.0.1 本机访问）
- `--port 5173`：指定端口号为 5173

### 6.2 临时开放端口

去腾讯云防火墙临时添加一条规则：

| 协议 | 端口 | 策略 |
|------|------|------|
| TCP  | 5173 | 允许 |

### 6.3 浏览器预览

在浏览器中访问：

```
http://你的服务器IP:5173
```

你应该能看到你的知识库页面了！点击各个链接确认页面都能正常显示。

### 6.4 停止开发服务器

确认没问题后，在终端按 `Ctrl + C` 停止开发服务器。

> **重要**：回到腾讯云防火墙，把刚才添加的 5173 端口规则**删除**。开发端口不应该长期对外开放。

---

## 第七部分：构建并部署

### 7.1 构建静态文件

```bash
cd /home/my-docs
npm run docs:build
```

**解释**：这条命令会将所有 Markdown 文件编译成浏览器能直接显示的 HTML、CSS、JS 文件。这个过程叫做"构建"（Build）。

构建完成后，产物文件在 `docs/.vitepress/dist` 目录下：

```bash
ls docs/.vitepress/dist/
```

你会看到一堆 `.html`、`.js`、`.css` 文件，这些就是最终部署到 Nginx 的文件。

### 7.2 配置 Nginx

#### 第一步：备份默认配置

```bash
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
```

**解释**：备份原始配置文件，万一改错了可以恢复。`.bak` 是 backup 的缩写。

#### 第二步：创建站点配置文件

Nginx 支持将不同站点的配置放在 `/etc/nginx/conf.d/` 目录下，每个 `.conf` 文件对应一个站点。

> **Ubuntu 说明**：Ubuntu 的 Nginx 默认有一个 `default` 站点配置，可能会和我们的配置冲突。建议先禁用它：
> ```bash
> rm /etc/nginx/sites-enabled/default
> ```

```bash
vi /etc/nginx/conf.d/docs.conf
```

写入以下内容：

```nginx
server {
    # 监听 80 端口（HTTP 的默认端口）
    listen 80;

    # 服务器名称
    # 如果你有域名，把 _ 替换为你的域名，如：docs.example.com
    # 如果暂时没有域名，保持 _ 即可（表示匹配所有请求）
    server_name _;

    # 网站文件的根目录，指向 VitePress 构建产物
    root /home/my-docs/docs/.vitepress/dist;

    # 默认首页文件
    index index.html;

    # 处理所有请求
    location / {
        # 按顺序尝试：
        # 1. 精确匹配文件 ($uri)
        # 2. 匹配目录 ($uri/)
        # 3. 都不存在时返回 index.html（单页应用需要这个）
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存（可选，提升加载速度）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 30d;                    # 缓存 30 天
        add_header Cache-Control "public, no-transform";
    }

    # 启用 gzip 压缩（减小传输体积，加快加载）
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
```

> **配置逐行解释**：
>
> | 指令 | 含义 |
> |------|------|
> | `listen 80` | 让 Nginx 监听 80 端口，浏览器默认用 80 端口访问 HTTP 网站 |
> | `server_name _` | `_` 是通配符，匹配所有域名。有自己域名后改为实际域名 |
> | `root /home/my-docs/...` | 告诉 Nginx 网站文件在哪个目录 |
> | `try_files` | VitePress 生成的是单页应用（SPA），需要这个配置确保刷新页面时不会 404 |
> | `gzip on` | 启用压缩传输，让网页加载更快 |

#### 第三步：检查配置是否正确

```bash
nginx -t
```

看到以下输出表示配置无误：

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

如果报错，仔细检查 `docs.conf` 文件中的拼写和标点（特别是分号 `;` 不能漏）。

#### 第四步：重新加载 Nginx

```bash
systemctl reload nginx
```

**解释**：`reload` 会让 Nginx 重新读取配置文件，但不会中断正在处理的请求。比 `restart` 更平滑。

### 7.3 验证部署

在浏览器中访问：

```
http://你的服务器公网IP
```

你应该能看到和之前开发模式一样的页面，但这次是通过 Nginx 提供服务的，速度更快、更稳定。

---

## 第八部分：绑定域名（可选但推荐）

IP 地址不好记，绑定一个域名会让你的知识库更专业、更容易分享。

### 8.1 购买域名

推荐的域名注册平台：

| 平台 | 特点 | 网址 |
|------|------|------|
| 腾讯云 | 国内平台，管理方便 | dnspod.cloud.tencent.com |
| 阿里云（万网） | 国内平台，域名种类多 | wanwang.aliyun.com |
| Namesilo | 国外平台，价格便宜，无需备案（用于海外服务器） | namesilo.com |

> **关于备案**：如果你的服务器在**国内**（腾讯云国内区域），域名必须完成 ICP 备案才能正常使用。备案流程大约需要 7-20 个工作日。如果服务器在**海外**（如香港、新加坡），则无需备案。

### 8.2 DNS 解析

在域名服务商的管理页面，添加 DNS 解析记录：

| 主机记录 | 记录类型 | 记录值 | TTL |
|---------|---------|--------|-----|
| `docs` | A | 你的服务器公网 IP | 600 |

**解释**：
- **主机记录** `docs`：表示你要用 `docs.你的域名.com` 来访问
- **记录类型** `A`：表示将域名指向一个 IPv4 地址
- **记录值**：你的服务器 IP
- **TTL** `600`：DNS 缓存时间（秒），600 表示 10 分钟

> 如果你想直接用 `你的域名.com`（不带 docs 前缀）访问，主机记录填 `@`。

### 8.3 修改 Nginx 配置

```bash
vi /etc/nginx/conf.d/docs.conf
```

把 `server_name _;` 改为：

```nginx
server_name docs.你的域名.com;
```

重新加载 Nginx：

```bash
nginx -t && systemctl reload nginx
```

> `&&` 表示前一条命令成功了才执行后一条。这样配置检查不通过时不会执行 reload。

### 8.4 配置 HTTPS（免费 SSL 证书）

HTTPS 可以加密数据传输，浏览器地址栏会显示安全锁标志。使用 Let's Encrypt 提供的免费证书。

#### 安装 Certbot

**Ubuntu 系统：**

```bash
apt install -y certbot python3-certbot-nginx
```

**CentOS 系统：**

```bash
yum install -y epel-release
yum install -y certbot python3-certbot-nginx
```

**解释**：
- `epel-release`（仅 CentOS）：EPEL 是 CentOS 的扩展软件仓库，提供更多的软件包
- `certbot`：Let's Encrypt 官方的证书管理工具
- `python3-certbot-nginx`：Certbot 的 Nginx 插件，可以自动配置 Nginx

#### 申请并配置证书

```bash
certbot --nginx -d docs.你的域名.com
```

过程中会提示：
1. 输入你的邮箱地址（用于接收证书过期提醒）
2. 同意服务条款（输入 `Y`）
3. 是否将 HTTP 自动重定向到 HTTPS（选择 `2`，推荐开启）

Certbot 会自动完成：
- 向 Let's Encrypt 申请证书
- 将证书文件保存到服务器
- 修改 Nginx 配置，添加 SSL 相关设置
- 配置 HTTP 到 HTTPS 的自动跳转

#### 设置自动续期

Let's Encrypt 的证书有效期是 90 天，需要定期续期。设置定时任务自动续期：

**Ubuntu 系统：**

```bash
# Ubuntu 安装 certbot 后会自动创建定时任务，无需手动配置
# 可以通过以下命令验证：
systemctl list-timers | grep certbot
```

**CentOS 系统：**

```bash
echo "0 2 * * * certbot renew --quiet" >> /var/spool/cron/root
```

**解释**：这条 cron 定时任务表示每天凌晨 2:00 自动检查证书是否即将过期，如果是则自动续期。`--quiet` 表示不输出日志。

验证定时任务是否添加成功：

```bash
crontab -l
```

#### 验证 HTTPS

在浏览器中访问：

```
https://docs.你的域名.com
```

看到地址栏有锁的图标就表示 HTTPS 配置成功。

---

## 第九部分：日常写作流程

一切配置完成后，以后写文章的流程非常简单。

### 9.1 新增一篇文章

以添加一篇 React 笔记为例：

#### 第一步：创建 Markdown 文件

```bash
vi docs/frontend/react.md
```

```markdown
# React 笔记

## JSX 语法

JSX 是 JavaScript 的语法扩展，让你可以在 JS 中写类似 HTML 的代码。

```jsx
function App() {
  const name = '世界'
  return <h1>你好，{name}！</h1>
}
```
```

#### 第二步：更新侧边栏配置

```bash
vi docs/.vitepress/config.mjs
```

在 `'/frontend/'` 的 `items` 数组中添加一行：

```javascript
{ text: 'React', link: '/frontend/react' }
```

#### 第三步：提交并推送

```bash
git add .
git commit -m "新增 React 笔记"
git push
```

GitHub Actions 会自动构建并部署到服务器，等待 1-2 分钟后刷新浏览器即可看到新文章。

### 9.2 Markdown 常用语法速查

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文字**
*斜体文字*
~~删除线~~
`行内代码`

- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

> 引用文字

[链接文字](https://example.com)
![图片描述](./images/photo.png)

| 表头1 | 表头2 |
|-------|-------|
| 内容1 | 内容2 |
```

### 9.3 VitePress 特有的 Markdown 扩展

````markdown
::: tip 提示
这是一个提示框
:::

::: warning 注意
这是一个警告框
:::

::: danger 危险
这是一个危险提示框
:::

::: details 点击展开
这是可折叠的内容
:::

::: code-group
```js [JavaScript]
console.log('hello')
```
```python [Python]
print('hello')
```
:::
````

---

## 第十部分：Git 管理与自动部署（使用 GitHub）

实现目标：**本地写完文档 → 推送到 GitHub → 服务器自动更新网站**。

整体流程：

```
本地电脑          GitHub              服务器
(写文档)          (代码仓库)           (运行网站)
   │                │                   │
   ├── git push ──►│                   │
   │                ├── GitHub Actions  │
   │                │   自动构建        │
   │                │   VitePress       │
   │                ├── 通过 SSH ─────►│
   │                │   上传构建产物     │
   │                │                   ├── 网站自动更新
```

> **为什么用这个方案？**
> - 国内服务器访问 GitHub 不稳定，让服务器去拉代码经常超时
> - 用 GitHub Actions 在 GitHub 上构建，再通过 SSH 把构建好的文件传到服务器
> - 服务器完全不需要访问 GitHub，只需要接收文件即可

### 10.1 在本地电脑初始化项目

> 如果你之前已经在服务器上创建了项目，先用 WinSCP 或 `scp` 把服务器上的 `docs/` 目录和 `package.json` 下载到本地。

在本地电脑选择一个目录（如 `D:\gitCode\`），打开终端：

```bash
mkdir my-docs
cd my-docs
npm init -y
npm install -D vitepress
```

把服务器上的 `docs/` 目录内容放到本地的 `docs/` 下（保持目录结构一致）。

创建 `.gitignore` 文件，内容如下：

```
node_modules/
docs/.vitepress/dist/
docs/.vitepress/cache/
```

初始化 Git 并提交：

```bash
git init
git add .
git commit -m "初始化知识库"
```

> **如果提示需要配置用户信息**，先执行：
> ```bash
> git config --global user.name "你的名字"
> git config --global user.email "你的邮箱"
> ```

### 10.2 在 GitHub 创建仓库并推送

#### 创建 GitHub 仓库

1. 打开 [github.com](https://github.com)，登录后点击右上角 `+` → `New repository`
2. 填写仓库名称（如 `my-docs`）
3. 选择 `Private`（私有，只有你能看到）
4. **不要**勾选 "Add a README file"
5. 点击 `Create repository`

#### 推送代码到 GitHub

```bash
git remote add origin https://github.com/你的用户名/my-docs.git
git branch -M main
git push -u origin main
```

> **GitHub 认证说明**：GitHub 不支持密码推送，需要使用 Personal Access Token：
> 1. GitHub 右上角头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)
> 2. 点击 Generate new token (classic)
> 3. 勾选 `repo` 权限，生成后**复制 Token**
> 4. 推送时 Username 填 GitHub 用户名，Password 填 Token（不是密码）
> 5. 执行 `git config --global credential.helper store` 保存凭证，之后不用重复输入

### 10.3 配置服务器 SSH 密钥（供 GitHub Actions 使用）

GitHub Actions 需要通过 SSH 连接你的服务器来上传文件。我们需要生成一对密钥。

#### 第一步：在服务器上生成 SSH 密钥对

SSH 登录服务器（用 root 用户），执行：

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

连按三次**回车**（不设置密码），会生成两个文件：
- `~/.ssh/github_actions_deploy` — **私钥**（给 GitHub Actions 用）
- `~/.ssh/github_actions_deploy.pub` — **公钥**（留在服务器上）

> **解释**：SSH 密钥类似于一把锁和一把钥匙。公钥是锁，放在服务器上；私钥是钥匙，给 GitHub Actions 拿着。GitHub Actions 用私钥就能"开锁"登录服务器。

#### 第二步：将公钥添加到服务器的授权列表

```bash
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**解释**：把公钥加入 `authorized_keys` 文件，允许持有对应私钥的人登录。

#### 第三步：查看并复制私钥内容

```bash
cat ~/.ssh/github_actions_deploy
```

屏幕会输出类似以下内容：

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAA...
...
-----END OPENSSH PRIVATE KEY-----
```

**完整复制**这段内容（包括 BEGIN 和 END 那两行），后面要用。

### 10.4 配置 GitHub 仓库 Secrets

GitHub Actions 需要知道服务器的地址、用户名和 SSH 私钥，这些敏感信息通过 Secrets 安全存储。

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings**（仓库的设置，不是账号设置）
3. 左侧菜单：**Secrets and variables** → **Actions**
4. 点击 **New repository secret**，分别添加以下三个：

| Name | Value                          |
|------|--------------------------------|
| `SERVER_HOST` | 你的服务器公网 IP，如 `123.123.463.457` |
| `SERVER_USER` | `root`                         |
| `SERVER_SSH_KEY` | 上一步复制的**完整私钥内容**               |

每添加一个，点击 **Add secret** 保存，然后再添加下一个。

### 10.5 创建 GitHub Actions 自动部署工作流

回到本地项目，创建工作流配置文件：

```bash
mkdir -p .github/workflows
```

创建文件 `.github/workflows/deploy.yml`，内容如下：

```yaml
name: 部署文档到服务器

# 触发条件：当 main 分支有代码推送时自动运行
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest   # 在 GitHub 提供的 Ubuntu 机器上运行

    steps:
      # 第一步：拉取仓库代码
      - name: 拉取代码
        uses: actions/checkout@v4

      # 第二步：安装 Node.js
      - name: 安装 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      # 第三步：安装依赖
      - name: 安装依赖
        run: npm install

      # 第四步：构建 VitePress
      - name: 构建文档
        run: npm run docs:build

      # 第五步：将构建产物部署到服务器
      - name: 部署到服务器
        uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          SOURCE: "docs/.vitepress/dist/"
          TARGET: "/home/my-docs/docs/.vitepress/dist/"
          ARGS: "-avz --delete"
```

> **配置逐行解释**：
>
> | 配置项 | 含义 |
> |--------|------|
> | `on: push: branches: main` | 当你推送代码到 main 分支时，自动触发这个流程 |
> | `runs-on: ubuntu-latest` | GitHub 提供免费的 Ubuntu 虚拟机来运行任务 |
> | `actions/checkout@v4` | 拉取你仓库里的代码 |
> | `actions/setup-node@v4` | 安装 Node.js 环境 |
> | `npm install` + `npm run docs:build` | 安装依赖并构建静态文件 |
> | `easingthemes/ssh-deploy@v5` | 通过 SSH 将构建产物上传到你的服务器 |
> | `SOURCE` | GitHub Actions 机器上的构建产物目录 |
> | `TARGET` | 服务器上的目标目录（Nginx 指向的目录） |
> | `ARGS: "-avz --delete"` | rsync 参数：同步文件并删除服务器上多余的旧文件 |

### 10.6 提交并测试自动部署

```bash
git add .
git commit -m "添加 GitHub Actions 自动部署"
git push
```

推送后：
1. 打开 GitHub 仓库页面
2. 点击顶部的 **Actions** 选项卡
3. 你会看到一个正在运行的工作流（黄色圆圈转动）
4. 等待变成绿色对勾（✓），表示部署成功
5. 刷新你的网站，应该能看到最新内容

> **如果显示红色叉号（✗）**，点击进去查看具体报错信息。常见问题：
> - SSH 连接失败：检查 Secrets 中的 IP、用户名、私钥是否正确
> - 构建失败：检查本地 `npm run docs:build` 是否能正常构建

### 10.7 日常写作流程

一切配置完成后，以后写文档的完整流程：

```bash
# 1. 用 VS Code 等编辑器修改 docs/ 目录下的 Markdown 文件

# 2. 提交并推送（三条命令）
git add .
git commit -m "新增 xxx 笔记"
git push

# 3. 等待 1-2 分钟，GitHub Actions 自动构建并部署
# 4. 刷新浏览器查看更新
```

你也可以在本地项目根目录创建一个快捷脚本 `push.bat`（Windows）：

```bat
@echo off
git add .
set /p msg="请输入提交说明: "
git commit -m "%msg%"
git push
echo 已推送！等待 GitHub Actions 自动部署...
pause
```

以后双击 `push.bat`，输入说明，就能一键推送，服务器自动更新。

---

## 第十一部分：常见问题排查

### 问题一览表

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| 浏览器访问 IP 显示 Nginx 默认页 | 站点配置未生效 | 检查 `/etc/nginx/conf.d/docs.conf` 是否正确，执行 `nginx -t && systemctl reload nginx` |
| 浏览器显示"无法访问此网站" | 端口未开放 或 Nginx 未运行 | ① 检查腾讯云防火墙 ② `systemctl status nginx` 确认运行中 |
| `npm install` 下载很慢 | 使用的国外源 | `npm config set registry https://registry.npmmirror.com` |
| `nvm: command not found` | nvm 未加载到环境 | `source ~/.bashrc` |
| `npm run docs:build` 报错 | Node.js 版本不兼容 | `node -v` 确认是 v18.x，不是的话 `nvm install 18 && nvm use 18`。CentOS 7 只能用 Node.js 16 |
| 页面刷新后出现 404 | Nginx 缺少 try_files 配置 | 确认配置中有 `try_files $uri $uri/ /index.html;` |
| 修改文章后刷新页面没变化 | 未重新构建 | 执行 `npm run docs:build` |
| 修改文章后构建了但还是没变化 | 浏览器缓存 | 按 `Ctrl + Shift + R` 强制刷新，或清除浏览器缓存 |
| certbot 证书申请失败 | 域名未正确解析 | 确认 DNS 解析已生效：`ping docs.你的域名.com` |
| SSH 连接被拒绝（Connection refused） | SSH 服务未运行 | 通过腾讯云网页终端执行 `systemctl start sshd` |
| SSH 密码认证被拒（Permission denied） | 系统禁用了密码登录 | 修改 `/etc/ssh/sshd_config` 中 `PasswordAuthentication` 为 `yes`，然后 `systemctl restart sshd` |
| Ubuntu 提示不是 root 权限 | 默认使用 ubuntu 用户 | 执行 `sudo -i` 切换到 root，或在命令前加 `sudo` |
| Node.js 报 GLIBC 版本错误 | CentOS 7 系统版本过低 | CentOS 7 只能安装 Node.js 16：`nvm install 16`。建议升级为 Ubuntu 22.04 |
| Git push 提示权限不足 | 未配置认证 | GitHub 需要使用 Token 认证，参考 GitHub 官方文档生成 Personal Access Token |
| GitHub Actions 部署失败（红色叉号） | SSH 连接失败 | 检查 Secrets 中 SERVER_HOST、SERVER_USER、SERVER_SSH_KEY 是否正确 |
| GitHub Actions 构建失败 | 依赖或配置问题 | 先在本地执行 `npm run docs:build` 确认能正常构建 |
| 推送后网站没更新 | Actions 还在运行 | 打开 GitHub 仓库的 Actions 页面查看运行状态，一般需要 1-2 分钟 |

### 如何查看 Nginx 错误日志

```bash
# 查看最近的错误日志
tail -50 /var/log/nginx/error.log

# 实时查看错误日志（有新请求时会实时显示）
tail -f /var/log/nginx/error.log
```

### 如何查看 Nginx 访问日志

```bash
# 查看最近的访问记录
tail -50 /var/log/nginx/access.log
```

---

## 附录：完整命令清单

以下是本教程中所有命令的汇总，按顺序排列：

### Ubuntu 系统命令

```bash
# ===== 环境安装 =====
apt update && apt upgrade -y
apt install -y git
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
npm config set registry https://registry.npmmirror.com
apt install -y nginx
rm /etc/nginx/sites-enabled/default    # 禁用默认站点
systemctl start nginx
systemctl enable nginx

# ===== 项目创建（在本地电脑执行） =====
mkdir my-docs && cd my-docs
npm init -y
npm install -D vitepress
npx vitepress init

# ===== 创建文档目录 =====
mkdir -p docs/frontend docs/backend docs/devops

# ===== 预览测试 =====
npx vitepress dev docs --host 0.0.0.0 --port 5173

# ===== 构建部署 =====
npm run docs:build
nginx -t
systemctl reload nginx

# ===== Git 管理与自动部署 =====
git init
git add .
git commit -m "初始化知识库"
git remote add origin https://github.com/你的用户名/my-docs.git
git branch -M main
git push -u origin main
# 配置 GitHub Actions 后，每次 git push 自动部署

# ===== 服务器配置 SSH 密钥（供 GitHub Actions 使用） =====
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# ===== 日常更新 =====
git add .
git commit -m "更新文档"
git push
# GitHub Actions 自动构建并部署到服务器
```

### CentOS 系统命令

```bash
# ===== 环境安装 =====
yum update -y
yum install -y git
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
npm config set registry https://registry.npmmirror.com
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# ===== 项目创建（在本地电脑执行） =====
mkdir my-docs && cd my-docs
npm init -y
npm install -D vitepress
npx vitepress init

# ===== 创建文档目录 =====
mkdir -p docs/frontend docs/backend docs/devops

# ===== 预览测试 =====
npx vitepress dev docs --host 0.0.0.0 --port 5173

# ===== 构建部署 =====
npm run docs:build
nginx -t
systemctl reload nginx

# ===== Git 管理与自动部署 =====
git init
git add .
git commit -m "初始化知识库"
git remote add origin https://github.com/你的用户名/my-docs.git
git branch -M main
git push -u origin main
# 配置 GitHub Actions 后，每次 git push 自动部署

# ===== 服务器配置 SSH 密钥（供 GitHub Actions 使用） =====
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# ===== 日常更新 =====
git add .
git commit -m "更新文档"
git push
# GitHub Actions 自动构建并部署到服务器
```

---

> **最后的建议**：不要追求完美再开始写，先把框架搭起来，有什么知识点就随手记录，日积月累就是一座知识库。
