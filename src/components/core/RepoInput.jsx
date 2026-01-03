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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 w-full max-w-3xl mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl"
    >
      <div className="flex-grow space-y-2">
        <label htmlFor="repoPath" className="block text-sm font-semibold text-slate-300 ml-1">
          Repository URL
        </label>
        <div className="relative group">
          <input
            id="repoPath"
            type="text"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600 text-slate-200"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>

      <div className="w-full md:w-64 space-y-2">
         <label htmlFor="token" className="block text-sm font-semibold text-slate-300 ml-1">
          Token <span className="text-slate-500 font-normal text-xs">(Optional)</span>
        </label>
        <input
          id="token"
          type="password"
          placeholder="ghp_..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600 text-slate-200"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto h-[50px] px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading
            </span>
          ) : (
            'Visualize'
          )}
        </button>
      </div>
    </motion.form>
  );
};