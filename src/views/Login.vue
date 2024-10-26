<template>
  <el-container class="login-page">
    <el-form :model="form" @submit.prevent="login" class="login-form">
      <h2 class="form-title">登录</h2>
      <el-form-item class="form-item">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item class="form-item">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item class="form-buttons">
        <el-button type="primary" native-type="submit" @click="login">登录</el-button>
        <el-button type="success" @click="goToRegister">注册</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// 初始化表单数据
const form = reactive({ username: "", password: "" });
const router = useRouter();

// 登录逻辑
const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/v1/user/login', {
      username: form.username,
      password: form.password
    });
    
    if (response.data.code === 200) {
      const token = response.data.data.token;
      localStorage.setItem('token', token);

      router.push('/');
    } else {

      console.error(response.data.msg);
    }
  } catch (error) {
    console.error("登录失败", error);
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e0f2ff, #b2e0ff);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-item {
  margin-bottom: 20px;
}

.form-buttons {
  display: flex;
  justify-content: space-between; /* 让按钮在两侧对齐 */
  margin-top: 10px; /* 添加一些上边距 */
  margin-left: 28%;
}
</style>
