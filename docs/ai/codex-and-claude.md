# AI 编程助手入门指南 —— Codex CLI 与 Claude Code

> AI 编程助手可以帮助你在终端中完成代码编写、调试、重构等任务。本文介绍两款主流的终端 AI 编程工具：OpenAI 的 **Codex CLI** 和 Anthropic 的 **Claude Code**，从安装到基本使用，帮你快速上手。

---

## 第一部分：环境准备

两款工具都基于 Node.js 运行，安装前需要确保你的系统已安装合适版本的 Node.js。

### 1.1 版本要求

| 工具 | Node.js 最低版本 |
|------|-----------------|
| Codex CLI | Node.js **v22+** |
| Claude Code | Node.js **v18+** |

::: tip 建议
如果你两款工具都想用，建议直接安装 Node.js v22 以同时满足两者的要求。
:::

### 1.2 使用 nvm 安装 Node.js

推荐使用 nvm（Node Version Manager）管理 Node.js 版本，方便切换。

#### 安装 nvm

**macOS / Linux：**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
```

**Windows：**

Windows 用户推荐使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)，在 Releases 页面下载安装包，双击安装即可。

#### 安装 Node.js

```bash
# 安装 Node.js 22（同时满足 Codex CLI 和 Claude Code）
nvm install 22

# 设置为默认版本
nvm alias default 22

# 验证安装
node -v   # 应输出 v22.x.x
npm -v    # 应输出 10.x.x
```

::: warning 国内用户加速
如果下载速度慢，可以先配置镜像：
```bash
# nvm 下载加速
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
nvm install 22

# npm 下载加速
npm config set registry https://registry.npmmirror.com
```
:::

---

## 第二部分：Codex CLI

### 2.1 简介

[Codex CLI](https://github.com/openai/codex) 是 OpenAI 推出的开源终端 AI 编程助手。它可以直接在你的终端中理解自然语言指令，帮你完成编码、调试、文件操作等任务，并支持多种操作模式来控制 AI 的自主程度。

### 2.2 安装

```bash
npm install -g @openai/codex
```

验证安装：

```bash
codex --version
```

### 2.3 API Key 配置

Codex CLI 需要 OpenAI API Key 才能运行。

#### 获取 API Key

1. 访问 [OpenAI 平台](https://platform.openai.com/)，登录或注册账号
2. 进入 **API Keys** 页面
3. 点击 **Create new secret key**，复制生成的密钥

#### 配置环境变量

**macOS / Linux：**

```bash
# 写入 shell 配置文件（永久生效）
echo 'export OPENAI_API_KEY="你的API密钥"' >> ~/.bashrc
source ~/.bashrc
```

**Windows（PowerShell）：**

```powershell
# 设置用户级环境变量（永久生效）
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "你的API密钥", "User")
```

设置后重启终端即可生效。

### 2.4 基本使用

```bash
# 直接启动交互模式
codex

# 带提示启动（直接描述你想做什么）
codex "解释这个项目的目录结构"

# 指定操作模式
codex --approval-mode full-auto "给所有函数添加注释"
```

进入交互模式后，直接用自然语言输入你的需求即可，例如：

```
> 帮我找到所有未使用的 import 语句并删除
> 写一个函数，接收数组并返回去重后的结果
> 解释 src/utils/auth.js 这个文件的作用
```

### 2.5 操作模式

Codex CLI 提供三种操作模式，控制 AI 的自主程度：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| `suggest`（默认） | AI 只提供建议，所有修改需要你确认 | 初次使用、不熟悉的项目 |
| `auto-edit` | AI 可以自动编辑文件，但执行命令仍需确认 | 日常开发、信任 AI 的编辑能力 |
| `full-auto` | AI 完全自主操作，读写文件、执行命令均自动完成 | 简单重复任务、你充分了解操作范围 |

使用方式：

```bash
# 建议模式（默认）
codex --approval-mode suggest "重构这个函数"

# 自动编辑模式
codex --approval-mode auto-edit "修复所有 ESLint 错误"

# 全自动模式
codex --approval-mode full-auto "运行测试并修复失败的用例"
```

::: danger 注意
`full-auto` 模式下 AI 会自动执行命令，请确保在安全的环境中使用，避免对重要文件造成不可逆的修改。建议配合 Git 版本控制使用。
:::

### 2.6 配置文件

Codex CLI 支持通过项目根目录的 `codex.md` 文件来自定义 AI 的行为：

```markdown
<!-- codex.md -->
## 项目说明
这是一个 Vue 3 + TypeScript 前端项目。

## 代码规范
- 使用 Composition API
- 使用 TypeScript 严格模式
- 函数命名使用 camelCase
- 组件命名使用 PascalCase

## 注意事项
- 不要修改 src/config/ 目录下的文件
- 测试文件放在 __tests__ 目录下
```

AI 会在每次对话中参考这个文件的内容，使输出更符合你的项目规范。

---

## 第三部分：Claude Code

### 3.1 简介

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) 是 Anthropic 推出的终端 AI 编程助手。它基于 Claude 模型，擅长理解复杂代码库、进行多文件编辑和深度推理，可以直接在终端中帮你完成各种编程任务。

### 3.2 安装

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装：

```bash
claude --version
```

### 3.3 认证方式

Claude Code 支持两种认证方式：

#### 方式一：API Key 认证

适用于通过 Anthropic API 按量付费的用户。

1. 访问 [Anthropic Console](https://console.anthropic.com/)，获取 API Key
2. 配置环境变量：

**macOS / Linux：**

```bash
echo 'export ANTHROPIC_API_KEY="你的API密钥"' >> ~/.bashrc
source ~/.bashrc
```

**Windows（PowerShell）：**

```powershell
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "你的API密钥", "User")
```

#### 方式二：Claude 订阅认证

适用于 Claude Max 订阅用户，首次启动 `claude` 时会自动引导你通过浏览器登录认证，无需手动配置 API Key。

### 3.4 基本使用

```bash
# 启动交互模式
claude

# 带初始提示启动
claude "解释这个项目的架构"

# 非交互模式（直接输出结果，不进入对话）
claude -p "这段代码有什么 bug？"

# 继续上次对话
claude --continue
```

在交互模式中，直接用自然语言描述你的需求：

```
> 帮我阅读整个项目并总结架构
> 把 src/utils.js 中的函数改为 TypeScript
> 写一个单元测试覆盖 login 函数的所有分支
```

### 3.5 常用功能

#### 斜杠命令

在交互模式中，可以使用斜杠命令快速执行操作：

| 命令 | 说明 |
|------|------|
| `/help` | 查看帮助信息 |
| `/clear` | 清除当前对话上下文 |
| `/compact` | 压缩对话历史，节省上下文空间 |
| `/cost` | 查看当前会话的 Token 消耗 |
| `/doctor` | 诊断 Claude Code 配置问题 |
| `/init` | 在当前项目初始化 CLAUDE.md 配置文件 |

#### CLAUDE.md 项目配置

在项目根目录创建 `CLAUDE.md` 文件，可以指导 AI 的行为：

```markdown
<!-- CLAUDE.md -->
## 项目概述
这是一个基于 VitePress 的知识库项目。

## 技术栈
- VitePress
- Vue 3
- Markdown

## 编码规范
- 文档使用中文编写
- 代码示例需要添加注释
```

#### Plan 模式

对于复杂任务，Claude Code 支持 Plan 模式，先制定计划再执行：

```
> 你能帮我把项目从 JavaScript 迁移到 TypeScript 吗？请先制定一个计划。
```

Claude 会先分析项目结构，列出迁移步骤，等你确认后再逐步执行。

#### MCP（Model Context Protocol）

Claude Code 支持通过 MCP 连接外部工具和数据源，扩展 AI 的能力范围。例如：

- 连接数据库查询数据
- 访问 Jira、Linear 等项目管理工具
- 集成 Sentry 等监控平台

::: tip
MCP 是高级功能，初次使用可以先跳过，等熟悉基本操作后再探索。
:::

---

## 第四部分：对比与选择建议

| 特性 | Codex CLI | Claude Code |
|------|-----------|-------------|
| 开发商 | OpenAI | Anthropic |
| 底层模型 | OpenAI o3/o4-mini | Claude Sonnet/Opus |
| Node.js 要求 | v22+ | v18+ |
| 开源 | 是 | 否 |
| 操作模式 | suggest / auto-edit / full-auto | 交互式（支持 Plan 模式） |
| 认证方式 | API Key | API Key / 订阅账号 |
| 项目配置文件 | `codex.md` | `CLAUDE.md` |
| 扩展能力 | 有限 | MCP 协议支持 |
| 多文件编辑 | 支持 | 支持（擅长大型代码库） |
| 中文支持 | 良好 | 优秀 |

### 如何选择？

- **刚接触 AI 编程工具**：两者都可以，Claude Code 上手体验更流畅
- **需要处理复杂代码库**：Claude Code 的深度推理和多文件理解能力更强
- **偏好开源工具**：Codex CLI 完全开源，可以自定义和审查代码
- **已有 OpenAI API**：直接用 Codex CLI，无需额外注册
- **已有 Claude 订阅**：直接用 Claude Code，包含在订阅中无额外费用

::: tip 建议
两款工具并不冲突，可以都安装体验，根据不同场景选用。
:::

---

## 第五部分：常见问题

### Q1：安装时提示权限不足

**macOS / Linux：**

```bash
# 不推荐使用 sudo，建议修复 npm 全局安装目录权限
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 然后重新安装
npm install -g @openai/codex
npm install -g @anthropic-ai/claude-code
```

**Windows：**

以管理员身份运行终端，然后执行安装命令。

### Q2：安装后命令找不到（command not found）

确认全局安装的 npm 包路径在系统 PATH 中：

```bash
# 查看全局安装路径
npm config get prefix

# 确认该路径下的 bin 目录在 PATH 中
echo $PATH
```

如果不在，手动添加到 PATH 即可。

### Q3：API 调用报错 401 / 认证失败

- 检查 API Key 是否正确设置：`echo $OPENAI_API_KEY` 或 `echo $ANTHROPIC_API_KEY`
- 确认 API Key 未过期
- 确认账户中有足够的余额

### Q4：国内网络无法访问 API

可以通过设置代理解决：

```bash
# HTTP 代理
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

或者使用 API 代理服务（需要自行搜索可靠的代理服务商）。

### Q5：Codex CLI 提示 Node.js 版本过低

Codex CLI 要求 Node.js v22+，升级方法：

```bash
nvm install 22
nvm use 22
node -v   # 确认是 v22.x.x
```

### Q6：两款工具可以同时安装吗？

可以。两者互不影响，分别使用 `codex` 和 `claude` 命令启动。
