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
      labels: "wish", // 只获取标记为wish的issues
      state: "open",
    });

    return data.map((issue) => ({
      id: issue.number,
      title: issue.title,
      content: issue.body || "",
      createdAt: issue.created_at,
      labels: issue.labels?.map((l) => (typeof l === "string" ? l : l.name)) || [],
      likes: issue.reactions?.plus_one || 0,
    }));
  } catch (error) {
    throw new Error("获取心愿列表失败");
  }
};