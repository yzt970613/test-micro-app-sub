<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps(['path']);
router.replace(props.path);
</script>
<template>{{ '' }}</template>
