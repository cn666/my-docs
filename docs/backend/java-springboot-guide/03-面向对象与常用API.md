# 03 面向对象与常用 API

## 1. 类与对象

类是模板，对象是根据模板创建的具体实例。

```java
public class User {
    private Long id;
    private String name;
    private int age;

    public User(Long id, String name, int age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    public void introduce() {
        System.out.println("我是" + name + "，今年" + age + "岁");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

创建并使用对象：

```java
User user = new User(1L, "小明", 20);
user.introduce();
user.setName("小李");
```

### 封装

字段通常声明为 `private`，外部通过方法访问。这样可以保护对象状态，并在修改时加入校验。

```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能小于 0");
    }
    this.age = age;
}
```

## 2. 构造方法与 this

构造方法与类同名，没有返回类型，在 `new` 对象时执行。`this` 表示当前对象。

如果没有编写任何构造方法，编译器会提供一个无参构造方法；一旦手写了构造方法，默认无参构造方法就不会自动生成。

## 3. static

`static` 成员属于类，而不是某一个对象：

```java
public class MathUtil {
    public static int max(int a, int b) {
        return a > b ? a : b;
    }
}

int value = MathUtil.max(3, 5);
```

工具方法常使用 `static`。业务对象不要为了调用方便而把所有内容都声明成 `static`。

## 4. 继承与多态

```java
public class Animal {
    public void speak() {
        System.out.println("动物发出声音");
    }
}

public class Dog extends Animal {
    @Override
    public void speak() {
        System.out.println("汪汪");
    }
}
```

```java
Animal animal = new Dog();
animal.speak(); // 汪汪
```

父类型变量指向子类对象，并在运行时执行子类实现，这就是多态的一种表现。

继承表达“是一个”的关系。不要为了复用几行代码建立不合理的继承层次，很多情况下组合更清晰。

## 5. 接口

接口定义能力或规则，不关心具体实现：

```java
public interface NotificationService {
    void send(String receiver, String message);
}
```

```java
public class EmailNotificationService implements NotificationService {
    @Override
    public void send(String receiver, String message) {
        System.out.println("向 " + receiver + " 发送邮件：" + message);
    }
}
```

面向接口编程能降低模块间耦合。Spring 的依赖注入经常与接口配合使用。

## 6. 抽象类与接口的简单区别

| 对比 | 抽象类 | 接口 |
| --- | --- | --- |
| 关系 | 通常表示同一类事物的基础类型 | 通常表示一种能力或契约 |
| 字段 | 可以有实例字段 | 主要定义常量和方法契约 |
| 构造方法 | 可以有 | 没有普通构造方法 |
| 继承数量 | 一个类只能继承一个类 | 一个类可以实现多个接口 |

入门阶段先记住：共享状态和基础实现可考虑抽象类；定义可替换的能力优先考虑接口。

## 7. 集合框架

### List：有顺序、可重复

```java
List<String> names = new ArrayList<>();
names.add("小明");
names.add("小红");
names.add("小明");

for (String name : names) {
    System.out.println(name);
}
```

### Set：元素不重复

```java
Set<String> tags = new HashSet<>();
tags.add("Java");
tags.add("Spring");
tags.add("Java");
```

### Map：键值对

```java
Map<Long, String> userNames = new HashMap<>();
userNames.put(1L, "小明");
userNames.put(2L, "小红");

String name = userNames.get(1L);
```

常用选择：

- 需要下标或保持插入顺序：`ArrayList`。
- 需要去重：`HashSet`。
- 需要通过唯一键快速查值：`HashMap`。

## 8. 泛型

`List<String>` 中的 `String` 就是泛型参数，它让编译器知道集合中应保存什么类型。

```java
public class ApiResult<T> {
    private T data;

    public ApiResult(T data) {
        this.data = data;
    }

    public T getData() {
        return data;
    }
}
```

使用：

```java
ApiResult<User> result = new ApiResult<>(user);
User data = result.getData();
```

## 9. 异常处理

异常表示程序运行中发生了非正常情况。

```java
try {
    int number = Integer.parseInt("abc");
    System.out.println(number);
} catch (NumberFormatException exception) {
    System.out.println("输入的不是合法整数");
} finally {
    System.out.println("无论是否异常都会执行");
}
```

抛出业务异常：

```java
if (user == null) {
    throw new IllegalArgumentException("用户不存在");
}
```

不要使用空的 `catch` 隐藏错误。至少应记录上下文，或将异常转换为调用方能理解的错误。

## 10. Optional

`Optional<T>` 表示结果可能存在，也可能不存在，常见于查询方法：

```java
Optional<User> optionalUser = findById(1L);
User user = optionalUser.orElseThrow(
        () -> new IllegalArgumentException("用户不存在")
);
```

不要把 `Optional` 当作所有字段和参数的默认类型。入门阶段主要理解其在方法返回值中的用法。

## 11. Lambda 与 Stream

```java
List<String> names = List.of("Tom", "Alice", "Bob");

List<String> result = names.stream()
        .filter(name -> name.length() >= 4)
        .map(String::toUpperCase)
        .sorted()
        .toList();
```

处理过程：获取流 → 过滤 → 转换 → 排序 → 收集结果。

Stream 适合表达数据处理过程，但复杂业务不要强行写成一条很长的调用链，可读性优先。

## 12. 时间 API

优先使用 `java.time`：

```java
LocalDate today = LocalDate.now();
LocalDateTime now = LocalDateTime.now();
LocalDate nextWeek = today.plusWeeks(1);

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String text = now.format(formatter);
```

涉及跨时区业务时，需要进一步学习 `Instant`、`ZoneId` 和 `ZonedDateTime`。

## 13. 本章练习

设计一个图书借阅小程序：

- `Book`：编号、书名、作者、是否已借出。
- `BookService` 接口：添加、借出、归还、查询全部图书。
- 使用 `ArrayList<Book>` 在内存中保存图书。
- 借出不存在或已经借出的图书时抛出异常。

## 14. 本章检查

- [ ] 能区分类、对象、接口和抽象类。
- [ ] 能解释封装、继承和多态。
- [ ] 会根据场景选择 List、Set、Map。
- [ ] 能使用泛型和异常处理。
- [ ] 能读懂简单 Lambda 与 Stream 代码。
