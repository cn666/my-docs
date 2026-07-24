# 05 Spring 与 Spring Boot 核心概念

## 1. Spring 解决什么问题

在普通 Java 程序中，对象通常由开发者手动创建：

```java
UserRepository repository = new UserRepository();
UserService service = new UserService(repository);
```

项目变大后，对象之间的依赖关系会越来越复杂。Spring 的核心作用之一，是统一创建、管理和组装对象。

被 Spring 管理的对象叫作 **Bean**，保存这些 Bean 的环境叫作 **IoC 容器**。

## 2. IoC 与依赖注入

- IoC（控制反转）：对象的创建权交给 Spring 容器。
- DI（依赖注入）：Spring 将一个对象需要的依赖提供给它。

```java
public interface MessageService {
    String getMessage();
}
```

```java
import org.springframework.stereotype.Service;

@Service
public class SimpleMessageService implements MessageService {
    @Override
    public String getMessage() {
        return "Hello Spring Boot";
    }
}
```

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/messages/hello")
    public String hello() {
        return messageService.getMessage();
    }
}
```

这里没有手动 `new SimpleMessageService()`。Spring 创建 Service 和 Controller，并把 Service 注入 Controller。

## 3. 为什么推荐构造器注入

构造器注入的优点：

- 依赖关系清晰。
- 字段可以声明为 `final`。
- 对象创建完成后就是可用状态。
- 单元测试时容易手动传入替代实现。
- 能更早发现循环依赖和缺失依赖。

不推荐新代码依赖字段注入：

```java
// 不推荐
@Autowired
private MessageService messageService;
```

当一个类只有一个构造方法时，不需要在构造方法上写 `@Autowired`。

## 4. Spring Boot 解决什么问题

Spring 功能强大，但传统配置较多。Spring Boot 在 Spring 之上提供：

- 自动配置：根据已有依赖推断常用配置。
- Starter：把一组相关依赖组合起来。
- 内嵌服务器：应用可以直接以 JAR 运行。
- 外部化配置：支持 properties、YAML、环境变量等。
- Actuator：提供健康检查和运行信息。

Spring Boot 并不是另一个完全独立的框架，它让 Spring 应用更容易创建和运行。

## 5. 创建项目

可以通过 Spring Initializr 创建项目，常用选择：

```text
Project: Maven
Language: Java
Spring Boot: 选择当前稳定的 3.x
Packaging: Jar
Java: 21（或 17）
```

入门依赖：

- Spring Web
- Validation
- Spring Data JPA（需要数据库时）
- H2 Database 或 MySQL Driver
- Spring Boot DevTools（可选）
- Spring Boot Starter Test

## 6. 启动类

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

`@SpringBootApplication` 组合了几个重要能力：

- 声明这是一个配置类。
- 开启自动配置。
- 从启动类所在包向下扫描组件。

因此启动类一般放在项目根包：

```text
com.example.demo
├── DemoApplication.java
├── controller/
├── service/
└── repository/
```

如果组件放在根包之外，可能无法被扫描，最终出现 Bean 找不到的问题。

## 7. 常用组件注解

| 注解 | 常见用途 |
| --- | --- |
| `@Component` | 通用 Spring 组件 |
| `@Service` | 业务逻辑组件 |
| `@Repository` | 数据访问组件 |
| `@Controller` | 返回页面的 MVC 控制器 |
| `@RestController` | 返回 JSON 或文本的 REST 控制器 |
| `@Configuration` | Java 配置类 |
| `@Bean` | 把方法返回的对象注册为 Bean |

这些注解有助于表达代码职责，而不只是让 Spring “能扫描到”。

## 8. 使用 @Bean 管理第三方对象

无法修改源码的第三方类不能直接加 `@Component`，可以通过配置类注册：

```java
@Configuration
public class AppConfig {
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
```

之后其他 Bean 可以通过构造器注入 `Clock`。

## 9. 分层结构

典型入门项目：

```text
Controller → Service → Repository → Database
     ↓           ↓           ↓
 接收请求     业务规则      数据读写
```

- Controller：处理 HTTP 参数、状态码和响应。
- Service：处理业务规则、流程和事务。
- Repository：访问数据库。
- DTO：定义接口输入和输出。
- Entity：描述数据库实体。

不要把 SQL、业务判断和 HTTP 处理全部堆在 Controller 中。

## 10. 配置文件

`src/main/resources/application.yml`：

```yaml
server:
  port: 8080

spring:
  application:
    name: demo

app:
  welcome-message: 欢迎学习 Spring Boot
```

读取单个配置：

```java
@Value("${app.welcome-message}")
private String welcomeMessage;
```

配置较多时，优先使用类型安全的 `@ConfigurationProperties`：

```java
@ConfigurationProperties(prefix = "app")
public record AppProperties(String welcomeMessage) {
}
```

并通过 `@EnableConfigurationProperties(AppProperties.class)` 或配置属性扫描启用。

## 11. 多环境配置

常见文件：

```text
application.yml
application-dev.yml
application-test.yml
application-prod.yml
```

激活开发环境：

```yaml
spring:
  profiles:
    active: dev
```

生产环境的密码不应直接提交到 Git。可以通过环境变量提供：

```yaml
spring:
  datasource:
    password: ${DB_PASSWORD}
```

## 12. Bean 的默认作用域

Spring Bean 默认是单例，即容器中通常只有一个实例。不要在单例 Service 的字段中保存某个用户请求的临时状态，否则并发请求会相互影响。

方法内的局部变量通常是更安全的选择。

## 13. 第一个接口

```java
@RestController
@RequestMapping("/api/hello")
public class HelloController {
    @GetMapping
    public Map<String, String> hello() {
        return Map.of("message", "Hello Spring Boot");
    }
}
```

启动项目后访问：

```text
GET http://localhost:8080/api/hello
```

响应：

```json
{
  "message": "Hello Spring Boot"
}
```

Spring Boot 使用 Jackson 将 Java 对象自动转换为 JSON。

## 14. 本章检查

- [ ] 能解释 IoC、DI 和 Bean。
- [ ] 能说明 Spring Boot 与 Spring 的关系。
- [ ] 会使用构造器注入。
- [ ] 能区分 Controller、Service、Repository 的职责。
- [ ] 知道启动类为什么应放在根包。
- [ ] 能修改端口和读取自定义配置。
