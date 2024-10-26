<template>
  <el-container class="ask-question">
    <el-form :model="form" @submit.prevent="submitQuestion">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入问题标题" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="form.content" placeholder="请输入问题内容" />
      </el-form-item>
      <el-button type="primary" native-type="submit">提交问题</el-button>
    </el-form>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import axios from "axios";

const form = reactive({ title: "", content: "" });

const submitQuestion = async () => {
  try {
    await axios.post("/api/v1/questions", form);
    alert("问题提交成功");
  } catch (error) {
    console.error("问题提交失败", error);
  }
};
</script>

<style scoped>
.ask-question {
  padding: 20px;
}
</style>
