<template>
  <div class="post-container">
    <div v-if="!questions.length" class="empty-message">
      <p>目前还没有问题，期待你的提问！</p>
    </div>

    <div
      v-else
      v-for="(question, index) in paginatedQuestions"
      :key="index"
      class="post-card"
      @click="emitDetail(question.id)"
    >
      <div class="header">
        <div class="user-info">
          <img :src="question.avatar" class="avatar" />
          <div>
            <span class="username">{{ question.accountname || '匿名用户' }}</span>
            <span class="time">{{ formatTime(question.updateTime) }}</span>
          </div>
        </div>
      </div>

      <div class="content">
        <h3 class="title">{{ question.title }}</h3>
        <p class="question-content" v-html="question.content"></p>
      </div>

      <div class="footer">
        <span class="info">💬 {{ question.answers.length }} 条回复</span>
        <span class="info">👍 {{ question.questionLikeCount ?? 0 }} 个赞</span>
      </div>
    </div>

    <el-pagination
      v-model:current-page="page"
      :page-size="size"
      :total="total"
      @current-change="fetchQuestions"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';

const props = defineProps({
  questions: Array,
});

const emit = defineEmits(['detail']);
const page = ref(1);
const size = ref(5);
const total = computed(() => props.questions.length); // 总条目数

// 分页后的问题列表
const paginatedQuestions = computed(() => {
  const start = (page.value - 1) * size.value;
  return props.questions.slice(start, start + size.value);
});

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN', { hour12: false });
};

const emitDetail = (id: number) => {
  emit('detail', id);
};
</script>

<style scoped>
/* 布局容器 */
.post-container {
  width: 60%;
  margin: 0 auto;
  padding-top: 20px;
}

/* 提示信息 */
.empty-message {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 50px;
}

/* 单个帖子卡片 */
.post-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, background-color 0.3s;
  cursor: pointer;
}
.post-card:hover {
  background-color: #f9f9f9;
  transform: scale(1.02);
}

/* 头部：用户信息 */
.header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-weight: bold;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

/* 内容部分 */
.content {
  margin-top: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px;
}

.question-content {
  font-size: 15px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  max-height: 40px;
}

/* 底部：回复数和点赞数 */
.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.info {
  margin-right: 10px;
  color: #888;
}
</style>
