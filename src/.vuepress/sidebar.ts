import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    {
      text: '首页',
      link: '/',
      icon: 'home',
    },
    {
      text: '留言板',
      link: '/comment',
      icon: 'comments',
    },
    {
      text: '关于',
      link: '/about',
      icon: 'circle-info',
    },
    {
      text: '归档',
      link: '/archives',
      icon: 'book',
    },
  ],
});
