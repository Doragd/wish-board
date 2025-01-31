<!-- src/views/HomeView.vue -->
<template>
  <div class="home-container">
    <!-- 浪漫风格标题 -->
    <h1 class="romantic-title">
      <span>💌 给TA的心愿墙</span>
      <div class="heart-divider">♥♥♥</div>
    </h1>

    <!-- 新增心愿表单 -->
    <WishForm @wish-created="handleWishCreated" />

    <!-- 心愿列表 -->
    <div v-if="loading" class="loading">✨ 正在加载心愿...</div>
    
    <div v-else-if="error" class="error">
      😢 加载失败：{{ error }}
    </div>

    <div v-else>
      <div v-if="wishes.length === 0" class="empty">
        🌸 还没有心愿，快来许下第一个愿望吧！
      </div>

      <div v-for="wish in sortedWishes" :key="wish.id" class="wish-card">
        <div class="wish-header">
          <h3>{{ wish.title }}</h3>
          <div class="like-count">
            ❤️ {{ wish.likes }}
          </div>
        </div>
        
        <p class="content">{{ wish.content }}</p>
        
        <div class="meta">
          <span class="time">📅 {{ formatDate(wish.createdAt) }}</span>
          <div class="labels">
            <span 
              v-for="label in wish.labels" 
              :key="label"
              class="label"
              :style="{ backgroundColor: getLabelColor(label) }"
            >
              {{ label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 在setup顶部添加
console.log('当前配置：', {
  owner: import.meta.env.VITE_REPO_OWNER,
  repo: import.meta.env.VITE_REPO_NAME,
  token: import.meta.env.VITE_GH_TOKEN ? '***' : '未设置'
});
import { computed } from 'vue';
import { useWishStore } from '@/stores/wishStore';
import { ref } from 'vue';
import WishForm from '@/components/WishForm.vue';

const store = useWishStore();
store.loadWishes();

const loading = computed(() => store.loading);
const error = computed(() => store.error);
const wishes = computed(() => store.wishes);
const sortedWishes = computed(() => store.sortedWishes);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getLabelColor = (label: string) => {
  const colors: Record<string, string> = {
    '礼物': '#ff9a9e',
    '旅行': '#a8e6cf',
    '约会': '#d4a5a5',
    '美食': '#ffd3b6'
  };
  return colors[label] || '#ddd';
};

// 处理心愿创建后的逻辑
const handleWishCreated = () => {
  // 刷新心愿列表
  store.loadWishes();
};
</script>

<style scoped>
.romantic-title {
  color: #ff6b6b;
  text-align: center;
  margin: 2rem 0;
}

.heart-divider {
  color: #f52e2e;
  font-size: 1.5em;
  margin: 0.5rem 0;
}
.wish-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
  transition: transform 0.2s;
}

.wish-card:hover {
  transform: translateY(-3px);
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.wish-header h3 {
  color: #ff6b6b;
  margin: 0;
  font-size: 1.4rem;
}

.like-count {
  background: rgba(255, 107, 107, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  color: #ff6b6b;
  font-weight: bold;
}

.content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #888;
}

.labels {
  display: flex;
  gap: 0.5rem;
}

.label {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8em;
  color: white;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #ff9a9e;
  font-size: 1.2em;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  margin: 2rem 0;
}
</style>