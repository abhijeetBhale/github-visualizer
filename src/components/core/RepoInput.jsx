import { useState } from 'react';
import { motion } from 'framer-motion';

export const RepoInput = ({ onFetch, isLoading }) => {
  // UPDATED: Change the initial state to a full URL
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl && !isLoading) {
      onFetch(repoUrl, token);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 items-start sm:items-end w-full max-w-3xl mx-auto"
    >
      <div className="w-full">
        <label htmlFor="repoPath" className="block text-sm font-medium text-gray-300 mb-1">
          GitHub Repository URL
        </label>
        <input
          id="repoPath"
          type="text"
          // UPDATED: Change placeholder to reflect URL format
          placeholder="e.g., https://github.com/freeCodeCamp/freeCodeCamp"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <div className="w-full sm:w-80">
        <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-1">
          GitHub Token <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          id="token"
          type="password"
          placeholder="Improves rate limit"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex-shrink-0"
      >
        {isLoading ? 'Loading...' : 'Visualize ✨'}
      </button>
    </motion.form>
  );
};