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
      this.error = "";
      try {
        this.wishes = await fetchWishes();
      } catch (err) {
        this.error = err instanceof Error ? err.message : "加载失败";
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    sortedWishes: (state) => {
      return [...state.wishes].sort((a, b) => b.likes - a.likes);
    },
  },
});