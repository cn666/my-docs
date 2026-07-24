# 前端工程师转 AI Agent 全栈工程师学习计划

> 版本：岗位导向版（2026-07-13）  
> 周期：20 周  
> 建议投入：每周 10～15 小时  
> 前端主线：TypeScript + Vue 3 / React  
> 后端主线：Python + FastAPI + PostgreSQL + Redis  
> 最终目标：独立开发、评测、部署并维护生产级 AI Agent 应用

---

## 1. 招聘岗位调研结论

本计划根据 Boss 直聘、智联招聘公开搜索页中的 AI Agent、LLM 应用开发、智能体工程师等岗位要求调整。

调研时观察到的典型要求包括：

- 使用 Python 开发 AI 应用和服务端系统。
- 掌握大模型、Tool Use、Planner、Memory、RAG 和多步骤任务编排。
- 能把 Agent 与 API、数据库、搜索服务和企业系统集成。
- 掌握 MySQL / PostgreSQL、Redis、Kafka 等传统后端组件。
- 具备异步任务、高并发、微服务、分布式系统和架构设计能力。
- 熟悉 LangChain、LangGraph、LlamaIndex、MCP 或类似 Agent 技术。
- 熟悉 Elasticsearch、Milvus、FAISS、pgvector 等检索或向量存储组件。
- 熟悉 Linux、Docker，部分岗位进一步要求 Kubernetes 和云服务。
- Java、Go 经常作为企业系统集成或高并发服务的加分项，但 Agent 应用层以 Python 更常见。

公开页面样本中，Boss 直聘的 AI Agent 开发岗位明确出现了 Java、Python、MySQL、Kafka、Hadoop、Scrapy、架构设计，以及 LLM、Tool Use、Planner、Memory、API、数据库、搜索集成等要求。智联招聘公开搜索页也存在多个 AI Agent 工程师岗位，经验要求覆盖 1～5 年。

> 注意：招聘结果会受到城市、日期、登录状态和个性化排序影响。这不是严格的全量统计，而是用于确定学习方向的岗位样本分析。

### 技术优先级

| 优先级 | 必须掌握的内容 |
| --- | --- |
| P0：求职核心 | Python、FastAPI、SQL、PostgreSQL / MySQL、Redis、LLM API、Tool Calling、RAG、Docker |
| P1：岗位竞争力 | asyncio、Celery、Kafka / RabbitMQ、Elasticsearch、向量数据库、LangGraph、MCP、pytest、Linux |
| P2：中高级能力 | Kubernetes、微服务、分布式系统、可观测性、模型评测、安全治理、Java / Go 基础 |

### 路线调整

原方案采用 Node.js 主后端、Python 补充，不够贴近当前 AI Agent 岗位。调整为：

```text
TypeScript 前端
    ↓ SSE / WebSocket / REST
Python FastAPI Agent 服务
    ├── PostgreSQL / MySQL
    ├── Redis / Celery
    ├── Kafka / RabbitMQ
    ├── Elasticsearch / 向量数据库
    ├── LLM / Embedding / Rerank
    └── 企业 API、MCP 和内部系统
```

Node.js 不再作为必修后端主线，只在以下场景选学：

- 团队已有 Node.js 服务，需要维护或集成。
- 使用 Next.js / Nuxt 构建 BFF。
- 需要在前端与 Python Agent 服务之间增加轻量聚合层。

---

## 2. 最终技术栈

| 模块 | 主线技术 | 掌握程度 |
| --- | --- | --- |
| 前端 | Vue 3 / React、TypeScript、SSE、WebSocket | 熟练 |
| Python 基础 | Python 3.11+、类型标注、asyncio、虚拟环境 | 熟练 |
| Web 后端 | FastAPI、Pydantic、Uvicorn / Gunicorn | 熟练 |
| ORM 与迁移 | SQLAlchemy 2、Alembic | 熟练 |
| 关系数据库 | PostgreSQL；能阅读和使用 MySQL | 熟练 |
| 缓存 | Redis | 熟练 |
| 异步任务 | Celery + Redis / RabbitMQ | 熟练 |
| 消息队列 | Kafka 或 RabbitMQ | 会用并理解适用场景 |
| Agent | 模型 SDK、LangChain、LangGraph、MCP | 熟练一个，了解其他 |
| RAG | Elasticsearch / OpenSearch、pgvector / Milvus | 熟练一种组合 |
| 测试 | pytest、HTTP API 测试、Agent 评测 | 熟练 |
| 部署 | Linux、Docker、Docker Compose | 熟练 |
| 云原生 | Kubernetes、CI/CD | 能部署和排查 |
| 可观测性 | OpenTelemetry、Prometheus、Grafana | 能接入和分析 |
| 可选后端 | Node.js BFF、Java / Go 基础 | 按岗位选学 |

### 推荐学习组合

为了避免同时学习过多框架，练习项目统一使用：

```text
Vue 3 / React + TypeScript
FastAPI + Pydantic
SQLAlchemy + Alembic
PostgreSQL + pgvector
Redis + Celery
Elasticsearch
LangGraph
pytest
Docker Compose
```

---

## 3. 20 周总体路线

| 阶段 | 周数 | 主要目标 | 阶段项目 |
| --- | --- | --- | --- |
| Python 后端基础 | 1～4 | API、数据库、鉴权、缓存、异步任务 | 多用户任务系统 |
| LLM 与工具调用 | 5～7 | 流式输出、结构化输出、Tool Calling、MCP | AI 效率 Agent |
| RAG 工程 | 8～10 | 文档处理、检索、重排、引用、评测 | 企业知识库助手 |
| Agent 工作流 | 11～13 | LangGraph、状态、记忆、长任务、人工审批 | 研究型 Agent |
| 生产工程能力 | 14～17 | 安全、分布式、测试、部署、监控 | 生产化改造 |
| 毕业项目与求职 | 18～20 | 完整项目、评测报告、作品集与面试 | Agent 全栈平台 |

---

## 4. 分周学习计划

## 第一阶段：Python 后端基础（第 1～4 周）

### 第 1 周：Python 工程基础

学习内容：

- [ ] Python 数据结构、函数、类、异常和模块
- [ ] 类型标注、泛型、dataclass 和枚举
- [ ] 虚拟环境、依赖管理和环境变量
- [ ] 文件、JSON、时间和日志处理
- [ ] pytest 基础

实践任务：

- [ ] 编写一个命令行 Todo 应用
- [ ] 使用类型标注覆盖核心代码
- [ ] 使用 pytest 编写不少于 15 条测试
- [ ] 配置格式化、静态检查和 Git 忽略文件

验收标准：能够独立创建结构清晰、可测试的 Python 项目。

### 第 2 周：FastAPI 与异步编程

学习内容：

- [ ] HTTP、REST、状态码、Cookie 和 CORS
- [ ] FastAPI 路由、依赖注入和中间件
- [ ] Pydantic 请求与响应校验
- [ ] asyncio、协程、并发和阻塞操作
- [ ] 统一异常、日志和配置管理

实践任务：

- [ ] 把 Todo 应用改造为 REST API
- [ ] 实现分页、过滤和排序
- [ ] 实现统一错误码和请求日志
- [ ] 对外部 API 调用增加超时与重试

验收标准：能够解释同步、异步的区别，避免在异步接口中执行阻塞任务。

### 第 3 周：SQL、ORM 与数据库设计

学习内容：

- [ ] PostgreSQL 表、约束、索引和事务
- [ ] JOIN、聚合、分页和执行计划
- [ ] SQLAlchemy 2 Session 和关系映射
- [ ] Alembic 数据库迁移
- [ ] 连接池、N+1 查询和慢查询

实践任务：

- [ ] 设计用户、任务、会话、消息数据表
- [ ] 使用 Alembic 创建和回滚迁移
- [ ] 为高频查询增加索引
- [ ] 编写数据库集成测试

验收标准：能够设计业务表，并通过执行计划判断索引是否生效。

### 第 4 周：鉴权、Redis 与异步任务

学习内容：

- [ ] JWT、Session、OAuth2 和 RBAC
- [ ] 密码哈希和密钥管理
- [ ] Redis 缓存、过期、限流和分布式锁
- [ ] Celery 任务、重试、幂等和任务状态
- [ ] RabbitMQ、Kafka 的基本区别

实践任务：

- [ ] 实现注册、登录和角色权限
- [ ] 确保用户数据严格隔离
- [ ] 使用 Redis 实现缓存和接口限流
- [ ] 使用 Celery 执行一个长耗时任务
- [ ] 实现任务取消、重试和状态查询

阶段项目：多用户异步任务系统。

---

## 第二阶段：LLM 与工具调用（第 5～7 周）

### 第 5 周：LLM API 与流式交互

学习内容：

- [ ] Token、上下文窗口和采样参数
- [ ] System、User、Assistant 消息
- [ ] SSE 与 WebSocket
- [ ] 结构化输出和 JSON Schema
- [ ] 超时、重试、限流、熔断和成本统计

实践任务：

- [ ] 用 FastAPI 实现流式聊天接口
- [ ] 前端实现停止、重试和断线提示
- [ ] 保存会话、Token、延迟和费用
- [ ] 让模型稳定输出可校验 JSON

### 第 6 周：Tool Calling

学习内容：

- [ ] 工具 Schema 和参数描述
- [ ] 工具选择、执行和结果回传循环
- [ ] 参数校验、幂等、超时和最大步数
- [ ] 只读、可写、高风险工具分级
- [ ] 工具调用审计日志

实践任务：

- [ ] 实现计算器、搜索、Todo 和数据库查询工具
- [ ] 在前端展示工具参数、状态和结果
- [ ] 为写操作增加用户确认
- [ ] 模拟超时、重复调用和错误参数

### 第 7 周：LangChain、LangGraph 与 MCP

学习内容：

- [ ] 理解模型、Prompt、Tool、Retriever 的抽象
- [ ] 使用 LangGraph 构建最小状态图
- [ ] MCP Client、Server、Tool 和 Resource
- [ ] 框架封装与模型原生 SDK 的取舍

实践任务：

- [ ] 使用原生 SDK 实现一次工具调用
- [ ] 使用 LangGraph 重构为有状态流程
- [ ] 开发一个只读 MCP Server
- [ ] 为 Agent 设置明确终止条件

阶段项目：AI 个人效率 Agent。

项目最低要求：

- [ ] 多用户与权限控制
- [ ] 流式聊天与任务状态
- [ ] 至少 4 个工具
- [ ] 高风险操作人工确认
- [ ] 完整的调用日志和成本统计

---

## 第三阶段：RAG 工程（第 8～10 周）

### 第 8 周：文档处理与向量检索

学习内容：

- [ ] PDF、Word、Markdown 和网页解析
- [ ] 文档清洗、元数据和分块策略
- [ ] Embedding、余弦相似度和向量索引
- [ ] pgvector 或 Milvus

实践任务：

- [ ] 使用 Celery 异步解析文件
- [ ] 保存文档、Chunk、页码和来源
- [ ] 实现 Top-K 向量检索
- [ ] 对上传文件设置类型和大小限制

### 第 9 周：Elasticsearch 与混合检索

学习内容：

- [ ] 倒排索引、BM25 和中文分词
- [ ] Elasticsearch / OpenSearch 基础
- [ ] 向量检索与关键词检索的差异
- [ ] Hybrid Search、Query Rewrite 和 Rerank

实践任务：

- [ ] 建立 Elasticsearch 文档索引
- [ ] 实现关键词与向量混合检索
- [ ] 接入一个 Rerank 模型
- [ ] 对比不同 Chunk 和 Top-K 参数

### 第 10 周：引用、权限与 RAG 评测

学习内容：

- [ ] 原文引用和证据定位
- [ ] 无答案识别和拒答
- [ ] 用户、部门和知识库权限隔离
- [ ] 召回率、准确率和引用正确率

实践任务：

- [ ] 建立至少 30 条 RAG 测试集
- [ ] 回答中展示文档、页码和原文
- [ ] 测试跨用户和跨部门数据越权
- [ ] 生成检索参数对比报告

阶段项目：企业知识库助手。

---

## 第四阶段：Agent 工作流（第 11～13 周）

### 第 11 周：状态机与任务编排

学习内容：

- [ ] ReAct、Router、Planner-Executor
- [ ] LangGraph 节点、边、状态和条件分支
- [ ] 确定性代码与模型决策的边界
- [ ] 最大步数、超时和失败分支

实践任务：

- [ ] 将复杂请求拆分为计划和执行步骤
- [ ] 根据任务类型路由到不同流程
- [ ] 保存每一步输入、输出、状态和耗时

### 第 12 周：记忆与长任务

学习内容：

- [ ] 短期上下文、对话摘要和长期记忆
- [ ] Checkpoint、暂停、恢复和取消
- [ ] Celery / Kafka 长任务架构
- [ ] 幂等键、重复消费和失败补偿

实践任务：

- [ ] 刷新页面后恢复 Agent 状态
- [ ] 从失败节点继续执行
- [ ] 为长期记忆提供查看和删除功能
- [ ] 模拟消息重复和消费者宕机

### 第 13 周：人工审批与多 Agent

学习内容：

- [ ] Human-in-the-loop
- [ ] 计划查看、修改和审批
- [ ] Supervisor 与专业 Agent 协作
- [ ] 多 Agent 的成本和复杂度控制

实践任务：

- [ ] 在写操作前暂停并等待审批
- [ ] 允许用户修改执行计划
- [ ] 仅在确有价值时加入第二个 Agent

阶段项目：可暂停、恢复、审批的研究型 Agent。

---

## 第五阶段：生产工程能力（第 14～17 周）

### 第 14 周：测试与 Agent 评测

学习内容：

- [ ] 单元测试、集成测试和端到端测试
- [ ] 固定数据集和 Prompt 回归测试
- [ ] 工具选择、参数、引用和任务成功率
- [ ] 规则评测、人工评测与 LLM Judge

实践任务：

- [ ] 建立至少 50 条 Agent 测试用例
- [ ] 自动生成准确率、延迟和成本报告
- [ ] 在 CI 中运行核心回归测试

### 第 15 周：安全与权限治理

学习内容：

- [ ] Prompt Injection 和间接注入
- [ ] 工具越权和数据泄漏
- [ ] SSRF、文件上传和恶意内容风险
- [ ] 命令白名单、沙箱和审计日志

实践任务：

- [ ] 构造恶意知识库文档
- [ ] 测试普通用户调用管理员工具
- [ ] 对删除、发送和执行命令增加审批
- [ ] 将攻击用例加入回归测试

### 第 16 周：Linux、Docker 与 CI/CD

学习内容：

- [ ] Linux 进程、端口、权限和日志
- [ ] Dockerfile、镜像分层和多阶段构建
- [ ] Docker Compose 服务编排
- [ ] CI/CD、Secret 和数据库迁移

实践任务：

- [ ] 容器化前端、FastAPI、Celery、数据库和 Redis
- [ ] 配置自动测试与镜像构建
- [ ] 部署一个可在线访问的测试环境

### 第 17 周：Kubernetes 与可观测性

学习内容：

- [ ] Pod、Deployment、Service、Ingress 和 ConfigMap
- [ ] 健康检查、扩缩容和滚动发布
- [ ] OpenTelemetry 链路追踪
- [ ] Prometheus、Grafana 和结构化日志

实践任务：

- [ ] 将核心服务部署到 Kubernetes 测试环境
- [ ] 建立错误率、P95 延迟和队列积压监控
- [ ] 记录一次 Agent 请求的完整调用链
- [ ] 设置模型费用预算和告警

---

## 第六阶段：毕业项目与求职（第 18～20 周）

### 第 18 周：毕业项目架构与核心链路

从以下方向选择一个：

- 客服工单 Agent
- 数据分析 Agent
- 电商运营 Agent
- 招聘筛选 Agent
- 研发任务 Agent

本周完成：

- [ ] 需求说明和系统架构图
- [ ] 数据模型和 API 设计
- [ ] 登录、权限、会话和核心 Agent 流程
- [ ] 至少 3 个真实工具

### 第 19 周：生产化与评测

- [ ] 接入 RAG 和原文引用
- [ ] 实现异步任务、暂停、恢复和审批
- [ ] 完成安全测试和 Agent 评测
- [ ] 完成 Docker 部署和监控面板

### 第 20 周：作品集与面试准备

- [ ] 完善 README、架构图和接口文档
- [ ] 录制 3～5 分钟演示视频
- [ ] 整理技术难点、故障案例和方案取舍
- [ ] 准备 Python、数据库、Redis、网络和 Agent 面试题
- [ ] 根据目标岗位决定是否补充 Java 或 Go

---

## 5. 毕业项目最低要求

### 产品功能

- [ ] 多用户、登录和 RBAC 权限
- [ ] 流式交互和任务状态展示
- [ ] 至少 3 个真实工具
- [ ] RAG 和可定位的原文引用
- [ ] 暂停、取消、恢复和失败重试
- [ ] 高风险操作人工确认

### 后端工程

- [ ] FastAPI + Pydantic + SQLAlchemy + Alembic
- [ ] PostgreSQL 和 Redis
- [ ] Celery 或消息队列长任务
- [ ] 超时、限流、重试、幂等和熔断
- [ ] 单元测试和集成测试
- [ ] Docker 部署和 CI/CD

### Agent 工程

- [ ] LangGraph 或清晰的自研状态机
- [ ] 工具输入输出严格校验
- [ ] 明确的最大执行步数和终止条件
- [ ] 固定评测集和回归报告
- [ ] 模型、Token、延迟和费用统计

### 安全与运维

- [ ] 用户和部门数据严格隔离
- [ ] Prompt Injection 测试
- [ ] 工具白名单和操作审计
- [ ] 日志、指标和链路追踪
- [ ] 错误率、P95 延迟、队列和费用监控

---

## 6. 每周执行方式

| 时间 | 任务 |
| --- | --- |
| 周一 | 阅读文档，运行最小示例 |
| 周二 | 独立重写核心功能 |
| 周三 | 完成前后端联调 |
| 周四 | 处理异常、并发、权限和安全场景 |
| 周五 | 编写测试、运行评测 |
| 周六 | 完善项目、README 和架构图 |
| 周日 | 复盘数据，规划下一周 |

### 周复盘模板

```markdown
## 第 N 周复盘

### 本周完成
- [ ]

### 没有完成
- [ ]

### 遇到的问题及根因
-

### 本周数据
- 学习时长：
- 完成功能：
- 测试数量：
- Agent 任务成功率：
- P95 响应时间：
- 平均任务成本：

### 下周调整
-
```

---

## 7. 面向不同岗位的选修方向

### AI Agent 应用工程师

重点加强：

- Python、FastAPI、LangGraph、MCP
- RAG、向量数据库和模型评测
- Tool Calling、工作流和安全

### AI 后端工程师

重点加强：

- asyncio、高并发和性能优化
- Redis、Kafka、Celery 和分布式系统
- Kubernetes、可观测性和云服务

### 企业 Agent 全栈工程师

重点加强：

- Vue / React + TypeScript
- Python Agent 服务
- Java Spring Boot 或 Go 的接口集成基础
- SSO、RBAC、审计和企业数据隔离

### 数据与搜索方向

重点加强：

- Elasticsearch、Milvus、Rerank
- 数据清洗、ETL 和检索评测
- Kafka；必要时补充 Spark / Hadoop

---

## 8. 最终能力标准

当以下条件全部满足时，可认为具备 AI Agent 全栈工程师的基础求职能力：

- [ ] 能使用 Python 独立开发结构清晰、可测试的后端服务
- [ ] 能设计 PostgreSQL 表、索引、事务和数据权限
- [ ] 能使用 Redis、Celery 或消息队列处理长任务
- [ ] 能实现流式响应、Tool Calling、RAG 和 Agent 工作流
- [ ] 能通过评测数据比较 Prompt、模型和检索方案
- [ ] 能处理超时、重复调用、越权和提示词注入
- [ ] 能使用 Docker 部署并排查 Linux 环境问题
- [ ] 能解释微服务、消息队列、缓存和分布式锁的取舍
- [ ] 至少上线 2 个完整项目，其中 1 个达到毕业项目标准
- [ ] 有可展示的代码、文档、评测报告和在线演示

> 求职作品的重点不是“接入了多少模型”，而是能否证明系统可靠、安全、可评测、可维护，并且能够真正连接企业数据和业务工具。

## 9. 调研入口

- [Boss 直聘：AI Agent 工程师搜索](https://www.zhipin.com/web/geek/jobs?query=AI%20Agent%20%E5%B7%A5%E7%A8%8B%E5%B8%88)
- [智联招聘：AI Agent 工程师搜索](https://sou.zhaopin.com/?kw=AI%20Agent%20%E5%B7%A5%E7%A8%8B%E5%B8%88)

