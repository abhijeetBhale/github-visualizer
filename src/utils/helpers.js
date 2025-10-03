/**
 * Converts a flat path list from the GitHub Git Trees API into a hierarchical structure.
 * @param {Array<object>} pathList - The array of file/folder objects.
 * @returns {object} - The root node of the hierarchical tree.
 */
export const buildFileTree = (pathList) => {
    const tree = { name: 'root', children: [] };
    
    if (!pathList || pathList.length === 0) {
      return tree;
    }
  
    pathList.forEach(item => {
      const pathParts = item.path.split('/');
      let currentNode = tree;
  
      pathParts.forEach((part, index) => {
        let childNode = currentNode.children.find(child => child.name === part);
  
        if (!childNode) {
          childNode = { name: part };
          // Only add a children array if it's not the last part (i.e., it's a directory)
          if (index < pathParts.length - 1 || item.type === 'tree') {
            childNode.children = [];
          }
          currentNode.children.push(childNode);
        }
        currentNode = childNode;
      });
    });
  
    return tree;
  };