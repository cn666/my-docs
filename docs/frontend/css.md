# CSS 笔记

## Flexbox 弹性布局

Flex 是目前最常用的 CSS 布局方式之一，擅长处理一维布局（一行或一列）。

### 基本概念

```css
.container {
  display: flex;          /* 开启 flex 布局 */
}
.container {
  display: flex;

  /* 主轴方向 */
  flex-direction: row;            /* 横向排列（默认） */
  flex-direction: column;         /* 纵向排列 */

  /* 主轴对齐方式 */
  justify-content: flex-start;    /* 左对齐（默认） */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐，中间等距 */
  justify-content: space-around;  /* 每个元素两侧等距 */

  /* 交叉轴对齐方式 */
  align-items: stretch;           /* 拉伸填满（默认） */
  align-items: center;            /* 居中 */
  align-items: flex-start;        /* 顶部对齐 */
  align-items: flex-end;          /* 底部对齐 */

  /* 是否换行 */
  flex-wrap: nowrap;              /* 不换行（默认） */
  flex-wrap: wrap;                /* 换行 */
}
```

### 经典场景：水平垂直居中

```css
.container {
  display: flex;
  justify-content: center;   /* 水平居中 */
  align-items: center;       /* 垂直居中 */
  height: 100vh;             /* 让容器占满整个视口高度 */
}
```

