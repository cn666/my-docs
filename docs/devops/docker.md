# Docker 新手常用命令与用法

本文面向新手，覆盖最常用的 Docker 命令与典型用法，配合示例即可快速上手。

## 1. 安装与基本检查

```bash
docker version
docker info
```

- `docker version`：查看客户端/服务端版本，确认是否安装成功。
- `docker info`：查看运行状态、镜像/容器数量、存储驱动等基础信息。

## 2. 镜像（Image）管理

```bash
docker search nginx
docker pull nginx:latest
docker images
docker rmi nginx:latest
```

- `docker search`：搜索镜像（仅作初步参考）。
- `docker pull`：拉取镜像（建议指定标签，例如 `:latest` 或具体版本）。
- `docker images`：列出本地镜像。
- `docker rmi`：删除镜像（有容器在用时需先删容器）。

## 3. 容器（Container）生命周期

```bash
docker run --name web -d -p 8080:80 nginx:latest
docker ps
docker ps -a
docker stop web
docker start web
docker restart web
docker rm web
```

- `docker run`：创建并启动容器（最常用）。  
  常见参数：
    - `--name web`：给容器取名，方便后续操作。
    - `-d`：后台运行。
    - `-p 8080:80`：端口映射（主机端口:容器端口）。
    - `-e KEY=VAL`：设置环境变量。
    - `-v 主机目录:容器目录`：挂载数据卷（见第 6 节）。
    - `--restart=always`：随 Docker 服务自启。
- `docker ps` / `docker ps -a`：查看运行中/所有容器。
- `docker stop/start/restart`：停止/启动/重启容器。
- `docker rm`：删除容器（需先停止）。

## 4. 进入容器与排查问题

```bash
docker exec -it web /bin/sh
docker logs -f --tail 100 web
docker inspect web
docker cp web:/usr/share/nginx/html ./html
```

- `docker exec -it`：进入容器交互式终端。
- `docker logs`：查看日志（`-f` 持续跟随）。
- `docker inspect`：查看详细配置和网络信息。
- `docker cp`：在主机与容器之间复制文件。

## 5. 网络与端口

```bash
docker network ls
docker network create my-net
docker run --name app --network my-net -d my-image
```

- `docker network`：查看/创建自定义网络，让容器互相按名称访问。
- 默认 bridge 网络可直接使用端口映射 `-p` 暴露服务。

## 6. 数据持久化（Volume）

```bash
docker volume ls
docker volume create mydata
docker run -d --name db -v mydata:/var/lib/mysql mysql:8
```

- **卷（volume）**：由 Docker 管理，适合持久化数据。
- **绑定挂载（bind mount）**：把主机目录映射进容器，适合开发场景。

示例（PowerShell）：

```bash
docker run -d --name app -v ${PWD}:/app node:20
```

## 7. 构建镜像（Dockerfile）

```bash
docker build -t my-app:1.0 .
docker tag my-app:1.0 my-app:latest
```

- `docker build -t`：构建镜像并命名，`.` 是构建上下文目录。
- `docker tag`：给镜像打新标签。

示例 `Dockerfile`：

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

## 8. 常用清理命令

```bash
docker system df
docker system prune
```

- `docker system df`：查看磁盘占用。
- `docker system prune`：清理未使用的资源（谨慎使用）。

## 9. 常见场景示例

1) 启动一个 Nginx 服务：

```bash
docker run -d --name web -p 8080:80 nginx:latest
```

2) 启动 Redis 并持久化数据：

```bash
docker run -d --name redis -p 6379:6379 -v redisdata:/data redis:7
```

3) 本地开发挂载代码（热更新常用）：

```bash
docker run -it --name dev -v ${PWD}:/app -w /app node:20 bash
```

---

如果你需要更深入内容（Compose、镜像优化、多阶段构建、私有仓库），告诉我，我可以继续补充。
