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
  expand: boolean = false;
  dataTree: TreeNode[];
  _filterText = '';

  constructor() {
  }
  buildDataTree(obj: { [key: string]: any }, level: number): TreeNode[] {
    return Object.keys(obj).reduce<TreeNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNode();
      node.key = key;
      if ( value !== null && value !== undefined && typeof value === 'object') {
        if ('value' in value) {
          node.value = value.value;
          node.unit = value.unit || null;
        }else {
          node.children = this.buildDataTree(value, level + 1);
          node.value = value;
        }
      } else {
        node.value = value;
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
      const parentNode = this.getFlatParentNode(currentNode);
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
  getFlatParentNode(node: FlatNode): FlatNode | null {
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
  getNestedParent(node: FlatNode){
    const flatParentNode = this.getFlatParentNode(node);
    return this.flatNodeMap.get(flatParentNode);
  }
  toggleExpand() {
    this.expand = !this.expand;
    this.expand? this.treeControl.expandAll() : this.treeControl.collapseAll();
  }
  getLevel = (node: FlatNode) => node.level;
  isExpandable = (node: FlatNode) => node.expandable;
  getChildren = (node: TreeNode): TreeNode[] => node.children;
  hasChild = (_: number, _nodeData: FlatNode) => {return _nodeData.expandable};
  getPadding(node: FlatNode) {
    const indentPixel = 40;
    return (node.level * indentPixel).toString();
  }

  insertNode(parentNode: TreeNode, node: TreeNode, index: number = -1) {
    if (parentNode) {
      index = index === -1 ? parentNode.children.length: index;
      parentNode.children.splice(index, 0, node);
    } else {
      index = index === -1? 0 : index;
      this.dataTree.splice(index, 0, node);
    }
    this.dataSource.data = this.dataTree;
  }
  removeNode(parentNode: TreeNode, nestedNode: TreeNode) {
    if (parentNode) {
      // remove node from list of children
      parentNode.children = parentNode.children.filter(e => e !== nestedNode);
    } else {
      // node is on the root level
      this.dataTree = this.dataTree.filter(e => e !== nestedNode);
    }
    this.dataSource.data = this.dataTree;
  }
  getIndex(parentNode: TreeNode, node: TreeNode) {
    if (parentNode) {
      return parentNode.children.indexOf(node);
    } else {
      return this.dataTree.indexOf(node);
    }
  }
  getValueRepresentation(node: FlatNode){

    if(node.value === null){
      return 'null';
    }
    if(node.value === undefined){
      return 'undefined';
    }
    if (Array.isArray(node.value) && node.value.length === 0){
      return '[]';
    }
    if (node.value === ''){
      return '\"\"';
    }
    if (node.unit){
      return `${node.value} (${node.unit})`;
    }
    return node.value;
  }
}
