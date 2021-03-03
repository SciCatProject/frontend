import { FlatTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";

export class TreeNode{
  children: TreeNode[];
  key: string;
  value: any;
  unit: string;
}
export class FlatNode{
  key: string;
  value: any;
  unit: string;
  level: number;
  expandable: boolean;
  visible: boolean;
}
@Component({
  template: ''
})
export class TreeBase {
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<TreeNode, FlatNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatNode>;
  flatNodeMap: Map<FlatNode, TreeNode>;
  nestNodeMap: Map<TreeNode, FlatNode>;
  expanded: boolean;
  dataTree: TreeNode[];
  _filterText = '';
  constructor() {
    this.expanded = false;
  }
  get filterText(): string {
    return this._filterText;
  }
  set filterText(value: string) {
    this._filterText = value;
    this.treeControl.collapseAll();
    this._filterText? this.performFilter(this._filterText) : this.showAllNodes();
  }

  isVisible(_: number, node: FlatNode){
    return node.visible;
  }
  showAllNodes() {
    this.treeControl.dataNodes.forEach((node: FlatNode) => node.visible = true);
  }
  hideAllNodes() {
    this.treeControl.dataNodes.forEach((node: FlatNode) => node.visible = false)
  }
  performFilter(filterText: string) {
    filterText = filterText.toLowerCase();
    const filteredNodes = this.treeControl.dataNodes.filter((node: FlatNode) => node.key.toLowerCase().indexOf(filterText) !== -1);
    this.hideAllNodes();
    filteredNodes.forEach((node: FlatNode) => {
      node.visible = true;
      if(node.expandable){
        const nestedNode = this.flatNodeMap.get(node);
        this.setChildrenVisible(nestedNode.children);
      }
      if (node.level > 0) {
        this.setParentVisible(node);
      }
    });
  }
  setParentVisible(node: FlatNode){
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
  setChildrenVisible(children: TreeNode[]){
    children.map((node: TreeNode) => {
      const flatNode = this.nestNodeMap.get(node);
      flatNode.visible = true;
      if (node.children){
        this.setChildrenVisible(node.children);
      }
    });
  }
  getParentNode(node: FlatNode): FlatNode | null {
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
  getLevel = (node: FlatNode) => node.level;
  isExpandable = (node: FlatNode) => node.expandable;
  getChildren = (node: TreeNode): TreeNode[] => node.children;
  hasChild = (_: number, _nodeData: FlatNode) => _nodeData.expandable;
  getPadding(node: FlatNode) {
    const indentPixel = 40;
    return (node.level * indentPixel).toString();
  }
}
