<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
</script>

<template>
  <a-config-provider :locale="zhCN">
    <template #renderEmpty>
      <a-empty />
    </template>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </a-config-provider>
</template>

<style lang="less">
@import '@kt/unity-antd-theme/src/g.less';
@import '@/assets/css/g.less';
</style>
