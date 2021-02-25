import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

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
}
@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit{
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
    this.dataTree = this.buildDataTree (this.data, 0);
    this.filteredDataTree = this.dataTree;
    this.dataSource.data = this.filteredDataTree;
  }
  buildDataTree(obj: {[key:string]: any}, level: number): TreeNode[]{
    return Object.keys(obj).reduce<TreeNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNode();
      node.key = key;
      if (value !== null){
        if (typeof value === "object"){
          node.children = this.buildDataTree(value, level+1);
        }else{
          node.value = value;
        }
      }
      return accumulator.concat(node);
    },[]);
  }
  get filterText(): string {
    return this._filterText;
  }
  set filterText(value: string) {
    this._filterText = value;
    this.treeControl.collapseAll();
    this.filteredDataTree = this._filterText ? this.performFilter(this._filterText) : this.dataTree;
    this.dataSource.data = this.filteredDataTree;
  }
  performFilter(filterKey: string): TreeNode[] {
    filterKey = filterKey.toLocaleLowerCase();
    const filteredNestedNodes: Set<TreeNode> = new Set<TreeNode>();

    this.flatNodeMap.forEach((nestedNode: TreeNode, flatNode: FlatTreeNode,) => {
      if (flatNode.key.toLowerCase().indexOf(filterKey) !== - 1) {
        // Node has no parent
        if (flatNode.level === 0) {
          filteredNestedNodes.add(nestedNode);
          return;
          // Node has parent
        } else {
          let currentNode = flatNode;
          while (currentNode !== null) {
            const parentNode = this.getParentNode(currentNode);
            if (parentNode) {
              // Expand parent node contains filter text
              this.treeControl.expand(parentNode);
              // Only add the top parent to the list
              if (parentNode.level === 0) {
                filteredNestedNodes.add(this.flatNodeMap.get(parentNode));
              }
            }
            currentNode = parentNode;
          };
        }
      }
    });
    return Array.from(filteredNestedNodes);
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
  toggleExpand(){
    this.expanded = !this.expanded;
    this.expanded? this.treeControl.expandAll() : this.treeControl.collapseAll();
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

  hasChild = (_: number, _nodeData: FlatTreeNode) => _nodeData.expandable;
  getPadding(node: FlatTreeNode){
    const indentPixel = 40;
    return (node.level * indentPixel).toString();
  }
}
