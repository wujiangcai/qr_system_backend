<template>
  <div class="editor-container">
    <el-input
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
      保存
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入编辑器样式
import { shallowRef, ref, onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router'; // 用于获取路由参数和跳转页面

const route = useRoute();
const router = useRouter();

const title = ref('');
const content = ref('<p>请输入内容...</p>');
const editorRef = shallowRef<any>(null);

const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

// 接收从其他页面传来的 id
const questionId = route.params.id;

// 编辑器初始化
const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

// 销毁编辑器实例
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) editor.destroy();
});

// 提交表单数据
// 提交表单数据
const handleSubmit = async () => {
  if (!title.value.trim()) {
    ElMessage.error('标题不能为空！');
    return;
  }
  if (!content.value.trim()) {
    ElMessage.error('内容不能为空！');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `http://localhost:8080/api/v1/questions/edit/${questionId}`,
      {
        title: title.value,
        content: content.value,
      },
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.code === 200) {
      ElMessage.success('问题编辑成功！');
      router.push(`/question/${questionId}`); // 提交成功后跳转回问题详情页
    } else {
      ElMessage.error(`编辑失败：${response.data.msg}`);
    }
  } catch (error) {
    ElMessage.error('编辑失败，请重试！');
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
