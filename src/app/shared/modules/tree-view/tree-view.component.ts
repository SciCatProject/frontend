import { Component, Input, OnChanges } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { FormGroup } from '@angular/forms';

export class TreeNode {
  children: TreeNode[];
  key: string;
  value: any;
}
export class FlatTreeNode {
  key: string;
  value: any;
  level: number;
  expandable: boolean;
}
@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnChanges{
  treeControl: FlatTreeControl<FlatTreeNode>;
  treeFlattener: MatTreeFlattener<TreeNode, FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatTreeNode>;
  flatNodeMap = new Map<FlatTreeNode, TreeNode>();
  nestNodeMap = new Map<TreeNode, FlatTreeNode>();
  dataTree: TreeNode[];

  @Input() data: any;
  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatTreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }
  ngOnChanges(){
    this.dataTree = this.convertObjectToDataTree(this.data, 0);
    this.dataSource.data = this.dataTree;
  }

  getLevel = (node: FlatTreeNode) => node.level;
  isExpandable = (node: FlatTreeNode) => node.expandable;
  getChildren = (node: TreeNode): TreeNode[] => node.children;
  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestNodeMap.get(node);
    const flatNode = existingNode && existingNode.key === node.key? existingNode : new FlatTreeNode();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  }
  convertObjectToDataTree(obj: {[key:string]: any}, level: number): TreeNode[]{
    return Object.keys(obj).reduce<TreeNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNode();
      node.key = key;
      if (value !== null){
        if (typeof value === "object"){
          node.children = this.convertObjectToDataTree(value, level+1);
        }else{
          node.value = value;
        }
      }
      return accumulator.concat(node);
    },[]);
  }
  convertDataTreeToObject(tree: TreeNode[]): {[key: string]: any}{
    return tree.reduce((accumulator, node ) => {
      if ( node.value){
        accumulator[node.key] = node.value;
      }else{
        if (node.children && node.children.length > 0){
          accumulator[node.key] = this.convertDataTreeToObject(node.children);
        }else {
          accumulator[node.key] = null;
        }
      }
      return accumulator;
    }, {})
  }
  hasChild = (_: number, _nodeData: FlatTreeNode) => _nodeData.expandable;

  insertItem(parent: TreeNode, key: string, value: any){
    if(parent.children){
      parent.children.push({key, value} as TreeNode);
    }
    this.dataSource.data = this.dataTree;
  }
  addNewItem(node: FlatTreeNode){
    const parentNode = this.flatNodeMap.get(node);
    this.insertItem(parentNode, '', '');
    this.treeControl.expand(node);
  }
  saveNode(node: FlatTreeNode, key: string, value: any){
    const nestedNode = this.flatNodeMap.get(node);
    this.updateItem(nestedNode, key, value);
  }
  updateItem(node: TreeNode, key: string, value: string){
    node.key = key;
    node.value = value;
    this.dataSource.data = this.dataTree;
  }
  deleteItem(node: FlatTreeNode){
    const parentNode = this.getParentNode(node);
    const flatParentNode = this.flatNodeMap.get(parentNode);
    if(flatParentNode && flatParentNode.children){
      flatParentNode.children = flatParentNode.children.filter(e => e.key !== node.key);
    } else {
      this.dataTree = this.dataTree.filter(e => e.key !== node.key);
    }
    this.dataSource.data = this.dataTree;
  }
  editItem(node: FlatTreeNode, key: string, value: string){
    const nestedNode = this.flatNodeMap.get(node);
    this.updateItem(nestedNode, key, value);
    this.dataSource.data = this.dataTree;
  }
  hasNoContent = (_: number, _nodeData: FlatTreeNode) => _nodeData.key === '';
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
}
