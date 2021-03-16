import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { FlatNode, TreeBase, TreeNode } from 'shared/modules/scientific-metadata-tree/base-classes/tree-base';
import { InputData, MetadataInput } from 'shared/modules/scientific-metadata-tree/metadata-input/metadata-input.component';
import { HistoryManager } from 'shared/modules/scientific-metadata-tree/base-classes/history-manager'
import { MatDialog } from '@angular/material/dialog';
import { InputObject, MetadataInputModalComponent } from '../metadata-input-modal/metadata-input-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @Input() metadata: any;
  currentEditingNode: FlatNodeEdit | null = null;
  lastSavedChanges: number = -1;
  filteredUnits$: Observable<string[]>;
  currentInputData: MetadataInput;
  historyManager: HistoryManager;
  @Output() save = new EventEmitter<object>();
  @Output() hasUnsavedChanges = new EventEmitter<boolean>();
  private changed: boolean = false;
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {
    super();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatNodeEdit>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.nestNodeMap = new Map<TreeNode, FlatNodeEdit>();
    this.flatNodeMap = new Map<FlatNodeEdit, TreeNode>();
    this.historyManager = new HistoryManager();
    this.historyManager.indexChanged.subscribe((index: number) => {
        this.hasUnsavedChanges.emit(!(this.lastSavedChanges === index));
      },
    );
  }
  ngOnInit() {
    this.dataTree = this.buildDataTree(this.metadata, 0);
    this.dataSource.data = this.dataTree;
  }

  transformer = (node: TreeNode, level: number): FlatNodeEdit => {
    const existingNode = this.nestNodeMap.get(node) as FlatNodeEdit;
    const flatNode = existingNode && existingNode.key === node.key ? existingNode : new FlatNodeEdit();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.expandable = node.children?.length > 0;
    flatNode.editing = node.key === '' ? true : false;
    flatNode.visible = true;
    flatNode.unit = node.unit;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  }

  buildDataTree(obj: { [key: string]: any }, level: number): TreeNode[] {
    return Object.keys(obj).reduce<TreeNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNode();
      node.key = key;
      if (value !== null && typeof value !== undefined && typeof value === "object") {
        if ("value" in value) {
          node.value = value.value;
          node.unit = value.unit || null;
        } else {
          node.children = this.buildDataTree(value, level + 1);
        }
      } else {
        node.value = value;
      }
      return accumulator.concat(node);
    }, []);
  }

  convertDataTreeToObject(tree: TreeNode[]): { [key: string]: any } {
    return tree.reduce((accumulator, node) => {
      if (!this.hasNoContent(node)) {
        if (node.children && node.children.length > 0) {
          accumulator[node.key] = this.convertDataTreeToObject(node.children);
        } else {
          if (node.unit) {
            accumulator[node.key] = { value: node.value, unit: node.unit };
          } else {
            accumulator[node.key] = node.value;
          }
        }
        return accumulator;
      }
    }, {})
  }

  openSnackbar(message: string, action: string = "") {
    this.snackBar.open(message, action, {
      duration: 3000
    })
  }
  onSave(data: InputData) {
    const nestedNode = this.flatNodeMap.get(this.currentEditingNode);
    const parentNode = this.getNestedParent(this.nestNodeMap.get(nestedNode));
    const { children, ...oldData } = nestedNode;
    const index = this.getIndex(parentNode, nestedNode);
    this.historyManager.add({
      undo: () => {
        if (oldData.key === "") {
          this.removeNode(parentNode, nestedNode);
        } else {
          nestedNode.key = oldData.key;
          nestedNode.value = oldData.value;
          nestedNode.unit = oldData.unit;
        }
        this.dataSource.data = this.dataTree;
      },
      redo: () => {
        if (oldData.key === "") {
          this.insertNode(parentNode, nestedNode, index);
        }
        this.updateNode(nestedNode, data);
      }
    });
    this.updateNode(nestedNode, data);
    this.currentEditingNode = null;
    this.openSnackbar("Your changes is cached, hit the save button on the top to save permanently!");
    this.disableEditing();
  }
  onCancel() {
    this.disableEditing();
  }
  disableEditing() {
    if (this.currentEditingNode) {
      this.currentEditingNode.editing = false;
      if (this.hasNoContent(this.currentEditingNode)) {
        const parent = this.getNestedParent(this.currentEditingNode);
        const node = this.flatNodeMap.get(this.currentEditingNode);
        this.removeNode(parent, node);
      }
    }
    this.currentEditingNode = null;
    this.changed = false;
  }
  enableEditing(node: FlatNodeEdit) {
    if (this.currentEditingNode) {
      if (this.changed) {
        this.snackBar.open("You are uncached changes in another row, please close or save it first!", "", {
          duration: 3000,
        });
        return;
      }
      this.disableEditing();
    }
    this.currentEditingNode = node;
    this.currentEditingNode.editing = true;
  }
  onChange() {
    this.changed = true;
  }
  addNewNode(parentNode: FlatNodeEdit) {
    if (this.currentEditingNode && this.changed) {
      this.openSnackbar("You are uncached changes in another row, please close or save it first!");
      return;
    }
    const newNode = new TreeNode();
    newNode.key = "";
    const nestedParentNode = this.flatNodeMap.get(parentNode);
    this.insertNode(nestedParentNode, newNode);
    const index = this.getIndex(nestedParentNode, newNode);
    this.treeControl.expand(parentNode);
    this.enableEditing(this.nestNodeMap.get(newNode) as FlatNodeEdit);
  }
  deleteNode(node: FlatNodeEdit) {
    const parentNode = this.getNestedParent(node);
    const nestedNode = this.flatNodeMap.get(node);
    const childIndex = this.getIndex(parentNode, nestedNode);
    this.historyManager.add({
      undo: () => {
        if (parentNode && parentNode.children.length === 0) {
          // Removing and readd parentNode before adding childNode is needed since matTree won't rerender the parentNode properly
          const grandfatherNode = this.getNestedParent(this.nestNodeMap.get(parentNode));
          const parentIndex = this.getIndex(grandfatherNode, parentNode);
          this.removeNode(grandfatherNode, parentNode);
          this.insertNode(parentNode, nestedNode, childIndex);
          this.insertNode(grandfatherNode, parentNode, parentIndex);
        } else {
          this.insertNode(parentNode, nestedNode, childIndex);
        }
      },
      redo: () => {
        this.removeNode(parentNode, nestedNode);
      }
    });
    this.removeNode(parentNode, nestedNode);
  }
  updateNode(node: TreeNode, data: InputData) {
    switch (data.type) {
      case "date":
        node.key = data.key;
        node.value = Date.parse(data.value);
        node.unit = null;
        break;
      case "string":
        node.key = data.key;
        node.value = data.value;
        node.unit = null;
        break;
      case "number":
        node.key = data.key;
        node.value = Number(data.value);
        node.unit = null;
        break;
      case "boolean":
        node.key = data.key;
        node.value = data.value === "true" ? true : false;
        node.unit = null;
        break;
      case "quantity":
        node.key = data.key;
        node.value = Number(data.value);
        node.unit = data.unit;
        break;
      default:
    }
    this.dataSource.data = this.dataTree;
  }

  hasNoContent = (node: TreeNode | FlatNodeEdit) => node.key === '';

  isEditing() {
    return this.currentEditingNode && this.changed;
  }
  doSave() {
    this.lastSavedChanges = this.historyManager.currentIdx;
    this.hasUnsavedChanges.emit(false);
    this.metadata = this.convertDataTreeToObject(this.dataTree);
    this.save.emit(this.metadata);
  }

  openObjectCreationDialog(node: FlatNodeEdit): void {
    const dialogRef = this.dialog.open(MetadataInputModalComponent, {
      width: "auto",
      data: node
    });

    dialogRef.afterClosed().subscribe((data: InputObject) => {
      const grandfatherNode = this.flatNodeMap.get(node);
      const parentNode = new TreeNode();
      parentNode.key = data.parent;
      const childNode = new TreeNode();
      const { parent, ...childData } = data;
      parentNode.children = [];
      this.insertNode(parentNode, childNode);
      this.updateNode(childNode, { ...childData, key: childData.child });
      this.insertNode(grandfatherNode, parentNode);
      const index = this.getIndex(grandfatherNode, parentNode);
      this.treeControl.expand(node);
      this.historyManager.add({
        undo: () => {
          this.removeNode(grandfatherNode, parentNode);
        },
        redo: () => {
          this.insertNode(grandfatherNode, parentNode, index);
        }
      })
      this.dataSource.data = this.dataTree;
    });
  }
}
