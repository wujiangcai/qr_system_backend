<template>
  <el-container class="not-found">
    <h2>页面未找到 (404)</h2>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </el-container>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
