interface GitHubInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface GitHubCommitInfo extends GitHubInfo {
  name: string;
  commit: {
    commit: {
      committer: {
        date: string;
      };
    };
  };
}

interface GitHubRepoResponse extends GitHubInfo {
  stargazers_count: number;
  open_issues_count: number;
  forks: number;
}

export const fetchGitHubInfo = async (): Promise<{
  repoData: GitHubRepoResponse;
  branchData: GitHubCommitInfo;
}> => {
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
        repoResponse.json(),
        branchResponse.json(),
      ]);

      return {
        repoData: repoData as GitHubRepoResponse,
        branchData: branchData as GitHubCommitInfo,
      };
    } else {
      throw new Error("Failed to fetch repository or branch information");
    }
  } catch (error) {
    console.error(error);
    return { repoData: {} as GitHubRepoResponse, branchData: {} as GitHubCommitInfo };
  }
};
