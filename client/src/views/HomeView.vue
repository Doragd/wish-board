<template>
  <div class="test-container">
    <!-- 浪漫风格标题 -->
    <h1 class="romantic-title">
      <span>💌 给TA的心愿墙</span>
      <div class="heart-divider">♥♥♥</div>
    </h1>

    <!-- 仓库信息展示 -->
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="error" class="error">
      😢 连接失败：{{ error }}
    </div>

    <div v-else class="repo-info">
      <p>🎉 成功连接到仓库：{{ repoInfo.full_name }}</p>
      <p>⭐ 星星数：{{ repoInfo.stargazers_count }}</p>
      <p>📝 已有心愿：{{ repoInfo.open_issues_count }} 个</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Octokit } from 'octokit'

interface RepoInfo {
  full_name: string
  stargazers_count: number
  open_issues_count: number
}

const repoInfo = ref<RepoInfo>({
  full_name: '',
  stargazers_count: 0,
  open_issues_count: 0
})
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const octokit = new Octokit({ 
      auth: import.meta.env.VITE_GH_TOKEN 
    })
    
    const { data } = await octokit.rest.repos.get({
      owner: import.meta.env.VITE_REPO_OWNER,
      repo: import.meta.env.VITE_REPO_NAME
    })

    repoInfo.value = {
      full_name: data.full_name,
      stargazers_count: data.stargazers_count,
      open_issues_count: data.open_issues_count
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.romantic-title {
  color: #ff6b6b;
  text-align: center;
  margin: 2rem 0;
}

.heart-divider {
  color: #ff9a9e;
  font-size: 1.5em;
  margin: 0.5rem 0;
}

.repo-info {
  background: rgba(255, 245, 245, 0.9);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem auto;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.1);
}

.repo-info p {
  margin: 0.8rem 0;
  color: #795548;
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
</style>