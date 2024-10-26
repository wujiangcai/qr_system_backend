<template>
  <el-container class="register-page">
    <el-form :model="form" @submit.prevent="register" ref="formRef" class="form-container">
      <el-form-item label="用户名" :rules="usernameRules">
        <el-input v-model.trim="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" :rules="passwordRules">
        <el-input type="password" v-model.trim="form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="邮箱" :rules="emailRules">
        <el-input type="email" v-model.trim="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="确认密码" :rules="confirmPasswordRules">
        <el-input type="password" v-model.trim="form.confirmPassword" placeholder="请确认密码" />
      </el-form-item>
      <el-button type="primary" :loading="loading" native-type="submit" class="register-button">注册</el-button>
    </el-form>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElMessage } from 'element-plus';

const API_URL = 'http://localhost:8080/api/v1/user/register';

const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});
const router = useRouter();
const loading = ref(false);
const formRef = ref();

const usernameRules = [{ required: true, message: "用户名不能为空", trigger: "blur" }];
const passwordRules = [
  { required: true, message: "密码不能为空", trigger: "blur" },
  { min: 6, message: "密码长度至少为6个字符", trigger: "blur" },
];
const emailRules = [
  { required: true, message: "邮箱不能为空", trigger: "blur" },
  { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
];
const confirmPasswordRules = [
  { required: true, message: "请确认密码", trigger: "blur" },
  { validator: (rule, value, callback) => {
      if (value !== form.password) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    }, trigger: 'blur' }
];

const register = async () => {
  await formRef.value.validate();

  loading.value = true;
  try {
    const response = await axios.post(API_URL, {
      username: form.username,
      password: form.password,
      email: form.email,
    });

    if (response.data.code === 200) {
      ElMessage.success("注册成功！");
      router.push('/login');
    } else if (response.data.code === 409) {
      ElMessage.error(response.data.msg || "用户已存在");
    } else {
      ElMessage.error(response.data.msg || "注册失败，请重试");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("注册过程中发生错误，请稍后再试");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f0f4f8; /* 更改背景颜色 */
}

.form-container {
  background: white; /* 表单背景为白色 */
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px; /* 增加内边距 */

  width: 400px; /* 设置表单宽度 */
}

.el-form-item {
  margin-bottom: 20px;
  display: flex; /* 使用 flexbox 来对齐 */
  align-items: center; /* 垂直居中对齐 */
}

.el-form-item label {
  width: 100px; /* 设置标签的固定宽度 */
  flex-shrink: 0; /* 防止标签被缩小 */
}

.el-input {
  flex-grow: 1; /* 输入框占据剩余空间 */
  border-radius: 5px;
  padding: 10px; /* 增加输入框内边距 */
}

.el-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}


.register-button {
  width: 100%;
  padding: 12px; /* 增加按钮内边距 */
  border-radius: 5px;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #409eff;
  border-color: #409eff;
}
</style>

