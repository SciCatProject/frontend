import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { FlatNode, TreeBase, TreeNode } from 'shared/sdk/models/ScientificMetadataTree';
import { MetadataInput} from 'shared/modules/scientific-metadata-tree/metadata-input/metadata-input.component';
import { MetadataEditComponent } from 'shared/modules/scientific-metadata/metadata-edit/metadata-edit.component';
export class FlatNodeEdit implements FlatNode {
  key: string;
  value: any;
  unit: string;
  level: number;
  expandable: boolean;
  visible: boolean;
  editing: boolean;
}
@Component({
  selector: 'tree-edit',
  templateUrl: './tree-edit.component.html',
  styleUrls: ['./tree-edit.component.scss'],
})
export class TreeEditComponent extends TreeBase implements OnInit {
  @Input() data: any;
  currentEditingNode: FlatNodeEdit | null = null;
  filteredUnits$: Observable<string[]>;
  currentInputData: MetadataInput;
  constructor() {
    super();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatNodeEdit>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.nestNodeMap = new Map<TreeNode, FlatNodeEdit>();
    this.flatNodeMap = new Map<FlatNodeEdit, TreeNode>();
  }
  ngOnInit() {
    this.dataTree = this.buildDataTree(this.data, 0);
    this.dataSource.data = this.dataTree;
  }
  transformer = (node: TreeNode, level: number): FlatNodeEdit => {
    const existingNode = this.nestNodeMap.get(node) as FlatNodeEdit;
    const flatNode = existingNode && existingNode.key === node.key ? existingNode : new FlatNodeEdit();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.expandable = !!node.children?.length;
    flatNode.editing = node.key === '' ? true : false;
    flatNode.visible = true;
    flatNode.unit = node.unit;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  }
  @HostListener('click', ['$event'])
  stopPropagationToChildComponent(event) {
    event.stopPropagation();
  }
  @HostListener('document:click')
  saveData() {
    if (this.currentEditingNode){
      this.saveCurrentEditingNodeToDataTree();
    }
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
  convertDataTreeToObject(tree: TreeNode[]): { [key: string]: any } {
    return tree.reduce((accumulator, node) => {
      if (!this.isEmptyNode(node)) {
        if (node.value) {
          accumulator[node.key] = node.value;
        } else {
          if (node.children && node.children.length > 0) {
            accumulator[node.key] = this.convertDataTreeToObject(node.children);
          } else {
            accumulator[node.key] = null;
          }
        }
      }
      return accumulator;
    }, {})
  }
  setCurrentEditingNode(node: FlatNodeEdit) {
    if (this.currentEditingNode) {
      this.saveCurrentEditingNodeToDataTree();
    }
    this.currentEditingNode = node;
    this.currentEditingNode.editing = true;
  }
  setCurrentInputData(data: MetadataInput){
    this.currentInputData = data;
  }
  saveCurrentEditingNodeToDataTree() {
    if(this.currentInputData){
      const nestedNode = this.flatNodeMap.get(this.currentEditingNode);
      this.updateNodeData(nestedNode, this.currentInputData);
      this.currentInputData = null;
    }
    this.currentEditingNode.editing = false;
    this.currentEditingNode = null;
  }
  updateNodeData(node: TreeNode, data: MetadataInput) {
    switch(data.fieldType){
      case "date":
        node.key = data.fieldName;
        node.value = Date.parse(data.fieldValue);
        node.unit = null;
        break;
      case "string":
        node.key = data.fieldName;
        node.value = data.fieldValue;
        node.unit = null;
        break;
      case "number":
        node.key = data.fieldName;
        node.value = Number(data.fieldValue);
        node.unit = null;
        break;
      case "quantity":
        node.key = data.fieldName;
        node.value = Number(data.fieldValue);
        node.unit = data.fieldUnit;
        break;
      case "object":
        node.key = data.fieldName;
        node.value = null;
        node.unit = null;
        break;
      default:
    }
    this.dataSource.data = this.dataTree;
  }

  isEmptyNode(node: TreeNode) {
    return node.key === "";
  }

  insertItem(parent: TreeNode, key: string, value: any) {
    if (parent.children) {
      parent.children.push({ key, value } as TreeNode);
    }
    this.dataSource.data = this.dataTree;
  }
  addNewItem(node: FlatNodeEdit) {
    const newNode = new TreeNode();
    newNode.key = "";
    if (node) {
      const parentNode = this.flatNodeMap.get(node);
      if (parentNode.children) {
        parentNode.children.push(newNode);
      }
      this.treeControl.expand(node);
    } else {
      this.dataTree.push(newNode);
    }
    this.dataSource.data = this.dataTree;
    this.setCurrentEditingNode(this.nestNodeMap.get(newNode) as FlatNodeEdit);
  }

  deleteItem(node: FlatNodeEdit) {
    const parentNode = this.getParentNode(node);
    const flatParentNode = this.flatNodeMap.get(parentNode);
    if (flatParentNode && flatParentNode.children) {
      flatParentNode.children = flatParentNode.children.filter(e => e.key !== node.key);
    } else {
      this.dataTree = this.dataTree.filter(e => e.key !== node.key);
    }
    this.dataSource.data = this.dataTree;
  }

  hasNoContent = (_: number, _nodeData: FlatNodeEdit) => _nodeData.key === '';

  isEditing(_:number, node: FlatNodeEdit){
    return node.editing;
  }
  doSave() {
    this.data = this.convertDataTreeToObject(this.dataTree);
  }
  undo() {

  }
  redo() {

  }
}
