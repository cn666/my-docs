# 06 REST 接口开发

## 1. HTTP 与 REST 基础

一个 HTTP 请求通常包含：

- 请求方法：GET、POST、PUT、PATCH、DELETE。
- URL：要访问的资源地址。
- Header：认证信息、内容类型等元数据。
- Body：POST、PUT、PATCH 常携带的请求数据。

常见方法约定：

| 操作 | 方法 | URL 示例 |
| --- | --- | --- |
| 查询列表 | GET | `/api/users` |
| 查询单个 | GET | `/api/users/1` |
| 新增 | POST | `/api/users` |
| 完整修改 | PUT | `/api/users/1` |
| 部分修改 | PATCH | `/api/users/1` |
| 删除 | DELETE | `/api/users/1` |

URL 尽量使用名词表示资源，不使用 `/getUsers`、`/deleteUser` 这类动词式命名。

## 2. Controller 常用注解

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
}
```

常用参数来源：

```java
@GetMapping("/{id}")
public UserResponse getById(@PathVariable Long id) {
    // id 来自 URL 路径
}

@GetMapping
public List<UserResponse> list(@RequestParam(defaultValue = "0") int page) {
    // page 来自查询参数 ?page=0
}

@PostMapping
public UserResponse create(@RequestBody CreateUserRequest request) {
    // request 来自 JSON 请求体
}
```

## 3. 不要直接用 Entity 接口传输

DTO（Data Transfer Object）用于定义接口输入和输出：

```java
public record CreateUserRequest(
        String name,
        String email
) {
}
```

```java
public record UserResponse(
        Long id,
        String name,
        String email
) {
}
```

分离 DTO 和 Entity 的好处：

- 避免把密码、内部状态等字段意外返回。
- 接口结构不必完全跟随数据库表变化。
- 可以针对不同接口设计不同校验规则。
- 避免客户端直接修改不允许修改的字段。

## 4. 参数校验

在 Maven 中加入 Validation Starter 后，可以使用 Jakarta Validation：

```java
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "姓名不能为空")
        @Size(max = 50, message = "姓名不能超过 50 个字符")
        String name,

        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        String email
) {
}
```

Controller 参数添加 `@Valid`：

```java
@PostMapping
public ResponseEntity<UserResponse> create(
        @Valid @RequestBody CreateUserRequest request
) {
    UserResponse response = userService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

只声明校验注解但忘记写 `@Valid`，校验通常不会自动执行。

## 5. HTTP 状态码

| 状态码 | 含义 | 常见场景 |
| --- | --- | --- |
| 200 | 成功 | 查询、修改成功 |
| 201 | 已创建 | 新增成功 |
| 204 | 成功但无响应体 | 删除成功 |
| 400 | 请求不合法 | 参数校验失败 |
| 401 | 未认证 | 没有有效登录凭证 |
| 403 | 无权限 | 已认证但不允许操作 |
| 404 | 资源不存在 | 用户 ID 不存在 |
| 409 | 状态冲突 | 邮箱重复、重复提交 |
| 500 | 服务器内部错误 | 未处理的程序错误 |

`ResponseEntity` 可以精确控制状态码、Header 和响应体。

## 6. 一个内存版 CRUD 示例

### Service

```java
@Service
public class UserService {
    private final Map<Long, UserResponse> users = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong();

    public List<UserResponse> findAll() {
        return users.values().stream()
                .sorted(Comparator.comparing(UserResponse::id))
                .toList();
    }

    public UserResponse findById(Long id) {
        UserResponse user = users.get(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户不存在：" + id);
        }
        return user;
    }

    public UserResponse create(CreateUserRequest request) {
        long id = idGenerator.incrementAndGet();
        UserResponse user = new UserResponse(id, request.name(), request.email());
        users.put(id, user);
        return user;
    }

    public void delete(Long id) {
        if (users.remove(id) == null) {
            throw new ResourceNotFoundException("用户不存在：" + id);
        }
    }
}
```

### Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public UserResponse findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(
            @Valid @RequestBody CreateUserRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## 7. 自定义异常

```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

业务代码抛出有意义的异常，统一异常处理器负责转换为 HTTP 响应。

## 8. 统一异常处理

错误响应结构：

```java
public record ErrorResponse(
        String code,
        String message,
        LocalDateTime timestamp
) {
}
```

处理器：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException exception
    ) {
        ErrorResponse body = new ErrorResponse(
                "RESOURCE_NOT_FOUND",
                exception.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        ErrorResponse body = new ErrorResponse(
                "VALIDATION_FAILED",
                message,
                LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(body);
    }
}
```

不要把异常堆栈直接返回给客户端。堆栈用于服务器日志，客户端需要稳定、安全、可理解的错误结构。

## 9. 分页与排序

列表数据量可能很大，接口应支持分页：

```text
GET /api/users?page=0&size=20&sort=createdAt,desc
```

需要限制 `size` 的最大值，避免客户端一次请求过多数据。Spring Data 的 `Pageable` 能简化分页处理，下一章会继续使用。

## 10. 接口测试示例

可以创建 `requests.http`：

```http
### 创建用户
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "name": "小明",
  "email": "xiaoming@example.com"
}

### 查询列表
GET http://localhost:8080/api/users

### 查询单个
GET http://localhost:8080/api/users/1

### 删除
DELETE http://localhost:8080/api/users/1
```

至少测试：正常请求、缺少字段、格式错误、资源不存在和重复数据。

## 11. Controller 测试的基本思路

使用 MockMvc 可以在不真正监听端口的情况下测试 HTTP 行为：

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldRejectBlankName() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"", "email":"test@example.com"}
                                """))
                .andExpect(status().isBadRequest());
    }
}
```

不同 Spring Boot 版本的测试替身注解可能有所调整，使用时以项目当前版本文档为准。

## 12. 本章检查

- [ ] 能根据 CRUD 操作选择 HTTP 方法和 URL。
- [ ] 能区分 `@PathVariable`、`@RequestParam`、`@RequestBody`。
- [ ] 会使用 DTO 和参数校验。
- [ ] 会返回恰当的 HTTP 状态码。
- [ ] 会设计统一错误响应并集中处理异常。
