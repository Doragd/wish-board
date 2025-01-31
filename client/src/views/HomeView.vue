<!-- src/views/HomeView.vue -->
<template>
  <div class="home-container">
    <!-- 浪漫风格标题 -->
    <h1 class="romantic-title">
      <span>💌 给TA的心愿墙</span>
      <div class="hand-drawn-divider">
  <svg viewBox="0 0 100 10" class="brush-stroke">
    <path d="M 0,5 Q 20,0 40,5 T 80,5 T 100,5" 
          stroke="#ff6b6b" 
          fill="none"
          stroke-width="2"
          stroke-linecap="round"/>
  </svg>
  <div class="stars">
    <span class="star" v-for="n in 10" :key="n">✨</span>
  </div>
</div>
    </h1>

    <!-- 新增悬浮按钮 -->
    <button class="float-button" @click="showForm = true">
      ✨ 许个愿望
    </button>

    <!-- 悬浮表单 -->
    <div v-if="showForm" class="modal-mask" @click.self="closeForm">
      <div class="modal-wrapper">
        <WishForm @wish-created="handleWishCreated" @close="closeForm" />
      </div>
    </div>

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
  url: import.meta.env.VITE_API_URL
});
import { computed, onMounted } from 'vue';
import { useWishStore } from '@/stores/wishStore';
import { ref, watch } from 'vue';
import WishForm from '@/components/WishForm.vue';

const showForm = ref(false);

// 监听 showForm 变化
watch(showForm, (newValue) => {
  if (newValue) {
    // 禁用滚动
    document.body.style.overflow = 'hidden';
  } else {
    // 恢复滚动
    document.body.style.overflow = '';
  }
});

const closeForm = () => {
  showForm.value = false;
};

// 使用 Pinia Store
const store = useWishStore();

const loadWishes = async () => {
  await store.loadWishes();
};

// 初始化加载心愿列表
onMounted(() => {
  store.loadWishes();
});

// 计算属性
const loading = computed(() => store.loading);
const error = computed(() => store.error);
const wishes = computed(() => store.wishes);
const sortedWishes = computed(() => store.sortedWishes);

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 获取标签颜色
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
const handleWishCreated = async () => {
  closeForm();
  // 等待确保GitHub API更新
  setTimeout(async () => {
    await loadWishes();
  }, 500);
};

</script>

<style scoped>
/* 新增样式 */
.float-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  padding: 1rem 2rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  transition: transform 0.3s;
}

.float-button:hover {
  transform: scale(1.05);
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalEnter 0.3s ease-out;
}

@keyframes modalEnter {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.romantic-title {
  color: #ff6b6b;
  text-align: center;
  margin: 2rem 0;
}

.hand-drawn-divider {
  position: relative;
  margin: 2rem 0;
  opacity: 0.8;
}

.brush-stroke {
  width: 200px;
  height: 20px;
  animation: hand-drawn 2s ease-in-out infinite;
}

.stars {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(-50%);
}

.star {
  position: absolute;
  font-size: 30px;
  color: white;
  text-shadow: 0 0 4px #ff6b6b;
  animation: twinkle 2s ease-in-out infinite;
}

/* 星星位置 */
.star:nth-child(1) { top: 10%; left: 5%; animation-delay: 0s; }
.star:nth-child(2) { top: 30%; left: 20%; animation-delay: 0.5s; }
.star:nth-child(3) { top: 50%; left: 35%; animation-delay: 1s; }
.star:nth-child(4) { top: 70%; left: 50%; animation-delay: 1.5s; }
.star:nth-child(5) { top: 90%; left: 65%; animation-delay: 2s; }
.star:nth-child(6) { top: 20%; left: 80%; animation-delay: 0.5s; }
.star:nth-child(7) { top: 40%; left: 95%; animation-delay: 1s; }
.star:nth-child(8) { top: 60%; left: 10%; animation-delay: 1.5s; }
.star:nth-child(9) { top: 80%; left: 25%; animation-delay: 2s; }
.star:nth-child(10) { top: 10%; left: 90%; animation-delay: 0s; }

/* 手绘线条动画 */
@keyframes hand-drawn {
  0%, 100% { transform: scaleX(0.98); }
  50% { transform: scaleX(1.02); }
}

/* 星星闪烁动画 */
@keyframes twinkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.loading {
  text-align: center;
  color: #ff9a9e;
  font-size: 1.2em;
}

.error {
  color: #ff4757;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 500px;
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

.modal-wrapper {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalEnter 0.3s ease-out;
  box-sizing: border-box; /* 防止内容溢出 */
}

@media (max-width: 600px) {
  .float-button {
    bottom: 20px;
    right: 20px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .modal-wrapper {
    padding: 1rem;
  }
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