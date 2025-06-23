export interface ITreeNode {
  title: string
  key: string
  isLeaf: boolean
  path: string[]
  children: TreeNode[]
}
