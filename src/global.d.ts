declare module '@kt/request' {
  interface RequestCustomMethods {
    get2;
    upload;
  }
  interface StrategiesCustomType {
    FOO;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 标题
     */
    title?: string;
    /**
     * 是否会被嵌套在基座的 tag 下
     */
    tag?: boolean;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * 全局 css 前缀
     */
    $prefix: string;
  }
}

export {};
