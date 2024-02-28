import { App, watch } from 'vue';
import router from './router';
// import { useRoutesCacheStore } from './stores/routesCache';

/**
 * https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/framework/vue?id=_2%e3%80%81%e5%bd%93%e5%9f%ba%e5%ba%a7%e5%92%8c%e5%ad%90%e5%ba%94%e7%94%a8%e9%83%bd%e6%98%afvue-router4%ef%bc%8c%e7%82%b9%e5%87%bb%e6%b5%8f%e8%a7%88%e5%99%a8%e8%bf%94%e5%9b%9e%e6%8c%89%e9%92%ae%e9%a1%b5%e9%9d%a2%e4%b8%a2%e5%a4%b1 ✨
 */
const fixBugForVueRouter4 = () => {
  let afterhidden = false;
  window.microApp.addDataListener(({ type, payload }) => {
    if (type === 'AFTER_HIDDEN') afterhidden = payload;
  });

  // 如果__MICRO_APP_BASE_ROUTE__为 `/基座应用基础路由/子应用基础路由/`，则应去掉`/基座应用基础路由`
  // 如果对这句话不理解，可以参考案例：https://github.com/micro-zoe/micro-app-demo

  // const realBaseRoute = window.__MICRO_APP_BASE_ROUTE__;
  const realBaseRoute = `/${window.__MICRO_APP_NAME__}`;

  router.beforeEach(() => {
    if (afterhidden) return;
    if (typeof window.history.state?.current === 'string') {
      window.history.state.current = window.history.state.current.replace(
        new RegExp(realBaseRoute, 'g'),
        ''
      );
    }
  });

  router.afterEach(() => {
    if (afterhidden) return;
    if (typeof window.history.state === 'object') {
      window.history.state.current =
        realBaseRoute + (window.history.state.current || '');
    }
  });

  /**
   * app 路由监听返回的时候，如果在 app 返回，那么就会触发 app 的路由change，上发 SELECT 事件来触发基座高亮菜单
   */
  watch(
    () => router.currentRoute.value.path,
    (path: string) => {
      // 被隐藏就不再上发事件
      if (afterhidden) return;
      window.microApp.dispatch({
        type: 'SELECT',
        payload: window.__MICRO_APP_NAME__
      });
    }
  );
};

export default function microAppConfig(app: App) {
  // 外部需要判断是否在微应用环境
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // vueRouter4 相关修复
    fixBugForVueRouter4();

    // 子应用监听卸载操作
    window.addEventListener('unmount', () => {
      app.unmount();
    });

    /**
     * 页面跳转
     */
    window.microApp.addDataListener(({ type, payload: path }) => {
      if (type === 'CHILD_SKIP' && path) {
        const APP_NAME = window.__MICRO_APP_NAME__;
        path = path.replace(`/${APP_NAME}`, '');
        !path && (path = '/'); // 防止地址为空
        if (path !== router.currentRoute.value.path) {
          router.replace(path);
        }
      }
    });

    /**
     * 监听 keep-alive 模式下的应用状态
     */
    window.addEventListener('appstate-change', (e: any) => {
      if (e.detail.appState === 'afterhidden') {
        // console.log('已卸载');
      } else if (e.detail.appState === 'beforeshow') {
        // https://github.com/micro-zoe/micro-app/blob/v0.8.5/docs/zh-cn/keep-alive.md#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98
        const search = e.currentTarget.location.search;
        let path = e.currentTarget.location.pathname;
        // @ts-ignore
        const realBaseRoute = window.__MICRO_APP_BASE_ROUTE__;
        path = path.replace(realBaseRoute, '');
        // 防止地址为空
        !path && (path = '/');

        // ❌
        // router.replace(`${path}${search}`);

        // ✅ 这里需要跳转一次中转页，具体原因待描述...
        router.replace({
          name: 'MATransfer',
          params: { path: `${path}${search}` }
        });
      } else if (e.detail.appState === 'aftershow') {
        // console.log('已经重新渲染');
      }
    });

    /**
     * 监听当前子应用对应的 tag 状态
     */
    // window.microApp.addDataListener(({ type, payload: path }) => {
    //   if (type === 'CLOSE_TAG') {
    //     // ❌ 舍弃：使用这种方式 通过 vue-tool 会看到路由还是会被缓存
    //     // const route = routes.find(item => item.path === path);
    //     // if (route) {
    //     //   route.meta.keepAlive = false;
    //     // }

    //     // ✅ 缓存到全局，使用 keep-alive 的 includes 动态增删
    //     const routesCache = useRoutesCacheStore();
    //     routesCache.removeByPath(path);
    //   } else if (type === 'ADD_TAG') {
    //     const routesCache = useRoutesCacheStore();
    //     routesCache.addByPath(path);
    //   }
    // }, true);
  }
}
