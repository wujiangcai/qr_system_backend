<template>
  <el-container class="user-profile-container">
    <el-header class="header">
      <Header :userInfoUpdated="userInfoUpdated" />
    </el-header>

    <el-main class="main-content">
      <el-card class="user-info-card" v-if="userInfo">
        <el-row class="info-row">
          <el-col :span="8" class="label">账号名:</el-col>
          <el-col :span="16" class="value">
            {{ userInfo.accountname }}
            <el-icon class="edit-icon" @click="editAccountname">
              <img class="editor" src="../assets//images/userprofile/编辑.png" alt="">
            </el-icon>
          </el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="8" class="label">用户名:</el-col>
          <el-col :span="16" class="value">{{ userInfo.username }}</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="8" class="label">邮箱:</el-col>
          <el-col :span="16" class="value">{{ userInfo.email }}</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="8" class="label">头像:</el-col>
          <el-col :span="16" class="value">
            <el-avatar :src="userInfo.avatar" class="avatar" />
              <el-icon class="edit-icon" @click="editAvatar">
              <img class="editor" src="../assets//images/userprofile/编辑.png" alt="">
            </el-icon>
          </el-col>
        </el-row>
      </el-card>

      <div class="action-buttons">
        <el-button type="primary" @click="openPasswordDialog" v-if="userInfo">修改密码</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
         <!-- <el-button type="danger" @click="fresh">连接</el-button> -->
      </div>

  <!-- 上传头像弹窗 -->
      <el-dialog title="上传头像" v-model="showAvatarDialog">
        <el-upload
          action="http://localhost:8080/api/oss/upload"
          :headers="headers"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          list-type="picture-card"
          class="avatar-uploader"
        >
          <!-- <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
        </el-upload>
        <el-button v-if="avatarUrl" type="primary" @click="submitAvatar">保存头像</el-button>
      </el-dialog>


      <!-- 验证当前密码弹窗 -->
      <el-dialog title="验证密码" v-model="showPasswordDialog">
        <el-form>
          <el-form-item label="请输入当前密码">
            <el-input type="password" v-model="password" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="validatePassword">确认</el-button>
            <el-button @click="showPasswordDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 修改新密码弹窗 -->
      <el-dialog title="修改密码" v-model="showNewPasswordDialog">
        <el-form>
          <el-form-item label="请输入新密码">
            <el-input type="password" v-model="newPassword" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" v-model="confirmPassword" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitNewPassword">确认修改</el-button>
            <el-button @click="showNewPasswordDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 编辑昵称弹窗 -->
      <el-dialog title="编辑昵称" v-model="showEditAccountnameDialog">
        <el-form>
          <el-form-item label="新昵称">
            <el-input v-model="newAccountname" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitAccountname">确认修改</el-button>
            <el-button @click="showEditAccountnameDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Header from '../components/Header.vue';
import { extractUserId } from '../utils/JwtUtil'; // 提取 token 中的 userId
import { fetchHeaderInfo } from '../service/userService';
const userInfoUpdated = ref(false);

const handleAvatarUpdated = () => {
  // 头像更新后，通知 Header 刷新用户信息

};

// 返回上一个页面
const goBack = () => {
  router.back(); // 返回到上一个页面
};
// 用户信息
const userInfo = ref<any>(null);
 
// 密码
const password = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const newAccountname = ref('');
const avatarUrl = ref('');
const showPasswordDialog = ref(false);
const showNewPasswordDialog = ref(false);
const showEditAccountnameDialog = ref(false);
const showAvatarDialog = ref(false);

import { useRouter } from 'vue-router'; // 引入 useRouter
const router = useRouter(); // 创建 router 实例

// 从 token 中解析 userId，并获取用户信息
const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }

  const userId = extractUserId(token);
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200) {
      userInfo.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败');
    console.error(error);
  }
};



// 上传头像的 headers（带上 token）
const headers = {
  Authorization: `Bearer ${localStorage.getItem('token')}`,
};

// 打开编辑头像弹窗
const editAvatar = () => {
  showAvatarDialog.value = true;
};

// 上传头像成功后的回调
const handleUploadSuccess = (response: any) => {
  if (response.fileUrl) {
    avatarUrl.value = response.fileUrl;
    ElMessage.success('头像上传成功');
  } else {
    ElMessage.error('上传失败');
  }
};

// 上传失败回调
const handleUploadError = () => {
  ElMessage.error('上传失败，请重试');
};

// 上传前处理（可以限制文件类型、大小等）
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 30;

  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB');
    return false;
  }
  return true;
};

// 提交头像修改
 
const submitAvatar = async () => {
  try {
    const token = localStorage.getItem('token');
    const userId = extractUserId(token);
    const avatarLink = avatarUrl.value; // 使用上传后的 avatarUrl

    const response = await axios.post(
      `http://localhost:8080/api/v1/user/update-avatar?userId=${userId}&avatarUrl=${encodeURIComponent(avatarLink)}`,
      {}, // 空请求体，因为参数在 URL 中
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 200) {
      ElMessage.success('头像修改成功');
      userInfo.value.avatar = avatarUrl.value; // 更新前端显示的头像
      showAvatarDialog.value = false;
      fetchUserInfo()
        userInfoUpdated.value = true;
    } else {
      ElMessage.error('头像修改失败');
    }
  } catch (error) {
    ElMessage.error('请求失败，请重试');
  }
};



// 打开验证密码弹窗
const openPasswordDialog = () => {
  password.value = ''; // 重置密码输入
  showPasswordDialog.value = true;
};

// 验证当前密码
const validatePassword = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1/user/validate-password',
      { password: password.value }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );

    if (response.data.code === 200 && response.data.data.valid) {
      ElMessage.success('密码验证成功');
      showPasswordDialog.value = false;
      showNewPasswordDialog.value = true; // 显示新密码输入框
    } else {
      ElMessage.error('密码验证失败，请检查输入');
    }
  } catch (error) {
    ElMessage.error('验证失败，请重试');
  }
};

// 提交新密码
const submitNewPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('两次密码输入不一致');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1/user/update',
      { password: newPassword.value },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );

    if (response.data.code === 200) {
      ElMessage.success('密码修改成功');
      showNewPasswordDialog.value = false;
    } else {
      ElMessage.error('密码修改失败');
    }
  } catch (error) {
    ElMessage.error('请求出错，请重试');
  }
};

// 退出登录
const logout = () => {
  localStorage.removeItem('token'); // 清除 token
  ElMessage.success('已退出登录');
  // 可以根据需要跳转到登录页面
   router.push('/login');
};

// 打开编辑昵称弹窗
const editAccountname = () => {
  newAccountname.value = userInfo.value.accountname; // 默认显示当前昵称
  showEditAccountnameDialog.value = true;
};

// 提交新的昵称
const submitAccountname = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1/user/update',
      { accountname: newAccountname.value }, // 仅传递新昵称
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.code === 200) {
      ElMessage.success('昵称修改成功');
      userInfo.value.accountname = newAccountname.value; // 更新前端显示的昵称
      showEditAccountnameDialog.value = false;

    } else {
      ElMessage.error('昵称修改失败');
    }
  } catch (error) {
    ElMessage.error('请求出错，请重试');
  }
};

 
const fresh=()=>{
     fetchHeaderInfo
}
onMounted(fetchUserInfo);
</script>

<style scoped>
.user-profile-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  background-color: #409eff;
 
  color: white;
 
  font-weight: bold;
  text-align: center;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.user-info-card {
  width: 400px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.info-row {
  margin-bottom: 12px;
}

.label {
  font-weight: bold;
  color: #666;
}
.editor{
    width: 20px;
  height: 20px;
}

.value {
  display: flex;
  align-items: center;
}

.edit-icon {
  cursor: pointer;
  margin-left: 10px;

}

.avatar {
  cursor: pointer;
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 400px;
  margin-top: 20px;
}

.el-button {
  width: 48%;
}

</style>
