# 04 Maven、Git 与测试基础

## 1. 为什么需要 Maven

一个 Java 项目通常依赖许多第三方库。Maven 负责：

- 下载和管理依赖。
- 约定项目目录结构。
- 编译、测试、打包和运行项目。
- 通过插件执行额外任务。

## 2. 标准目录结构

```text
demo/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/          # 业务代码
    │   └── resources/     # 配置、静态资源
    └── test/
        ├── java/          # 测试代码
        └── resources/     # 测试配置
```

遵循约定可以减少自定义配置，也方便其他开发者快速理解项目。

## 3. pom.xml 基础

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
</project>
```

- `groupId`：组织或公司标识。
- `artifactId`：项目或模块名称。
- `version`：项目版本。
- `SNAPSHOT`：表示仍在开发中的版本。

添加依赖的基本形式：

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.11.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

Spring Boot 项目通常通过父工程或 BOM 统一管理依赖版本，不应随意给每个 Spring 依赖单独填写版本。

## 4. 常用 Maven 命令

```bash
mvn clean
mvn compile
mvn test
mvn package
mvn clean package
```

- `clean`：删除上次构建生成的 `target`。
- `compile`：编译主代码。
- `test`：运行测试。
- `package`：测试并打包，通常生成 JAR。

跳过测试不等于不编译测试：

```bash
mvn package -DskipTests
```

只有在明确知道原因时才跳过测试，不要把它当作修复测试失败的方法。

## 5. Maven 依赖问题

常见排查方式：

```bash
mvn dependency:tree
```

它能显示依赖树，帮助排查版本冲突和重复依赖。

当 IDEA 中依赖显示红色时，依次检查：

1. `pom.xml` 是否有语法错误。
2. JDK 和 Maven 配置是否正确。
3. 网络和 Maven 仓库是否可用。
4. 在 Maven 面板执行 Reload。
5. 使用终端运行 `mvn compile` 获取真实错误。

## 6. Git 最小工作流

```bash
git status
git add src pom.xml
git commit -m "feat: add user query API"
git log --oneline
```

提交前建议：

```bash
mvn test
git diff
git status
```

不要提交：

- `target/` 构建产物。
- `.idea/` 中与个人环境有关的配置。
- 数据库密码、Token、私钥等敏感信息。
- 大量无关格式化改动。

Java 项目常见 `.gitignore`：

```gitignore
target/
.idea/
*.iml
.env
*.log
```

## 7. 为什么要写测试

测试不是“项目写完以后才做”的额外任务。它能帮助你：

- 快速验证方法是否符合预期。
- 修改代码后发现旧功能是否被破坏。
- 用示例表达代码应该如何使用。
- 迫使业务代码更容易拆分和复用。

## 8. JUnit 5 基础

被测试类：

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public int divide(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("除数不能为 0");
        }
        return a / b;
    }
}
```

测试类：

```java
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CalculatorTest {
    private final Calculator calculator = new Calculator();

    @Test
    void shouldAddTwoNumbers() {
        assertEquals(5, calculator.add(2, 3));
    }

    @Test
    void shouldRejectZeroDivisor() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> calculator.divide(10, 0)
        );
        assertEquals("除数不能为 0", exception.getMessage());
    }
}
```

常见结构是 Given（准备）→ When（执行）→ Then（断言）。测试名应说明场景和期望结果。

## 9. 单元测试与集成测试

| 类型 | 特点 | 示例 |
| --- | --- | --- |
| 单元测试 | 快、范围小、尽量不连接外部资源 | 测试一个计算方法 |
| 集成测试 | 验证多个组件协作，运行较慢 | 启动 Spring 并测试接口和数据库 |

新手不要只写“Spring 能否启动”的测试，应优先测试真正的业务规则。

## 10. 本章练习

为上一章的图书借阅服务编写测试：

- 添加图书后可以查询到。
- 借出图书后状态变为已借出。
- 重复借出时抛出异常。
- 归还后可以再次借出。

## 11. 本章检查

- [ ] 能看懂 Maven 标准目录和 `pom.xml`。
- [ ] 会使用 `mvn test` 和 `mvn package`。
- [ ] 会使用 `git status` 和 `git diff` 检查改动。
- [ ] 能编写正常场景和异常场景的单元测试。
