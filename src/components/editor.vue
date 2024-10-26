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
      {{ isQuestion ? '发布问题' : '发布回答' }}
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
  relatedQuestionId: number; // 相关问题 ID
  parentId?: number | null;  // 可选，答案 ID
}>();

// 数据绑定
const title = ref(''); // 标题
const content = ref('<p>请输入内容...</p>'); // 编辑内容 HTML

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

// 发布问题或答案请求
const handleSubmit = async () => {
  if (props.isQuestion && !title.value) {
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

    const payload: Record<string, any> = { answerContent: content.value }; // 修改字段名

    if (props.isQuestion) {
      payload.title = title.value;
    } else {
      payload.relatedQuestionId = props.relatedQuestionId;
      if (props.parentId) payload.parentId = props.parentId; // 处理子回答
    }

    const response = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.code === 200) {
      ElMessage.success(props.isQuestion ? '问题发布成功！' : '回答发布成功！');
      title.value = ''; // 清空标题
      content.value = '<p>请输入内容...</p>'; // 重置内容
    } else {
      ElMessage.error(`发布失败：${response.data.msg}`);
    }
  } catch (error) {
    ElMessage.error('请求出错，请重试！');
    console.error(error);
  }
};
// 编辑器模式
const mode = 'default';
</script>

<style scoped>
.editor-container {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
