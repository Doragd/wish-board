<template>
    <div class="wish-form">
      <h2>💌 许下心愿</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">心愿标题</label>
          <input
            v-model="form.title"
            type="text"
            id="title"
            :maxlength="MAX_TITLE_LENGTH"
            placeholder="请输入心愿标题"
            required
            :class="{ 'input-warning': isTitleOverLimit }"
          />
          <div class="char-count" :class="{ 'text-warning': isTitleOverLimit }">
            {{ form.title.length }} / {{ MAX_TITLE_LENGTH }}
          </div>
        </div>
  
        <div class="form-group">
          <label for="content">心愿内容</label>
          <textarea
            v-model="form.content"
            id="content"
            :maxlength="MAX_CONTENT_LENGTH"
            placeholder="描述你的心愿..."
            rows="4"
            required
            :class="{ 'input-warning': isContentOverLimit }"
          ></textarea>
          <div class="char-count" :class="{ 'text-warning': isContentOverLimit }">
            {{ form.content.length }} / {{ MAX_CONTENT_LENGTH }}
          </div>
        </div>
  
        <div class="form-group">
          <label>分类标签</label>
          <div class="tags">
            <button
              v-for="tag in availableTags"
              :key="tag"
              type="button"
              :class="{ active: form.labels.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
  
        <button type="submit" :disabled="isSubmitting || isTitleOverLimit || isContentOverLimit">
          {{ isSubmitting ? '提交中...' : '许下心愿 ✨' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Octokit } from 'octokit';
  
  // 定义长度限制常量
  const MAX_TITLE_LENGTH = 50;  // 标题最大长度
  const MAX_CONTENT_LENGTH = 500;  // 内容最大长度
  
  interface FormData {
    title: string;
    content: string;
    labels: string[];
  }
  
  const form = ref<FormData>({
    title: '',
    content: '',
    labels: [],
  });
  
  const availableTags = ['礼物', '旅行', '约会', '美食'];
  const isSubmitting = ref(false);
  
  // 计算属性：检查输入是否超限
  const isTitleOverLimit = computed(() => form.value.title.length > MAX_TITLE_LENGTH);
  const isContentOverLimit = computed(() => form.value.content.length > MAX_CONTENT_LENGTH);
  
  const toggleTag = (tag: string) => {
    const index = form.value.labels.indexOf(tag);
    if (index === -1) {
      form.value.labels.push(tag);
    } else {
      form.value.labels.splice(index, 1);
    }
  };
  
  const handleSubmit = async () => {
  if (isSubmitting.value) return;

  // 输入验证
  if (isTitleOverLimit.value || isContentOverLimit.value) {
    alert('输入内容超出限制');
    return;
  }

  isSubmitting.value = true;

  try {
    console.log('token:', import.meta.env.VITE_GH_TOKEN_B64)
    const token = atob(import.meta.env.VITE_GH_TOKEN_B64 as string);

    const octokit = new Octokit({
      auth: token,
    });

    console.log('提交数据：', {
      owner: import.meta.env.VITE_REPO_OWNER,
      repo: import.meta.env.VITE_REPO_NAME,
      title: form.value.title,
      body: form.value.content,
      labels: ['wish', ...form.value.labels],
    });

    const response = await octokit.rest.issues.create({
      owner: import.meta.env.VITE_REPO_OWNER,
      repo: import.meta.env.VITE_REPO_NAME,
      title: form.value.title,
      body: form.value.content,
      labels: ['wish', ...form.value.labels],
    });

    console.log('API 响应：', response);
    alert('心愿已成功许下！✨');
    form.value = { title: '', content: '', labels: [] }; // 重置表单
  } catch (error) {
    console.error('API 错误详情：', error);
    alert(`许愿失败：${error instanceof Error ? error.message : '未知错误'}`);
  } finally {
    isSubmitting.value = false;
  }
};
  </script>
  
  <style scoped>
  .wish-form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
  }
  
  h2 {
    color: #ff6b6b;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-weight: bold;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  input:focus,
  textarea:focus {
    border-color: #ff6b6b;
    outline: none;
  }
  
  .input-warning {
    border-color: #ff4757 !important;
  }
  
  .char-count {
    text-align: right;
    font-size: 0.8rem;
    color: #888;
    margin-top: 0.25rem;
  }
  
  .text-warning {
    color: #ff4757;
  }
  
  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .tags button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: #f5f5f5;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .tags button.active {
    background: #ff6b6b;
    color: white;
    border-color: #ff6b6b;
  }
  
  button[type='submit'] {
    width: 100%;
    padding: 0.75rem;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button[type='submit']:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  button[type='submit']:not(:disabled):hover {
    background: #ff4757;
  }
  </style>