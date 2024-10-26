<template>
  <el-container class="detail-container">
    <el-header class="header">
      <Header />
    </el-header>

    <el-main v-if="question">
      <div class="post-card">
        <div class="post-header">
          <img :src="question.avatar" class="avatar" />
          <div class="user-info">
            <p class="username">{{ question.accountname }}</p>
            <p class="timestamp">{{ formatTime(question.createTime) }}</p>
          </div>
          <!-- 省略号图标，只有当用户是问题的发布者时才显示 -->
          <el-dropdown v-if="isOwner" class="more-options">
            <img class="shenglue" src="../assets/images/questiondetail/省略号.png" alt="省略号" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toggleEditMode">编辑</el-dropdown-item>
                <el-dropdown-item @click="deleteQuestion">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 问题标题和内容 -->
        <template v-if="!isEditing">
          <h2 class="title">{{ question.title }}</h2>
          <p class="content" v-html="question.content"></p>
        </template>

        <!-- 编辑模式 -->
  <EditQuestion
      v-if="isEditing"
      :question-id="id"
      :initial-title="question.title"
      :initial-content="question.content"
      @submitted="handleQuestionUpdate"
    />

        <div class="post-footer">
          <el-button @click="toggleLike(question.id, 2)">
            👍 {{ question.questionLikeCount }} 赞
          </el-button>
        </div>
      </div>

      <!-- 显示回答编辑器 -->
      <el-button type="primary" @click="toggleEditor">
        {{ showEditor ? "取消回答" : "发布回答" }}
      </el-button>
      <QuestionEditor v-if="showEditor" @submit="submitAnswer" :related-question-id="question.id" />

      <h3 class="section-title">回复列表：</h3>
      <div v-if="question.answers.length === 0" class="empty-message">
        等你来回复
      </div>
      <div v-else>
        <AnswerItem v-for="answer in mainAnswers" :key="answer.answerId" :answer="answer" :all-answers="question.answers"
          @toggleLike="toggleLike" @reply="submitNestedAnswer" />
      </div>
    </el-main>

    <el-main v-else>
      <p>正在加载问题详情...</p>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
import AnswerItem from "../components/AnswerItem.vue";
import QuestionEditor from "../components/editor.vue";
import EditQuestion from "../components/editQuestion.vue";
import { useRouter,useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
const route = useRoute();
const question = ref(null);
const showEditor = ref(false);
const isEditing = ref(false); // 控制是否处于编辑模式
const id = route.params.id;
const userId = ref(null); // 当前用户 ID
const router = useRouter();
// 检查当前用户是否是问题的发布者
const isOwner = computed(() => userId.value && question.value && userId.value === question.value.userId);

// 获取问题详情
const fetchQuestionDetail = async () => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/v1/questions/${id}`);
    question.value = data.data;
  } catch (error) {
    console.error("获取问题详情失败:", error);
  }
};

// 从 Token 中获取用户 ID
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  }
  return null;
};

userId.value = getUserIdFromToken();

const mainAnswers = computed(() =>
  question.value ? question.value.answers.filter((a) => a.parentId === null) : []
);

// 提交回答
const submitAnswer = async (content: string) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:8080/api/v1/answers/add", { content, relatedQuestionId: question.value.id }, { headers: { Authorization: `Bearer ${token}` } });
    showEditor.value = false;
    fetchQuestionDetail();
  } catch (error) {
    console.error("提交答案失败:", error);
  }
};

// 提交嵌套回复
const submitNestedAnswer = async (content: string, parentId: number) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:8080/api/v1/answers/add", { content, relatedQuestionId: question.value.id, parentId }, { headers: { Authorization: `Bearer ${token}` } });
    fetchQuestionDetail();
  } catch (error) {
    console.error("提交嵌套回复失败:", error);
  }
};

// 点击编辑问题
const toggleEditMode = () => {
  isEditing.value = true;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
};

// // 提交编辑后的问题
// const submitEditedQuestion = async (updatedContent: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     await axios.put(`http://localhost:8080/api/v1/questions/edit/${id}`, { title: question.value.title, content: updatedContent }, { headers: { Authorization: `Bearer ${token}` } });
//     isEditing.value = false;
//     fetchQuestionDetail();
//   } catch (error) {
//     console.error("编辑问题失败:", error);
//   }
// };

const handleQuestionUpdate = () => {
  // 处理问题更新后的逻辑，例如刷新页面或跳转
  console.log('问题已成功更新');
};

// 删除问题
const deleteQuestion = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:8080/api/v1/questions/delete/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
     ElMessage.success('问题删除成功！');
    router.push("/")
    // 可跳转到列表页或其他处理
  } catch (error) {
    console.error("删除问题失败:", error);
  }
};

// 点赞/取消点赞
const toggleLike = async (targetId: number, type: number) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:8080/api/v1/likes/toggle", {}, { params: { targetId, type }, headers: { Authorization: `Bearer ${token}` } });
    fetchQuestionDetail();
  } catch (error) {
    console.error("点赞失败:", error);
  }
};

// 切换回答编辑器显示
const toggleEditor = () => {
  showEditor.value = !showEditor.value;
};

// 格式化时间
const formatTime = (time: string) => new Date(time).toLocaleString("zh-CN", { hour12: false });

onMounted(fetchQuestionDetail);
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}
.header {
  background-color: #409eff;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.post-card {
  background-color: white;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.avatar {
  border-radius: 50%;
  margin-right: 10px;
  height: 50px;
  width: 50px;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: bold;
  margin: 0;
}
.timestamp {
  font-size: 12px;
  color: #999;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
.content {
  margin-bottom: 10px;
  font-size: 16px;
}
.post-footer {
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #666;
}
.section-title {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}
.empty-message {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin: 20px 0;
}
.more-options {
  margin-left: auto;
}
.shenglue {
  height: 24px;
  width: 24px;
}
</style>
