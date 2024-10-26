<script setup lang="ts">
import Index from './views/Home.vue';
import Notifications from './views/Notifications.vue';

</script>

<template>
 <div id="app">
    <!-- 导航栏等全局组件可以放在这里 -->
    <router-view />  <!-- 根据当前路由动态渲染页面 -->
  </div>
</template>

<style scoped>
 #app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}
</style>
