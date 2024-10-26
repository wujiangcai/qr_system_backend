<template>
  <div class="answer-card" v-if="answer">
    <div class="answer-header">
      <img :src="answer.avatar" class="avatar" v-if="answer.avatar" />
      <div class="user-info">
        <p class="username">{{ answer.accountname || '匿名用户' }}</p>
        <p class="timestamp">{{ formatTime(answer.acreateTime) }}</p>
      </div>
    </div>
    <p class="answer-content" v-html="answer.answerContent"></p>

    <div class="answer-footer">
      <el-button @click="toggleLike(answer.answerId, 1)">
        👍 {{ answer.answerLikeCount }} 赞
      </el-button>
      <el-button @click="showReplyEditor = !showReplyEditor">
        {{ showReplyEditor ? '取消回复' : '回复' }}
      </el-button>
    </div>

    <!-- 嵌套编辑器 -->
    <QuestionEditor
      v-if="showReplyEditor"
      @submit="submitNestedReply"
      :related-question-id="answer.relatedQuestionId"
      :parent-id="answer.answerId"
    />

    <!-- 子回复递归渲染 -->
    <div v-if="children.length > 0" class="replies">
      <AnswerItem
        v-for="child in children"
        :key="child.answerId"
        :answer="child"
        :all-answers="allAnswers"
        @toggleLike="toggleLike"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps, defineEmits } from "vue";
import QuestionEditor from "../components/editor.vue"; // 引入编辑器组件

const props = defineProps({
  answer: Object,
  allAnswers: Array,
});

const emit = defineEmits(["toggleLike", "reply"]);

const showReplyEditor = ref(false); // 控制嵌套编辑器的显示

const children = computed(() =>
  props.allAnswers.filter((item) => item.parentId === props.answer.answerId)
);

const formatTime = (time: string) =>
  new Date(time).toLocaleString("zh-CN", { hour12: false });

const toggleLike = (answerId: number, type: number) => {
  emit("toggleLike", answerId, type);
};

const submitNestedReply = (content: string) => {
  emit("reply", content, props.answer.answerId); // 触发回复事件
  showReplyEditor.value = false; // 关闭编辑器
};
</script>

<style scoped>
.answer-card {
  background-color: white;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.replies {
  margin-left: 30px;
  border-left: 2px solid #f0f0f0;
  padding-left: 10px;
}
.avatar {
  border-radius: 50%;
  margin-right: 10px;
  height: 50px;
}
.answer-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}
.answer-header{
  display: flex;
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
</style>
