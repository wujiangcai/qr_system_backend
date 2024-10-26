<template>
  <div class="editor-container">
    <el-input
      v-if="isQuestion"
      v-model="title"
      placeholder="请输入标题"
      class="title-input"
    />
    <div class="editor-wrapper">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 300px; overflow-y: hidden;"
        v-model="content"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
    <el-button type="primary" @click="handleSubmit" class="submit-button">
      {{ isQuestion ? '发布问题' : parentId ? '回复答案' : '发布回答' }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入编辑器样式
import { shallowRef, ref, onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 用于消息提示

const props = defineProps<{
  isQuestion: boolean; // 是否是发布问题
  relatedQuestionId?: number; // 相关问题 ID
  parentId?: number | null; // 父级答案 ID（用于回复答案）
}>();

const emit = defineEmits(['submitted']); // 定义提交事件

// 数据绑定
const title = ref('');
const content = ref('<p>请输入内容...</p>');

// 编辑器实例
const editorRef = shallowRef<any>(null);

// 编辑器配置
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

// 保存编辑器实例
const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

// 销毁编辑器实例
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) editor.destroy();
});

// 提交表单逻辑
const handleSubmit = async () => {
  if (props.isQuestion && !title.value.trim()) {
    ElMessage.error('标题不能为空！');
    return;
  }

  if (!content.value.trim() || content.value === '<p>请输入内容...</p>') {
    ElMessage.error('内容不能为空！');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const url = props.isQuestion
      ? 'http://localhost:8080/api/v1/questions/add'
      : 'http://localhost:8080/api/v1/answers/add';

    const payload: Record<string, any> = { content: content.value };

    if (props.isQuestion) {
      payload.title = title.value;
    } else {
      payload.relatedQuestionId = props.relatedQuestionId;
      if (props.parentId) payload.parentId = props.parentId;
    }

    const response = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.code === 200) {
      ElMessage.success(props.isQuestion ? '问题发布成功！' : '回复发布成功！');
      emit('submitted'); // 通知父组件刷新
      title.value = '';
      content.value = '<p>请输入内容...</p>';
    } else {
      ElMessage.error(`发布失败：${response.data.msg}`);
    }
  } catch (error) {
    ElMessage.error('请求出错，请重试！');
    console.error(error);
  }
};
</script>

<style scoped>
.editor-container {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
}

.title-input {
  margin-bottom: 10px;
  width: 100%;
}

.editor-wrapper {
  margin-bottom: 10px;
}

.submit-button {
  width: 100%;
}
</style>
