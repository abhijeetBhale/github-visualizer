import { useEffect, useState } from 'react';
import { buildFileTree } from '../../utils/helpers';
import { TreeNode } from './TreeNode'; // Import the new component

export const FileTree = ({ fileList, repoName }) => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const hierarchicalTree = buildFileTree(fileList);
    if (hierarchicalTree.children.length > 0) {
      hierarchicalTree.name = repoName;
      setTreeData(hierarchicalTree);
    } else {
      setTreeData(null);
    }
  }, [fileList, repoName]);

  if (!treeData) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-4 rounded-xl shadow-lg flex items-center justify-center">
        <p>File tree is empty or could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-4 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-100">File Structure</h3>
      <div className="overflow-y-auto h-[calc(100%-40px)] pr-2">
        <ul>
          {/* We only need to render the root's children */}
          {treeData.children.map((node) => (
            <TreeNode key={node.name} node={node} />
          ))}
        </ul>
      </div>
    </div>
  );
};