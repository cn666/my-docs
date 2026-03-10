# CC Switch —— AI 编程工具配置管理神器

> 使用 Claude Code、Codex、Gemini CLI 等多款 AI 编程工具时，频繁手动修改配置文件非常麻烦。CC Switch 是一款跨平台桌面应用，让你在图形界面中一键切换 API 供应商、统一管理 MCP 服务和 Skills 扩展。

**GitHub 地址**：[farion1231/cc-switch](https://github.com/farion1231/cc-switch)

---

## 第一部分：CC Switch 是什么

CC Switch 是一款开源的跨平台桌面 All-in-One 助手工具，支持统一管理以下 AI CLI 工具的配置：

| 支持的工具 | 说明 |
|-----------|------|
| Claude Code | Anthropic 的终端编程助手 |
| Codex CLI | OpenAI 的终端编程助手 |
| Gemini CLI | Google 的终端编程助手 |
| OpenCode | 开源 AI 编程工具 |
| OpenClaw | 开源 AI 编程工具 |

### 解决了什么问题？

每款 AI CLI 工具都有自己的配置格式（JSON、TOML、.env 等），切换 API 供应商需要手动编辑配置文件，管理多个工具的 MCP 服务和 Skills 扩展更是繁琐。CC Switch 提供统一的图形界面，一键完成这些操作。

---

## 第二部分：下载与安装

### 2.1 macOS（推荐 Homebrew）

```bash
# 添加软件仓库
brew tap farion1231/ccswitch

# 安装
brew install --cask cc-switch
```

::: warning 首次启动提示
由于作者没有 Apple 开发者账号，首次打开会出现「未知开发者」警告。解决方法：
1. 关闭弹窗
2. 打开「系统设置」→「隐私与安全性」
3. 点击「仍要打开」即可
:::

### 2.2 Windows

1. 前往 [GitHub Releases](https://github.com/farion1231/cc-switch/releases) 页面
2. 下载 `CC-Switch-v{版本号}-Windows-Portable.zip`
3. 解压后直接运行 `CC Switch.exe`

::: tip
Windows 便携版无需安装，不写入注册表，解压即用。
:::

### 2.3 Linux

前往 [GitHub Releases](https://github.com/farion1231/cc-switch/releases) 页面，根据你的发行版选择：

**Debian / Ubuntu（.deb 包）：**

```bash
# 下载后安装
sudo dpkg -i CC-Switch-v{版本号}-Linux.deb
```

**通用发行版（AppImage）：**

```bash
# 下载 AppImage 后赋予执行权限
chmod +x CC-Switch-v{版本号}-Linux.AppImage

# 直接运行
./CC-Switch-v{版本号}-Linux.AppImage
```

::: warning ARM64 用户注意
ARM64 架构的 AppImage 需要安装 `xdg-utils` 包：
```bash
sudo apt install xdg-utils
```
:::

---

## 第三部分：核心功能

### 3.1 供应商管理（Provider）

这是 CC Switch 最核心的功能——在图形界面中一键切换 API 供应商。

**支持的供应商类型：**

- 官方 API（OpenAI、Anthropic、Google）
- 第三方中转服务
- 自建 API 代理

**操作方式：**

1. 点击「添加供应商」
2. 选择内置模板（如 DeepSeek、GLM、ModelScope 等），或自定义配置
3. 填写 API Base URL 和 API Key
4. 点击启用，即可切换

::: tip
Claude Code 支持供应商热切换，无需重启。其他工具切换后需要重启终端才能生效。
:::

### 3.2 MCP 统一管理

跨 Claude Code / Codex / Gemini CLI 统一管理 MCP（Model Context Protocol）服务器：

- 支持三种传输类型：stdio / HTTP / SSE
- 在一处配置，自动同步到所有工具
- 无需分别编辑各工具的 MCP 配置文件

### 3.3 Skills 技能扩展

管理 Claude Code / Codex / Gemini CLI 的 Skills 扩展：

- 浏览社区技能仓库
- 一键启用 / 禁用技能
- 自动同步到对应工具的目录
- 扫描并导入已有的未管理技能

### 3.4 Prompts 提示词管理

- 使用内置 Markdown 编辑器创建提示词预设
- 激活后自动同步到对应工具的配置文件
- 切换前自动保存当前提示词内容

### 3.5 本地代理与自动熔断

CC Switch 内置本地 API 代理，支持自动熔断机制：

- **健康检测**：定期检测每个供应商的可用性
- **自动切换**：当前供应商故障时，自动切换到备用供应商
- **自动恢复**：主供应商恢复后，自动切回

### 3.6 其他功能

| 功能 | 说明 |
|------|------|
| 用量查询 | 不用打开供应商平台，直接查看 API 用量 |
| 云同步 | 指向 Dropbox / OneDrive / iCloud 文件夹，跨设备同步配置 |
| 终端选择 | 选择偏好的终端应用（iTerm2、Windows Terminal 等） |
| 多语言 | 支持中文、英文、日文 |
| 备份管理 | 可配置备份策略和自动清理规则 |
| 会话浏览 | 浏览各工具的历史对话记录 |

---

## 第四部分：基本使用流程

### 4.1 添加供应商

1. 打开 CC Switch
2. 点击「添加供应商」
3. 选择预设模板或自定义配置：
   - **使用官方账号**：选择「Official Login」预设（Claude / Codex）或「Google Official」预设（Gemini）
   - **使用第三方中转**：选择对应的预设模板，填入 API Key
   - **自定义配置**：手动填写 API Base URL、API Key、模型名称

### 4.2 切换供应商

1. 在供应商列表中选择目标供应商
2. 点击「启用」
3. Claude Code 立即生效；其他工具需重启终端

### 4.3 验证是否生效

启用后，在对应的 CLI 工具中输入：

```bash
# Claude Code 中验证
claude
# 进入后输入 /status 查看当前配置

# Codex CLI 中验证
codex
# 观察是否能正常调用 API
```

---

## 第五部分：注意事项

### 环境变量冲突

如果你之前在系统环境变量中设置过 `ANTHROPIC_API_KEY`、`OPENAI_API_KEY` 等变量，它们的优先级会高于 CC Switch 的配置，导致切换不生效。

**解决方法：**

```bash
# 编辑 shell 配置文件
vi ~/.bashrc   # 或 ~/.zshrc

# 注释掉或删除以下类似的行
# export ANTHROPIC_API_KEY="sk-xxx"
# export OPENAI_API_KEY="sk-xxx"

# 重新加载配置
source ~/.bashrc
```

### Windows 安全提示

Windows 可能弹出 SmartScreen 安全警告，点击「更多信息」→「仍要运行」即可。

### 更新方式

**macOS：**

```bash
brew upgrade --cask cc-switch
```

**Windows / Linux：**

前往 [Releases](https://github.com/farion1231/cc-switch/releases) 页面下载最新版本覆盖安装。
