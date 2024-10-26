<template>
  <el-container class="main-container">
    <el-header class="header">
      <Header />
    </el-header>

    <el-main>
      <!-- 查询功能 -->
      <div class="query-container">
        <el-input
          v-model="query"
          placeholder="输入关键词查询问题"
          class="query-input"
          clearable
        />
        <el-button
          type="primary"
          @click="searchQuestions"
          class="query-button"
        >
          查询
        </el-button>
        <el-button
          type="success"
          @click="prepareEditor('question')"
          class="toggle-editor-button"
        >
          发布问题
        </el-button>
      </div>

      <QuestionEditor 
        v-if="showEditor" 
        :is-question="editorMode === 'question'" 
        :related-question-id="selectedQuestionId" 
        :parent-id="selectedAnswerId" 
        @submitted="handleSubmit" 
      />

      <QuestionList 
        :questions="filteredQuestions" 
        @detail="goToDetail" 
        @reply="prepareEditor" 
        class="question-list"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
import QuestionList from "../components/QuestionsList.vue";
import QuestionEditor from "../components/Questioneditor.vue";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const questions = ref([]); // 问题数据
const filteredQuestions = ref([]); // 筛选后的问题数据
const query = ref(''); // 查询内容
const showEditor = ref(false); // 控制编辑器显示
const selectedQuestionId = ref<number | null>(null); // 当前问题 ID
const selectedAnswerId = ref<number | null>(null); // 当前答案 ID
const editorMode = ref<'question' | 'answer' | 'reply'>('question'); // 编辑器模式
const router = useRouter();

// 获取问题数据
const fetchQuestions = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/v1/questions/getall');
    if (data.code === 200) {
      questions.value = data.data.records;
      filteredQuestions.value = questions.value; // 初始化筛选后的问题
    } else {
      console.error('数据获取失败:', data.msg);
    }
  } catch (error) {
    console.error('请求错误:', error);
  }
};

// 搜索问题
const searchQuestions = () => {
  if (query.value) {
    filteredQuestions.value = questions.value.filter(question =>
      question.title.includes(query.value) || 
      question.content.includes(query.value)
    );
  } else {
    filteredQuestions.value = questions.value; // 如果没有查询内容，显示所有问题
  }
};

// 跳转到问题详情页
const goToDetail = (id: number) => {
  router.push({ path: `/question/${id}` });
};

// 准备发布问题、回答或回复
const prepareEditor = (mode: 'question' | 'answer' | 'reply', questionId?: number, answerId?: number) => {
  editorMode.value = mode;
  selectedQuestionId.value = questionId || null;
  selectedAnswerId.value = answerId || null;
  showEditor.value = true;
};

// 发布成功后的处理
const handleSubmit = () => {
  showEditor.value = false;
  fetchQuestions(); // 刷新问题列表
};

onMounted(fetchQuestions);
</script>

<style scoped>

.main-container {
  height: 100vh;
  background: linear-gradient(135deg, #e0f2ff, #b2e0ff); /* 淡蓝色渐变 */
  padding: 20px;
}

.header {
  background-color: #3b82f6; /* 深蓝色 */
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.query-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.query-input {
  flex: 1;
  margin-right: 10px;
  border-radius: 4px;
  /* border: 1px solid #90cdf4; 淡蓝色边框 */
  padding: 10px; /* 增加内边距 */
  transition: border-color 0.3s;
}

.query-input:focus {
  border-color: #3b82f6; /* 深蓝色 */
  outline: none;
}

.query-button, .toggle-editor-button {
  border-radius: 4px;
  padding: 10px 15px;
  transition: background-color 0.3s;
}

.query-button:hover {
  background-color: #2563eb; /* 深蓝色 */
}

.toggle-editor-button:hover {
  background-color: #16a34a; /* 深绿色 */
}

.el-main {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: auto;
}
</style>