// src/utils/githubClient.ts
import { Octokit } from "octokit";

export interface Wish {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  labels: string[];
  likes: number;
}

export const fetchWishes = async (): Promise<Wish[]> => {
  try {
    const octokit = new Octokit();
    const { data } = await octokit.rest.issues.listForRepo({
      owner: import.meta.env.VITE_REPO_OWNER,
      repo: import.meta.env.VITE_REPO_NAME,
      labels: 'wish',
      state: 'open'
    });

    return data.map((issue): Wish => ({
      id: issue.number,
      title: issue.title || '未命名心愿',
      content: issue.body || '',
      createdAt: issue.created_at,
      labels: (issue.labels || [])
        .map(l => typeof l === 'string' ? l : l?.name || '')
        .filter(Boolean) as string[],
      likes: issue.reactions?.['+1'] || 0
    }));
  } catch (error) {
    console.error('API Error Details:', error);
    throw new Error(`获取心愿列表失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};