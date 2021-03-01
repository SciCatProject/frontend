import { Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

export class TreeNode {
  children: TreeNode[];
  key: string;
  value: any;
  unit: string;
}
export class FlatTreeNode {
  unit: string;
  key: string;
  value: any;
  level: number;
  expandable: boolean;
  visible: boolean;
}
@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {
  treeControl: FlatTreeControl<FlatTreeNode>;
  treeFlattener: MatTreeFlattener<TreeNode, FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatTreeNode>;
  flatNodeMap = new Map<FlatTreeNode, TreeNode>();
  nestNodeMap = new Map<TreeNode, FlatTreeNode>();
  expanded = false;
  dataTree: TreeNode[];
  filteredDataTree: TreeNode[];
  _filterText = '';
  @Input() data: any;
  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatTreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }
  ngOnInit() {
    this.dataTree = this.buildDataTree(this.data, 0);
    this.dataSource.data = this.dataTree;
  }
  buildDataTree(obj: { [key: string]: any }, level: number): TreeNode[] {
    return Object.keys(obj).reduce<TreeNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNode();
      node.key = key;
      if (value !== null) {
        if (typeof value === "object") {
          node.children = this.buildDataTree(value, level + 1);
        } else {
          node.value = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
  get filterText(): string {
    return this._filterText;
  }
  set filterText(value: string) {
    this._filterText = value;
    this.treeControl.collapseAll();
    this._filterText ? this.performFilter(this._filterText) : this.showAllNodes();
  }
  isVisible(_: number, node: FlatTreeNode) {
    return node.visible;
  }
  showAllNodes() {
    this.treeControl.dataNodes.forEach((node: FlatTreeNode) => node.visible = true);
  }
  hideAllNodes() {
    this.treeControl.dataNodes.forEach((node: FlatTreeNode) => node.visible = false)
  }
  performFilter(filterText: string) {
    filterText = filterText.toLowerCase();
    const filteredNodes = this.treeControl.dataNodes.filter((node: FlatTreeNode) => node.key.toLowerCase().indexOf(filterText) !== -1);
    this.hideAllNodes();
    filteredNodes.forEach((node: FlatTreeNode) => {
      node.visible = true;
      if (node.expandable) {
        const nestedNode = this.flatNodeMap.get(node);
        this.setChildrenVisible(nestedNode.children);
      }
      if (node.level > 0) {
        let currentNode = node;
        while (currentNode !== null) {
          const parentNode = this.getParentNode(currentNode);
          if (parentNode) {
            // Expand parent node contains filter text
            parentNode.visible = true;
            this.treeControl.expand(parentNode);
          }
          currentNode = parentNode;
        };
      }
    });
  }
  setChildrenVisible(children: TreeNode[]) {
    children.map((node: TreeNode) => {
      const flatNode = this.nestNodeMap.get(node);
      flatNode.visible = true;
      if (node.children) {
        this.setChildrenVisible(node.children);
      }
    });
  }
  getParentNode(node: FlatTreeNode): FlatTreeNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  toggleExpand() {
    this.expanded = !this.expanded;
    this.expanded ? this.treeControl.expandAll() : this.treeControl.collapseAll();
  }
  getLevel = (node: FlatTreeNode) => node.level;
  isExpandable = (node: FlatTreeNode) => node.expandable;
  getChildren = (node: TreeNode): TreeNode[] => node.children;
  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestNodeMap.get(node);
    const flatNode = existingNode && existingNode.key === node.key ? existingNode : new FlatTreeNode();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.expandable = !!node.children?.length;
    flatNode.visible = true;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  }

  hasChild = (_: number, _nodeData: FlatTreeNode) => _nodeData.expandable;
  getPadding(node: FlatTreeNode) {
    const indentPixel = 40;
    return (node.level * indentPixel).toString();
  }
}
