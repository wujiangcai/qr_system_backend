<!-- src/components/LikeList.vue -->
<template>
  <div>
    <h3 v-if="likes.length === 0">暂无数据</h3>
    <ul v-else>
      <li v-for="like in likes" :key="like.likeId">
        <img :src="like.user.avatar" alt="avatar" class="avatar" />
        <span>{{ like.user.username }} ({{ like.user.accountname }})</span>
        <span>点赞时间: {{ formatDate(like.lcreateTime) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  likes: Array<{
    likeId: number;
    user: { username: string; avatar: string; accountname: string };
    lcreateTime: string;
  }>;
}>();

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString();
</script>

<style scoped>
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
