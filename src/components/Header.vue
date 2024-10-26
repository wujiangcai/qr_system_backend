<template>
  <el-header class="header">
    <el-row type="flex" justify="space-between" align="middle">
      <h1 class="logo" @click="gotoHome">问答系统</h1>
      <div class="user-info" v-if="userInfo">
        <img 
          src="https://img.icons8.com/material-rounded/24/ffffff/appointment-reminders--v1.png" 
          alt="通知" 
          class="notification-icon" 
          @click="goToNotifications" 
        />
        <el-avatar 
          :src="userInfo.avatar || 'https://placekitten.com/40/40'" 
          @click="goToUserProfile" 
          class="avatar" 
        />
        <span class="username">{{ userInfo.accountname }}</span>
      </div>
      <div v-else>
        <el-button class="login" @click="goToLogin">请先登录</el-button>
      </div>
    </el-row>
  </el-header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { extractUserId } from '../utils/JwtUtil';
import axios from 'axios';

const props = defineProps({
  userInfoUpdated: Boolean,
});
const router = useRouter();
const userInfo = ref<any>(null);

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
};

// 跳转到通知页
const goToNotifications = () => {
  router.push('/notifications');
};

// 跳转到个人信息页
const goToUserProfile = () => {
  router.push('/user');
};

const gotoHome = () => {
  router.push('/');
};

// 获取用户信息
const fetchHeaderInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('未检测到 Token，请先登录');
    return;
  }

  const userId = extractUserId(token);
  if (!userId) {
    console.error('未检测到用户 ID，请先登录');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.code === 200) {
      userInfo.value = response.data.data;
    } else {
      console.error(response.data.msg);
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

// 监听父组件传递的更新事件
watch(() => props.userInfoUpdated, (newVal) => {
  if (newVal) {
    fetchHeaderInfo();
  }
});

onMounted(fetchHeaderInfo);
</script>

<style scoped>
.header {
  background-color: #409eff;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}

.logo:hover {
  color: #ffdd57; /* 鼠标悬停变色 */
}

.login {
  background-color: #ffffff;
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.login:hover {
  background-color: #409eff;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  color: white;
  font-weight: bold;
}

.avatar {
  cursor: pointer;
  border: 2px solid white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.avatar:hover {
  transform: scale(1.4); /* 鼠标悬停放大 */
}

.notification-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.notification-icon:hover {
  transform: scale(1.1); /* 鼠标悬停放大 */
}
</style>
