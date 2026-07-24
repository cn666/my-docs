# 07 数据库与 Spring Data JPA

## 1. 从内存存储到数据库

上一章使用 `Map` 保存数据，应用重启后数据会消失，也不适合多实例部署。关系型数据库可以持久保存数据，并通过事务、索引和约束保证数据质量。

基础 SQL 操作：

```sql
INSERT INTO users(name, email) VALUES ('小明', 'xiaoming@example.com');

SELECT id, name, email FROM users WHERE id = 1;

UPDATE users SET name = '小李' WHERE id = 1;

DELETE FROM users WHERE id = 1;
```

学习 JPA 不能完全跳过 SQL。遇到性能和数据问题时，最终仍然需要理解生成的 SQL。

## 2. JDBC、JPA、Hibernate、Spring Data JPA

| 名称 | 简单理解 |
| --- | --- |
| JDBC | Java 访问关系型数据库的底层标准 API |
| JPA | Java ORM 的规范，定义注解和接口 |
| Hibernate | 常见 JPA 实现 |
| Spring Data JPA | 在 JPA 上进一步简化 Repository 开发 |

ORM 把 Java 对象与数据库表进行映射，但它不是数据库的替代品。

## 3. 添加依赖

使用 Spring Initializr 创建项目时选择：

- Spring Data JPA
- H2 Database，或 MySQL Driver

对应 Maven 依赖大致如下：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 4. 使用 H2 快速入门

`application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:demo
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
```

- `mem` 表示内存数据库，应用停止后数据消失。
- `create-drop` 适合临时练习，不能用于生产环境。
- H2 控制台地址通常为 `/h2-console`。

## 5. 定义实体 Entity

```java
package com.example.demo.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    protected User() {
        // JPA 使用
    }

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public void changeName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
```

关键点：

- Spring Boot 3.x 使用 `jakarta.persistence.*`。
- 每个实体需要 `@Id`。
- JPA 实体需要无参构造方法，可以设为 `protected`。
- 数据库唯一约束是最后一道防线，不能只在 Java 代码中判断重复。

## 6. Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String keyword);
}
```

继承 `JpaRepository<User, Long>` 后会获得：

- `save`
- `findById`
- `findAll`
- `deleteById`
- `count`
- 分页和排序相关方法

Spring Data 可以根据方法名生成查询。复杂查询应考虑 `@Query`、Specification、QueryDSL 或专门的查询层，不要无限拉长方法名。

## 7. Service 与 DTO 转换

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在：" + id));
        return toResponse(user);
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("邮箱已经存在");
        }

        User user = new User(request.name(), request.email());
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
```

DTO 转换代码变多后，可以提取单独的 Mapper。入门阶段手写映射更有助于理解数据流。

## 8. 事务 @Transactional

事务确保一组数据库操作要么全部成功，要么全部回滚。

例如转账包含扣款和加款：

```java
@Transactional
public void transfer(Long fromId, Long toId, BigDecimal amount) {
    Account from = findAccount(fromId);
    Account to = findAccount(toId);

    from.withdraw(amount);
    to.deposit(amount);
}
```

如果加款失败，扣款也应回滚。

常见原则：

- `@Transactional` 通常放在 Service 的公共方法上。
- 查询方法可使用 `readOnly = true`。
- 默认情况下，运行时异常会触发回滚。
- 同一个类中一个方法直接调用另一个事务方法，可能不会经过 Spring 代理。
- 不要在长事务中执行耗时网络调用。

## 9. 分页查询

```java
@Transactional(readOnly = true)
public Page<UserResponse> findAll(Pageable pageable) {
    return userRepository.findAll(pageable).map(this::toResponse);
}
```

Controller：

```java
@GetMapping
public Page<UserResponse> findAll(
        @PageableDefault(size = 20, sort = "id") Pageable pageable
) {
    return userService.findAll(pageable);
}
```

生产接口常会自定义分页响应 DTO，避免把框架内部结构完全暴露给客户端。

## 10. 连接 MySQL

依赖：

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

开发环境配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: demo_user
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
```

不要在生产环境使用 `ddl-auto: create` 或 `create-drop`，否则可能丢失数据。推荐使用 Flyway 或 Liquibase 管理数据库变更。

## 11. 数据库迁移

以 Flyway 为例，迁移脚本通常放在：

```text
src/main/resources/db/migration/
├── V1__create_user_table.sql
└── V2__add_user_status.sql
```

`V1__create_user_table.sql`：

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email)
);
```

已经在公共环境执行过的迁移脚本不要直接修改，应新增下一版本脚本。

## 12. 关联关系先掌握原则

JPA 支持一对一、一对多和多对多，但关联映射容易引入复杂度。入门阶段先掌握：

- 外键应由数据库约束。
- 默认不要随意使用 EAGER 加载。
- 序列化 Entity 可能触发懒加载或循环引用，因此接口返回 DTO。
- 查询列表时关注 N+1 问题：一次主查询后，又为每行执行额外查询。
- 多对多业务常需要显式中间实体，例如 `UserRole`。

## 13. 索引与唯一约束

- 主键通常自带索引。
- 经常用于查询、排序、关联的字段可能需要索引。
- 索引会增加写入和存储成本，不是越多越好。
- 唯一约束用于保证业务唯一性，例如用户邮箱。

应用层先检查重复可以提供友好提示，但并发情况下仍必须依赖数据库唯一约束，并处理约束冲突异常。

## 14. 本章检查

- [ ] 能解释 JDBC、JPA、Hibernate 和 Spring Data JPA 的关系。
- [ ] 能定义 Entity 和 Repository。
- [ ] 会使用 DTO，避免直接返回 Entity。
- [ ] 能说明事务的作用和常见边界。
- [ ] 会配置 H2 和 MySQL。
- [ ] 知道生产数据库为什么需要迁移工具。
