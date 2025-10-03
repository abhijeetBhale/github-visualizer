import { useState, useCallback } from 'react';
import { RepoInput } from './components/core/RepoInput';
import { Dashboard } from './components/core/Dashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { fetchAllRepoData } from './api/github';

function App() {
  const [repoData, setRepoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = useCallback(async (repoUrl, token) => {
    setIsLoading(true);
    setRepoData(null);
    setError(null);

    try {
      // UPDATED: Add URL parsing logic
      const url = new URL(repoUrl);
      if (url.hostname !== 'github.com') {
        throw new Error("Invalid URL. Please provide a link to a GitHub repository.");
      }
      
      const pathParts = url.pathname.split('/').filter(part => part); // Split and remove empty parts
      if (pathParts.length < 2) {
        throw new Error("Invalid GitHub repository URL. It should look like 'https://github.com/owner/repo'.");
      }

      const [owner, repo] = pathParts;
      // End of updated section

      const data = await fetchAllRepoData(owner, repo, token);
      if(!data.repoDetails) {
        throw new Error("Repository not found or access token is invalid.");
      }
      setRepoData(data);
    } catch (err) {
      console.error(err);
      // Use err.message to provide specific feedback from the parsing logic
      setError(err.message || 'Failed to fetch repository data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            GitHub Repository Visualizer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Enter a public repository URL to see its stats visualized.
          </p>
        </header>

        <RepoInput onFetch={handleFetchData} isLoading={isLoading} />

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {repoData && !isLoading && <Dashboard data={repoData} />}
      </main>
    </div>
  );
}

export default App;