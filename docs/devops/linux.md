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