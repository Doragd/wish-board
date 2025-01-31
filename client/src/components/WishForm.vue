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
            placeholder="请输入心愿标题"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="content">心愿内容</label>
          <textarea
            v-model="form.content"
            id="content"
            placeholder="描述你的心愿..."
            rows="4"
            required
          ></textarea>
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
  
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '许下心愿 ✨' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { Octokit } from 'octokit';
  
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
    isSubmitting.value = true;
  
    try {
      const octokit = new Octokit();
      await octokit.rest.issues.create({
        owner: import.meta.env.VITE_REPO_OWNER,
        repo: import.meta.env.VITE_REPO_NAME,
        title: form.value.title,
        body: form.value.content,
        labels: ['wish', ...form.value.labels],
      });
  
      alert('心愿已成功许下！✨');
      form.value = { title: '', content: '', labels: [] }; // 重置表单
    } catch (error) {
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