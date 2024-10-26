<template>
  <div>
    <el-header class="header">
      <div class="tabs">
        <el-button 
          :type="activeTab === 'questions' ? 'primary' : 'default'" 
          @click="activeTab = 'questions'">
          问题点赞
        </el-button>
        <el-button 
          :type="activeTab === 'answers' ? 'primary' : 'default'" 
          @click="activeTab = 'answers'">
          回答点赞
        </el-button>
      </div>
    </el-header>

    <el-main>
      <el-table :data="activeLikes" style="width: 100%">
        <el-table-column prop="accountname" label="用户名" />
        <el-table-column prop="lcreateTime" label="点赞时间" />
      </el-table>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// 当前激活的选项卡（问题或回答）
const activeTab = ref<'questions' | 'answers'>('questions');

// 存储点赞数据
const questionLikes = ref([]);
const answerLikes = ref([]);

// 获取点赞数据
const fetchLikes = async (type: 'questions' | 'answers') => {
  const token = localStorage.getItem('token'); // 获取 token

  if (!token) {
    console.error('未检测到 Token，请先登录');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/v1/likes/${type}`, {
      headers: {
        Authorization:token, // 使用 token 进行授权
      },
    });

    if (response.status === 200) {
      if (type === 'questions') {
        questionLikes.value = response.data;
      } else {
        answerLikes.value = response.data;
      }
    }
  } catch (error) {
    console.error(`获取${type === 'questions' ? '问题' : '回答'}点赞失败`, error);
  }
};

// 根据选中的 Tab 返回相应的点赞列表
const activeLikes = computed(() => 
  activeTab.value === 'questions' ? questionLikes.value : answerLikes.value
);

// 页面加载时获取点赞数据
onMounted(() => {
  fetchLikes('questions');
  fetchLikes('answers');
});
</script>

<style scoped>
.header {
  background-color: #f5f5f5;
  padding: 10px;
  display: flex;
  justify-content: center;
}

.tabs {
  display: flex;
  gap: 10px;
}

.el-main {
  margin-top: 20px;
}
</style>
