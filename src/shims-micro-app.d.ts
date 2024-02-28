/**
 * 针对子应用的 micro-app ts 兼容
 */
interface EventCenterType {
  /**
   * 子->父
   *
   * 高亮基座的菜单
   */
  SELECT;

  /**
   * 父->子（全局）
   *
   * 全局方法或属性
   */
  BASE_OPTIONS;

  /**
   * 父->子
   *
   * 子应用被开启了 keep-alive，当它隐藏的时候为 true，反之
   */
  AFTER_HIDDEN;

  /**
   * 父->子
   *
   * 基座交给子应用，让子应用控制路由跳转
   */
  CHILD_SKIP;

  /**
   * 父->子
   *
   * 添加一个 tag，通知子应用需要进行缓存
   */
  ADD_TAG;

  /**
   * 父->子
   *
   * 删除一个 tag，通知子应用需要移除缓存
   */
  CLOSE_TAG;
}
interface Window {
  microApp: {
    dispatch(p: { type: keyof EventCenterType; payload: any }): void;
    addDataListener(
      cb: (p: { type: keyof EventCenterType; payload: any }) => void,
      autoTrigger?: boolean
    ): void;
    addGlobalDataListener(
      cb: (p: { type: keyof EventCenterType; payload: any }) => void,
      autoTrigger?: boolean
    ): void;
  };
  __MICRO_APP_BASE_ROUTE__: string;
  __MICRO_APP_NAME__: string;
  __MICRO_APP_ENVIRONMENT__: string;
}
