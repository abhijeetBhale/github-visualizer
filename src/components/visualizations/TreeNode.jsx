import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFolder, FaFolderOpen, FaFileCode } from 'react-icons/fa';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

const variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.2 }
  },
};

export const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDirectory = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li className="my-1">
      <div
        onClick={handleToggle}
        className="flex items-center p-1 rounded-md cursor-pointer hover:bg-slate-700/50 transition-colors"
      >
        {isDirectory ? (
          <>
            {isOpen ? <FiChevronDown className="mr-2 flex-shrink-0" /> : <FiChevronRight className="mr-2 flex-shrink-0" />}
            {isOpen ? <FaFolderOpen className="mr-2 text-cyan-400 flex-shrink-0" /> : <FaFolder className="mr-2 text-cyan-400 flex-shrink-0" />}
          </>
        ) : (
          <FaFileCode className="mr-2 text-slate-400 flex-shrink-0 ml-4" />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && isDirectory && (
          <motion.ul
            key="content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            className="pl-6 border-l border-slate-700"
          >
            {node.children.map((childNode) => (
              <TreeNode key={childNode.name} node={childNode} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};