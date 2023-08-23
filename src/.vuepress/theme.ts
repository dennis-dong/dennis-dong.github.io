import { hopeTheme } from 'vuepress-theme-hope';
import navbar from './navbar.js';
import { getDirname, path } from '@vuepress/utils';
const __dirname = getDirname(import.meta.url);

export default hopeTheme({
  hostname: 'https://www.dennisdong.top',
  author: {
    name: 'Dennis',
    url: 'https://www.dennisdong.top',
  },
  iconAssets: 'fontawesome-with-brands',
  logo: '/assets/imgs/logo.jpg',
  // fullscreen: true,
  repo: 'dennis-dong/dennis-dong.github.io',
  repoDisplay: false,
  docsDir: 'src',
  // navbar
  navbar,
  // sidebar
  sidebar: 'structure',
  sidebarSorter: ['order'],
  pageInfo: ['Author', 'Date', 'Original', 'PageView', 'Word', 'ReadingTime', 'Category'],
  copyright: '2020 - 至今 © Dennis',
  footer: '世间所有的相遇,都是久别重逢',
  displayFooter: true,

  // 博客设置
  blog: {
    name: 'Dennis',
    description: '',
    avatar: '/assets/imgs/avatar.jpg',
    roundAvatar: true,
    // intro: '/about',
    medias: {
      GitHub: 'https://github.com/dennis-dong',
      Gitee: 'https://gitee.com/dennisdong',
      CnBlogs: ['https://www.cnblogs.com/dennisdong', path.resolve(__dirname, 'public/assets/imgs/cnblogs.svg')],
    },
    articleInfo: ['Author', 'Date', 'Original', 'PageView', 'Word', 'ReadingTime', 'Category'],
  },
  encrypt: {
    config: {},
  },
  // page meta
  metaLocales: {
    editLink: '在 GitHub 上编辑此页',
  },
  plugins: {
    blog: true,
    comment: {
      // You should generate and use your own comment service
      provider: 'Waline',
      serverURL: 'https://waline.dennisdong.top',
    },
    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ['ts', 'vue'],
      },
      presentation: ['highlight', 'math', 'search', 'notes', 'zoom'],
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em')
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended',
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },

    // uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
