# JavaScript 笔记

## 数据类型

JavaScript 有 8 种数据类型：

### 基本类型（7种）

| 类型 | 说明 | 示例 |
|------|------|------|
| `string` | 字符串 | `'hello'`、`"world"` |
| `number` | 数字 | `42`、`3.14` |
| `boolean` | 布尔值 | `true`、`false` |
| `null` | 空值 | `null` |
| `undefined` | 未定义 | `undefined` |
| `symbol` | 符号（ES6） | `Symbol('id')` |
| `bigint` | 大整数（ES2020） | `9007199254740991n` |

### 引用类型（1种）

- `object` — 对象（包括普通对象、数组、函数、日期等）

## 变量声明

```js
// let — 块级作用域，可以重新赋值（推荐使用）
let name = '张三'
name = '李四' // ✅ 可以重新赋值

// const — 块级作用域，不可重新赋值（推荐用于常量）
const age = 18
// age = 19 // ❌ 报错！不能重新赋值

// var — 函数作用域（不推荐使用，有变量提升问题）
var old = true
