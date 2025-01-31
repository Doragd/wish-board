// src/stores/wishStore.ts
import { defineStore } from "pinia";
import { fetchWishes, type Wish } from "@/utils/githubClient";

export const useWishStore = defineStore("wish", {
  state: () => ({
    wishes: [] as Wish[],
    loading: false,
    error: "",
  }),
  actions: {
    async loadWishes() {
      this.loading = true;
      this.error = '';
      try {
        this.wishes = await fetchWishes();
      } catch (err) {
        const message = err instanceof Error ? err.message : '加载失败';
        this.error = `错误代码：${(err as any)?.status || 500}，原因：${message}`;
        console.error('完整错误对象:', err);
      } finally {
        this.loading = false;
      }
    }
  },
  getters: {
    sortedWishes: (state) => {
      return [...state.wishes].sort((a, b) => b.likes - a.likes);
    },
  },
});