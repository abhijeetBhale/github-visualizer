import { Octokit } from "octokit";

// This helper function initializes Octokit with an optional auth token
const getOctokit = (token) => {
  return new Octokit({ auth: token || undefined });
};

/**
 * Fetches all necessary data for a given repository.
 * @param {string} owner - The repository owner's username.
 * @param {string} repo - The repository name.
 * @param {string} token - An optional GitHub Personal Access Token.
 * @returns {Promise<object>} - A promise that resolves to an object containing all fetched data.
 */
export const fetchAllRepoData = async (owner, repo, token) => {
  const octokit = getOctokit(token);

  // Use Promise.allSettled to ensure all requests complete, even if some fail
  const results = await Promise.allSettled([
    // 1. Fetch main repository details (for name, description, etc.)
    octokit.request('GET /repos/{owner}/{repo}', { owner, repo }),
    // 2. Fetch language breakdown
    octokit.request('GET /repos/{owner}/{repo}/languages', { owner, repo }),
    // 3. Fetch commit activity for the last year
    octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', { owner, repo }),
    // 4. Fetch the file tree (recursively)
    octokit.request('GET /repos/{owner}/{repo}/git/trees/main?recursive=1', { owner, repo }),
  ]);
  
  // Destructure results, handling potential rejections
  const [repoDetails, languages, commitActivity, tree] = results.map(r => r.status === 'fulfilled' ? r.value.data : null);

  // The commit_activity endpoint can return a 202 while GitHub computes stats.
  // We handle this by returning an empty array, prompting the user to try again later.
  if (!commitActivity) {
    console.warn("Commit activity data is being computed by GitHub. Please try again in a few moments.");
  }

  return {
    repoDetails,
    languages,
    commitActivity: commitActivity || [],
    tree: tree ? tree.tree : [], // The actual list is in the 'tree' property
  };
};