import type { GitHubBranchResponse, GitHubInfoResponse, GitHubRepoResponse } from "../types/github";
import { showToast } from "../utils";

/**
 * Function to fetch GitHub repository and branch information.
 * @returns {Promise<GitHubInfoResponse>} Promise that resolves to an object containing repository and branch data.
 */
export const fetchGitHubInfo = async (): Promise<GitHubInfoResponse> => {
  const username = "maciekt07";
  const repo = "TodoApp";
  const branch = "main";

  try {
    const [repoResponse, branchResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${username}/${repo}`),
      fetch(`https://api.github.com/repos/${username}/${repo}/branches/${branch}`),
    ]);

    if (repoResponse.ok && branchResponse.ok) {
      const [repoData, branchData] = await Promise.all([
        repoResponse.json() as Promise<GitHubRepoResponse>,
        branchResponse.json() as Promise<GitHubBranchResponse>,
      ]);

      return {
        repoData,
        branchData,
      };
    } else {
      // Check if rate limit exceeded
      if (repoResponse.status === 403 && branchResponse.status === 403) {
        if (process.env.NODE_ENV === "development")
          return { repoData: {}, branchData: {} } as GitHubInfoResponse; // Skip in dev mode
        showToast("Github API rate limit exceeded temporarily for your IP address.", {
          type: "error",
          disableVibrate: true,
        });
      } else {
        throw new Error("Failed to fetch repository or branch information");
      }
    }
  } catch (error) {
    console.error(error);
    if (navigator.onLine) {
      showToast("Failed to fetch Github API.", { type: "error", disableVibrate: true });
    }
  }
  // Return a default value in case of error
  return { repoData: {}, branchData: {} } as GitHubInfoResponse;
};
