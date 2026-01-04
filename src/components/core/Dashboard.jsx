import { motion } from 'framer-motion';
import { LanguageChart } from '../visualizations/LanguageChart';
import { CommitHistoryGraph } from '../visualizations/CommitHistoryGraph';
// Import the new SunburstChart instead of BubbleChart
import { SunburstChart } from '../visualizations/SunburstChart';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const Dashboard = ({ data }) => {
  const { languages, tree, commitActivity, repoDetails } = data;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
    >
      {/* Column 1: Language Chart and Commit History */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {languages && (
           <motion.div variants={itemVariants}>
            <LanguageChart languageData={languages} />
          </motion.div>
        )}
        {commitActivity && commitActivity.length > 0 && (
          <motion.div variants={itemVariants}>
            <CommitHistoryGraph commitData={commitActivity} />
          </motion.div>
        )}
      </div>

      {/* Column 2: The new Sunburst Chart */}
      <div className="lg:col-span-2">
        {tree && (
          <motion.div variants={itemVariants}>
            {/* Replace BubbleChart with SunburstChart */}
            <SunburstChart fileList={tree} repoName={repoDetails.name} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};