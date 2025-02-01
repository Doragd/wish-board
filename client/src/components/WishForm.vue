<template>
  <div class="wish-form">
    <div class="form-header">
      <h2>💌 写下你的心愿</h2>
      <button class="close-button" @click="emit('close')">×</button>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">心愿标题</label>
        <input v-model="form.title" type="text" id="title" :maxlength="MAX_TITLE_LENGTH" placeholder="请输入心愿标题" required
          :class="{ 'input-warning': isTitleOverLimit }" />
        <div class="char-count" :class="{ 'text-warning': isTitleOverLimit }">
          {{ form.title.length }} / {{ MAX_TITLE_LENGTH }}
        </div>
      </div>

      <div class="form-group">
        <label for="content">心愿内容</label>
        <textarea v-model="form.content" id="content" :maxlength="MAX_CONTENT_LENGTH" placeholder="描述你的心愿..." rows="4"
          required :class="{ 'input-warning': isContentOverLimit }"></textarea>
        <div class="char-count" :class="{ 'text-warning': isContentOverLimit }">
          {{ form.content.length }} / {{ MAX_CONTENT_LENGTH }}
        </div>
      </div>

      <div class="form-group">
        <label>分类标签</label>
        <div class="tags">
          <button v-for="tag in availableTags" :key="tag" type="button" :class="{ active: form.labels.includes(tag) }"
            @click="toggleTag(tag)">
            {{ tag }}
          </button>
        </div>
      </div>

      <button type="submit" :disabled="isSubmitting || isTitleOverLimit || isContentOverLimit">
        <span v-if="isSubmitting" class="loading-spinner"></span>
        <span v-else>放飞心愿 ✨</span>
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

const emit = defineEmits(['wish-created', 'close']);

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
    const response = await fetch(import.meta.env.VITE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: form.value.title,
        content: form.value.content,
        labels: form.value.labels,
      }),
    });

    if (!response.ok) {
      throw new Error('提交失败');
    }

    const result = await response.json();
    console.log('API 响应：', result);
    alert(`心愿已成功许下！✨\n查看心愿：${result.issueUrl}`);
    form.value = { title: '', content: '', labels: [] }; // 重置表单
    // 触发重新获取心愿列表
    emit('wish-created');
  } catch (error) {
    console.error('API 错误详情：', error);
    alert(`许愿失败：${error instanceof Error ? error.message : '未知错误'}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.loading-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

button[type='submit'] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #666;
  cursor: pointer;
  padding: 0 0.5rem;
  transition: color 0.3s;
}

.close-button:hover {
  color: #ff6b6b;
}

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
  width: 95%;
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

@media (max-width: 600px) {
  .wish-form {
    padding: 0.75rem;
  }
  h2 {
    font-size: 1.25rem;
  }
  input, textarea {
    font-size: 0.9rem;
  }
}

.wish-form {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>