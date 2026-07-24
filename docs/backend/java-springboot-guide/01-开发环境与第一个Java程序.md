# 01 开发环境与第一个 Java 程序

## 1. Java 是什么

Java 是一门强类型、面向对象、跨平台的编程语言，常用于企业后端、支付系统、电商系统、大数据平台和 Android 历史项目等领域。

Java 源代码不会直接被操作系统执行，而是经过以下过程：

```text
Hello.java 源代码
      ↓ javac 编译
Hello.class 字节码
      ↓ JVM 运行
Windows / macOS / Linux
```

这就是 Java “一次编译，到处运行”的基础。

## 2. JDK、JRE、JVM 的关系

| 名称 | 作用 |
| --- | --- |
| JVM | Java 虚拟机，负责运行字节码 |
| JRE | Java 运行环境，包含 JVM 和运行所需类库 |
| JDK | Java 开发工具包，包含编译器、调试器、JRE 等 |

开发程序需要安装 JDK。现在常见的 JDK 已不再单独强调安装 JRE。

## 3. 检查环境

安装 JDK 21 后，在终端执行：

```bash
java -version
javac -version
```

两条命令都能输出版本号，说明 Java 命令已经可用。如果提示找不到命令，需要检查 `JAVA_HOME` 和 `PATH` 环境变量。

Maven 检查命令：

```bash
mvn -version
```

重点确认 Maven 使用的 Java 版本与项目要求一致。

## 4. 第一个 Java 程序

新建 `Hello.java`：

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

编译和运行：

```bash
javac Hello.java
java Hello
```

输出：

```text
Hello, Java!
```

### 代码解释

- `public class Hello`：声明一个名为 `Hello` 的公共类。
- 文件名必须是 `Hello.java`，与公共类名一致。
- `main`：普通 Java 应用的入口方法。
- `String[] args`：接收命令行参数。
- `System.out.println`：向控制台打印一行文本。
- Java 语句通常以分号结尾，代码块使用 `{}`。

## 5. 包 package

真实项目中，类需要放在包内：

```java
package com.example.demo;

public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

包名一般全部小写，通常采用“反向域名 + 项目名”，例如：

```text
com.example.todo
cn.company.order
```

对应的目录结构应与包名一致：

```text
src/main/java/com/example/todo/Hello.java
```

## 6. IDEA 入门操作

新手需要熟悉这些功能：

- 创建 Project、Module、Package 和 Class。
- 使用绿色运行按钮运行 `main` 方法。
- 使用断点和 Debug 模式逐行执行。
- 使用 `Alt + Enter` 查看错误修复建议。
- 使用重构功能安全地修改类名、方法名和变量名。
- 查看 Maven 面板并刷新依赖。

不要把红色报错当成失败。编译器给出的文件、行号和错误信息，是学习 Java 最直接的线索。

## 7. 入门练习

编写 `Profile.java`，打印以下信息：

```text
姓名：小明
年龄：20
学习目标：完成第一个 Spring Boot 项目
```

进阶要求：把姓名、年龄分别保存到变量后再输出。

## 8. 本章检查

- [ ] 能说出 JDK、JRE、JVM 的区别。
- [ ] 能使用 `java` 和 `javac` 命令。
- [ ] 知道公共类名为什么必须和文件名一致。
- [ ] 能解释 `main` 方法的作用。
- [ ] 知道包名和目录结构为什么需要对应。
