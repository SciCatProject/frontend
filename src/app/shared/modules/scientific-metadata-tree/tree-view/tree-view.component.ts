import { Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatNode, TreeBase, TreeNode } from 'shared/modules/scientific-metadata-tree/base-classes/tree-base';
@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent extends TreeBase implements OnInit {
  @Input() data: any;
  constructor() {
    super();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.nestNodeMap = new Map<TreeNode, FlatNode>();
    this.flatNodeMap = new Map<FlatNode, TreeNode>();
  }
  ngOnInit() {
    this.dataTree = this.buildDataTree(this.data, 0);
    this.dataSource.data = this.dataTree;
  }
  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestNodeMap.get(node);
    const flatNode = existingNode && existingNode.key === node.key ? existingNode : new FlatNode();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.unit = node.unit;
    flatNode.expandable = node.children?.length > 0;
    flatNode.visible = true;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  }
  buildDataTree(obj: { [key: string]: any }, level: number): TreeNode[] {
    return Object.keys(obj).reduce<TreeNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNode();
      node.key = key;
      if (value) {
        if (typeof value === "object") {
          if ("value" in value){
            node.value = value.value;
            node.unit = value.unit || null;
          } else {
            node.children = this.buildDataTree(value, level + 1);
          }
        } else {
          node.value = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}
