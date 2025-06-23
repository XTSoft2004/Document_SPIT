export interface ITreeNode {
  title: string
  key: string
  isLeaf: boolean
  path: string[]
  icon: React.ReactNode
  id: string
  children: TreeNode[]
}
