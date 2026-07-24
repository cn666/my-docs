import { defineConfig } from 'vitepress'

export default defineConfig({
  // ========== 站点基本信息 ==========
  title: "知识库",           // 站点标题，显示在浏览器标签页和导航栏
  description: "个人学习笔记与知识点记录",  // 站点描述，用于 SEO

  // ========== 主题配置 ==========
  themeConfig: {
    logo: '/images/logo.svg',
    // ---------- 顶部导航栏 ----------
    // 显示在页面最上方的导航链接
    // text: 显示的文字
    // link: 点击后跳转的路径（对应 docs 目录下的 .md 文件）
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/frontend/javascript' },
      { text: '后端', link: '/backend/java' },
      { text: '运维', link: '/devops/linux' },
      { text: '教程', link: '/tutorial/vitePress'},
      { text: 'AI', link: '/ai/codex-and-claude' }
    ],

    // ---------- 左侧侧边栏 ----------
    // 根据 URL 路径前缀显示不同的侧边栏
    // 比如访问 /frontend/xxx 时，显示前端相关的侧边栏
    sidebar: {
      // 当 URL 以 /frontend/ 开头时，显示这个侧边栏
      '/frontend/': [
        {
          text: '前端技术',       // 分组标题
          items: [               // 分组下的链接列表
            { text: 'JavaScript', link: '/frontend/javascript' },
            { text: 'CSS', link: '/frontend/css' },
            { text: 'Vue.js', link: '/frontend/vue' },
            { text: 'markdown', link: '/frontend/markdown' },
          ]
        }
      ],
      // 当 URL 以 /backend/ 开头时，显示这个侧边栏
      '/backend/': [
        {
          text: '后端技术',
          items: [
            { text: 'Java', link: '/backend/java' }
          ]
        },
        {
          text: 'Java SpringBoot 完整教程',
          items: [
            { text: '课程介绍', link: '/backend/java-springboot-guide/' },
            { text: '01-开发环境与第一个Java程序', link: '/backend/java-springboot-guide/01-开发环境与第一个Java程序' },
            { text: '02-Java语法基础', link: '/backend/java-springboot-guide/02-Java语法基础' },
            { text: '03-面向对象与常用API', link: '/backend/java-springboot-guide/03-面向对象与常用API' },
            { text: '04-Maven-Git与测试基础', link: '/backend/java-springboot-guide/04-Maven-Git与测试基础' },
            { text: '05-Spring与SpringBoot核心概念', link: '/backend/java-springboot-guide/05-Spring与SpringBoot核心概念' },
            { text: '06-REST接口开发', link: '/backend/java-springboot-guide/06-REST接口开发' },
            { text: '07-数据库与SpringDataJPA', link: '/backend/java-springboot-guide/07-数据库与SpringDataJPA' },
            { text: '08-待办事项项目实战', link: '/backend/java-springboot-guide/08-待办事项项目实战' },
            { text: '09-调试排错与后续路线', link: '/backend/java-springboot-guide/09-调试排错与后续路线' }
          ]
        }
      ],
      // 当 URL 以 /devops/ 开头时，显示这个侧边栏
      '/devops/': [
        {
          text: '运维知识',
          items: [
            { text: 'Linux', link: '/devops/linux' },
            { text: 'Docker', link: '/devops/docker' }
          ]
        }
      ],
      '/tutorial/': [
        {
          text: '教程',
          items: [
            { text: 'vitePress', link: '/tutorial/vitePress' },
          ]
        }
      ],
      '/ai/': [
        {
          text: 'AI 工具',
          items: [
            { text: 'Codex & Claude 入门', link: '/ai/codex-and-claude' },
            { text: 'CC Switch', link: '/ai/cc-switch' },
            { text: 'Agent全栈工程师学习计划', link: '/ai/Agent全栈工程师学习计划' }
          ]
        }
      ]
    },

    // ---------- 社交链接 ----------
    // 显示在导航栏右侧的图标链接（可选，不需要可以删除）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cn666' }
    ],

    // ---------- 搜索功能 ----------
    // 使用本地搜索，不需要额外配置第三方服务
    search: {
      provider: 'local'
    },

    // ---------- 中文化 ----------
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    outlineTitle: '本页目录',
    lastUpdatedText: '最后更新于',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '深色模式'
  }
})
