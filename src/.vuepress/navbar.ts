import { navbar } from 'vuepress-theme-hope';

export default navbar([
  {
    text: '首页',
    link: '/',
    icon: 'home',
  },
  {
    text: '留言板',
    link: '/comment/',
    icon: 'comment-dots',
  },
  {
    text: '关于本站',
    link: '/about/',
    icon: 'circle-info',
  },
  {
    text: '归档',
    link: '/archives/',
    icon: 'book',
  },
]);
