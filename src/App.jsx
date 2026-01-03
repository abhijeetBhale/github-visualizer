import { useState, useCallback } from 'react';
import { RepoInput } from './components/core/RepoInput';
import { Dashboard } from './components/core/Dashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { fetchAllRepoData } from './api/github';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen text-slate-100 p-6 md:p-12 font-sans selection:bg-cyan-500/30">
      <main className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Repo Visualizer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Explore GitHub repositories through interactive and modern visualizations.
            Paste a URL below to get started.
          </motion.p>
        </header>

        <RepoInput onFetch={handleFetchData} isLoading={isLoading} />

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="loader"
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              key="error"
            >
              <ErrorMessage message={error} />
            </motion.div>
          )}

          {repoData && !isLoading && (
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              key="dashboard"
             >
                <Dashboard data={repoData} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;