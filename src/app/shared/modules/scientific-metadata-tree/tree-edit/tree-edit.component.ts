import { Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UnitsService } from "shared/services/units.service";
import { Observable } from 'rxjs';
import { startWith, map } from "rxjs/operators";
export class TreeNodeEdit {
  children: TreeNodeEdit[];
  key: string;
  value: any;

}
export class FlatTreeNodeEdit {
  key: string;
  value: any;
  level: number;
  expandable: boolean;
  editing: boolean;
}
@Component({
  selector: 'app-tree-edit',
  templateUrl: './tree-edit.component.html',
  styleUrls: ['./tree-edit.component.scss'],
})
export class TreeEditComponent implements OnInit {
  @Input() data: any;
  //Input control
  metadataForm: FormGroup;
  typeValues: string[] = ["date", "quantity", "number", "string", "object", 'list'];
  currentEditingNode: FlatTreeNodeEdit | null = null;
  units: string[];
  filteredUnits$: Observable<string[]>;
  _filterKey = '';
  //Tree control
  treeControl: FlatTreeControl<FlatTreeNodeEdit>;
  treeFlattener: MatTreeFlattener<TreeNodeEdit, FlatTreeNodeEdit>;
  dataSource: MatTreeFlatDataSource<TreeNodeEdit, FlatTreeNodeEdit>;
  flatNodeMap = new Map<FlatTreeNodeEdit, TreeNodeEdit>();
  nestNodeMap = new Map<TreeNodeEdit, FlatTreeNodeEdit>();
  dataTree: TreeNodeEdit[];
  filteredDataTree: TreeNodeEdit[];
  expanded = false;
  constructor(private formBuilder: FormBuilder, private unitsService: UnitsService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatTreeNodeEdit>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }
  ngOnInit() {
    this.metadataForm = this.addNewMetadata();
    this.dataTree = this.convertObjectToDataTree(this.data, 0);
    this.filteredDataTree = this.dataTree;
    this.dataSource.data = this.filteredDataTree;
  }

  get filterText(): string {
    return this._filterKey;
  }
  set filterText(value: string) {
    this._filterKey = value;
    this.treeControl.collapseAll();
    this.filteredDataTree = this._filterKey ? this.performFilter(this._filterKey) : this.dataTree;
    this.dataSource.data = this.filteredDataTree;
  }
  performFilter(filterKey: string): TreeNodeEdit[] {
    filterKey = filterKey.toLocaleLowerCase();
    const filteredNestedNodes: Set<TreeNodeEdit> = new Set<TreeNodeEdit>();

    this.flatNodeMap.forEach((nestedNode: TreeNodeEdit, flatNode: FlatTreeNodeEdit,) => {
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

  getLevel = (node: FlatTreeNodeEdit) => node.level;
  isExpandable = (node: FlatTreeNodeEdit) => node.expandable;
  getChildren = (node: TreeNodeEdit): TreeNodeEdit[] => node.children;
  transformer = (node: TreeNodeEdit, level: number) => {
    const existingNode = this.nestNodeMap.get(node);
    const flatNode = existingNode && existingNode.key === node.key ? existingNode : new FlatTreeNodeEdit();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.expandable = !!node.children?.length;
    flatNode.editing = node.key === '' ? true : false;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  }
  convertObjectToDataTree(obj: { [key: string]: any }, level: number): TreeNodeEdit[] {
    return Object.keys(obj).reduce<TreeNodeEdit[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNodeEdit();
      node.key = key;
      if (value !== null) {
        if (typeof value === "object") {
          node.children = this.convertObjectToDataTree(value, level + 1);
        } else {
          node.value = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
  convertDataTreeToObject(tree: TreeNodeEdit[]): { [key: string]: any } {
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
  isEmptyNode(node: TreeNodeEdit) {
    return node.key === "";
  }
  hasChild = (_: number, _nodeData: FlatTreeNodeEdit) => _nodeData.expandable;

  insertItem(parent: TreeNodeEdit, key: string, value: any) {
    if (parent.children) {
      parent.children.push({ key, value } as TreeNodeEdit);
    }
    this.dataSource.data = this.filteredDataTree;
  }
  addNewItem(node: FlatTreeNodeEdit) {
    const newNode = new TreeNodeEdit();
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
    this.dataSource.data = this.filteredDataTree;
    this.setCurrentEditingNode(this.nestNodeMap.get(newNode));
  }
  setCurrentEditingNode(node: FlatTreeNodeEdit) {
    if (this.currentEditingNode) {
      this.currentEditingNode.editing = false;
    }
    this.currentEditingNode = node;
    this.currentEditingNode.editing = true;
    this.addCurrentMetadata(this.currentEditingNode);
  }
  saveNode(node: FlatTreeNodeEdit, key: string, value: any) {
    const nestedNode = this.flatNodeMap.get(node);
    this.updateItem(nestedNode, key, value);
    this.dataSource.data = this.filteredDataTree;
  }
  updateItem(node: TreeNodeEdit, key: string, value: string) {
    node.key = key;
    node.value = value;
    this.dataSource.data = this.filteredDataTree;
  }
  deleteItem(node: FlatTreeNodeEdit) {
    const parentNode = this.getParentNode(node);
    const flatParentNode = this.flatNodeMap.get(parentNode);
    if (flatParentNode && flatParentNode.children) {
      flatParentNode.children = flatParentNode.children.filter(e => e.key !== node.key);
    } else {
      this.dataTree = this.dataTree.filter(e => e.key !== node.key);
    }
    this.dataSource.data = this.filteredDataTree;
  }
  editItem(node: FlatTreeNodeEdit) {
    const nestedNode = this.flatNodeMap.get(node);
    const { fieldName, fieldValue } = this.metadataForm.value;
    this.updateItem(nestedNode, fieldName, fieldValue);
    node.editing = false;
    this.currentEditingNode = null;
    this.dataSource.data = this.filteredDataTree;
  }
  hasNoContent = (_: number, _nodeData: FlatTreeNodeEdit) => _nodeData.key === '';
  getParentNode(node: FlatTreeNodeEdit): FlatTreeNodeEdit | null {
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

  detectType() {
    const type = this.metadataForm.get("fieldType").value;
    if (type === "quantity") {
      this.metadataForm.get("fieldUnit").enable();
      this.metadataForm
        .get("fieldUnit")
        .setValidators([Validators.required, this.unitValidator()]);
      this.metadataForm.get("fieldUnit").updateValueAndValidity();
    } else if (type === "object") {
      this.metadataForm.get("fieldValue").clearValidators();
      this.metadataForm.get("fieldValue").setValue(null);
      this.metadataForm.get("fieldValue").disable();

      this.metadataForm.get("fieldUnit").clearValidators();
      this.metadataForm.get("fieldUnit").setValue("");
      this.metadataForm.get("fieldUnit").disable();
    } else {
      this.metadataForm.get("fieldUnit").clearValidators();
      this.metadataForm.get("fieldUnit").setValue("");
      this.metadataForm.get("fieldUnit").disable();
    }
  }
  getUnits(): void {
    const name = this.metadataForm.get("fieldName").value;
    this.units = this.unitsService.getUnits(name);
    this.filteredUnits$ = this.metadataForm.get("fieldUnit").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        const filterValue = value.toLowerCase();
        return this.units.filter((unit) =>
          unit.toLowerCase().includes(filterValue)
        );
      })
    );
  }
  setValueInputType() {
    const type = this.metadataForm.get("fieldType").value;
    switch (type) {
      case "number":
      case "quantity": {
        return "number";
      }
      case "string": {
        return "text";
      }
      case "date": {
        return "datetime-local";
      }
      default: {
        return "text";
      }
    }
  }

  unitValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const allowed = this.unitsService.getUnits().includes(control.value);
      return allowed ? null : { forbiddenUnit: { value: control.value } };
    };
  }
  addNewMetadata() {
    const field = this.formBuilder.group({
      fieldType: new FormControl("", [Validators.required]),
      fieldName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      fieldValue: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      fieldUnit: new FormControl("", [
        Validators.required,
        this.unitValidator(),
      ]),
    });
    return field;
  }

  fieldHasError(field: string): boolean {
    return this.metadataForm.get(field).hasError("required");
  }

  addCurrentMetadata(node: FlatTreeNodeEdit) {
    if (node.value !== null) {
      this.metadataForm = this.formBuilder.group({
        fieldName: node.key,
        fieldType: "string",
        fieldValue: node.value,
        fieldUnit: "test",
      });
    }
  }
  doSave() {
    this.data = this.convertDataTreeToObject(this.dataTree);
  }
  toggleExpand(){
    this.expanded = !this.expanded;
    this.expanded? this.treeControl.expandAll() : this.treeControl.collapseAll();
  }
  getPadding(node: FlatTreeNodeEdit){
    const indentPixel = 40;
    return (node.level * indentPixel).toString();
  }
}
