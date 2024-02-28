<script lang="ts" setup>
import { onMounted, ref } from 'vue';
const keepLiveData = ref<string[]>([]);
onMounted(() => {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    window.microApp.addDataListener(({ type, payload }) => {
      // @ts-ignore
      if (type === 'KEEP_ALIVE_NAMES') {
        keepLiveData.value = payload;
      }
    });
  }
});
</script>

<script lang="ts">
export default {
  name: 'Home'
};
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="keepLiveData">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style lang="less" scoped></style>
