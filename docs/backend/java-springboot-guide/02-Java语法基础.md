# 02 Java 语法基础

## 1. 变量与数据类型

变量用于保存程序运行中的数据。

```java
int age = 20;
long userId = 10001L;
double price = 19.9;
boolean enabled = true;
char level = 'A';
String name = "小明";
```

Java 常用基本类型：

| 类型 | 示例 | 说明 |
| --- | --- | --- |
| `byte` | `byte n = 10;` | 小整数 |
| `short` | `short n = 100;` | 较小整数 |
| `int` | `int n = 1000;` | 最常用整数 |
| `long` | `long n = 1000L;` | 大整数 |
| `float` | `float n = 1.5F;` | 单精度小数 |
| `double` | `double n = 1.5;` | 最常用小数 |
| `char` | `char c = 'A';` | 单个字符，使用单引号 |
| `boolean` | `boolean ok = true;` | `true` 或 `false` |

`String` 是引用类型，不属于八种基本类型。

### 类型转换

```java
int count = 10;
double total = count;       // 自动转换

double price = 19.8;
int rounded = (int) price;  // 强制转换，结果为 19
```

强制转换可能丢失精度或溢出，使用前要确认数据范围。

## 2. 常量

使用 `final` 表示变量只能赋值一次：

```java
final double TAX_RATE = 0.06;
```

常量名通常使用全大写单词和下划线。

## 3. 运算符

```java
int a = 10;
int b = 3;

System.out.println(a + b); // 13
System.out.println(a - b); // 7
System.out.println(a * b); // 30
System.out.println(a / b); // 3，整数除法
System.out.println(a % b); // 1，余数
```

常用比较和逻辑运算符：

```java
age >= 18
score == 100
name != null
enabled && age >= 18
isAdmin || isOwner
!enabled
```

比较字符串内容应使用 `equals`，不要使用 `==`：

```java
String role = "admin";
if ("admin".equals(role)) {
    System.out.println("管理员");
}
```

`==` 对引用类型通常比较是否指向同一个对象；`equals` 通常比较对象内容。

## 4. 条件判断

```java
int score = 85;

if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("需要继续努力");
}
```

`switch` 适合根据一个值匹配多个固定分支：

```java
String dayType = switch (day) {
    case 1, 2, 3, 4, 5 -> "工作日";
    case 6, 7 -> "周末";
    default -> "无效日期";
};
```

## 5. 循环

### for 循环

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

### while 循环

```java
int count = 3;
while (count > 0) {
    System.out.println(count);
    count--;
}
```

### 增强 for 循环

```java
String[] names = {"小明", "小红", "小刚"};
for (String name : names) {
    System.out.println(name);
}
```

- `break`：立即结束整个循环。
- `continue`：跳过本次循环，继续下一次。

## 6. 数组

数组长度固定，并且元素类型相同：

```java
int[] scores = {90, 80, 75};
System.out.println(scores[0]);
System.out.println(scores.length);
```

数组下标从 `0` 开始。访问不存在的下标会抛出 `ArrayIndexOutOfBoundsException`。

## 7. 方法

方法把一段逻辑封装起来，以便复用和测试。

```java
public static int add(int a, int b) {
    return a + b;
}
```

调用：

```java
int result = add(3, 5);
System.out.println(result);
```

方法签名主要由方法名和参数列表构成。同一个类中可以定义同名但参数不同的方法，这叫方法重载：

```java
public static int add(int a, int b) {
    return a + b;
}

public static double add(double a, double b) {
    return a + b;
}
```

## 8. String 常用操作

```java
String text = "  Spring Boot  ";

System.out.println(text.length());
System.out.println(text.trim());
System.out.println(text.toLowerCase());
System.out.println(text.contains("Boot"));
System.out.println(text.replace("Boot", "Framework"));
```

字符串不可变。上面的方法通常返回新字符串，不会修改原字符串。

字符串拼接较少时可以使用 `+`，循环中大量拼接应使用 `StringBuilder`：

```java
StringBuilder builder = new StringBuilder();
builder.append("Java");
builder.append(" + ");
builder.append("Spring Boot");
String result = builder.toString();
```

## 9. 空值 null

`null` 表示引用没有指向对象：

```java
String name = null;
```

直接调用 `name.length()` 会产生 `NullPointerException`。可以先判断：

```java
if (name != null && !name.isBlank()) {
    System.out.println(name.length());
}
```

## 10. 综合练习：计算平均分

编写方法接收一个 `int[]`，计算平均分，并输出等级：

- 平均分大于等于 90：优秀
- 大于等于 60：及格
- 其他：需要继续努力

参考实现：

```java
public static double average(int[] scores) {
    if (scores == null || scores.length == 0) {
        return 0;
    }

    int total = 0;
    for (int score : scores) {
        total += score;
    }
    return (double) total / scores.length;
}
```

## 11. 本章检查

- [ ] 能区分基本类型与引用类型。
- [ ] 能正确比较字符串内容。
- [ ] 能使用判断、循环、数组和方法。
- [ ] 知道整数除法和强制类型转换的影响。
- [ ] 知道 `null` 为什么可能导致异常。
