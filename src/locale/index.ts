import { createI18n } from 'vue-i18n';

import zhcn from './lang/zh_CN';
import enus from './lang/en_US';
// import { LANG } from '@/utils/storageKey';

/*
  根据浏览器系统语言设置语言，如果有存在本地localStorage 则读取，
  如果没有则默认为简体中文
*/
const navLang = navigator.language;
// 先判断本地有没有存储当前语言
// const lang = localStorage.getItem(LANG) || 'zh-CN';
const lang = 'zh_CN';
// const lang = 'en-us';
const messages = {
  zh_CN: zhcn,
  en_US: enus
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: lang,
  messages,
  fallbackLocale: 'zh-CN',
  missing() {
    return '';
  }
});

export default i18n;
