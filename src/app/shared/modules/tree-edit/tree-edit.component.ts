import { Component, Input, OnChanges } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UnitsService } from "shared/services/units.service";

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
  editing:boolean;
}
@Component({
  selector: 'app-tree-edit',
  templateUrl: './tree-edit.component.html',
  styleUrls: ['./tree-edit.component.scss'],
})
export class TreeEditComponent implements OnChanges{
  metadataForm: FormGroup;
  typeValues: string[] = ["date", "quantity", "number", "string"];
  treeControl: FlatTreeControl<FlatTreeNodeEdit>;
  treeFlattener: MatTreeFlattener<TreeNodeEdit, FlatTreeNodeEdit>;
  dataSource: MatTreeFlatDataSource<TreeNodeEdit, FlatTreeNodeEdit>;
  flatNodeMap = new Map<FlatTreeNodeEdit, TreeNodeEdit>();
  nestNodeMap = new Map<TreeNodeEdit, FlatTreeNodeEdit>();
  dataTree: TreeNodeEdit[];

  @Input() data: any;
  constructor(private formBuilder: FormBuilder, private unitsService: UnitsService) {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatTreeNodeEdit>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }
  ngOnChanges(){
    this.dataTree = this.convertObjectToDataTree(this.data, 0);
    console.log(this.dataTree);
    this.dataSource.data = this.dataTree;
  }

  getLevel = (node: FlatTreeNodeEdit) => node.level;
  isExpandable = (node: FlatTreeNodeEdit) => node.expandable;
  getChildren = (node: TreeNodeEdit): TreeNodeEdit[] => node.children;
  transformer = (node: TreeNodeEdit, level: number) => {
    const existingNode = this.nestNodeMap.get(node);
    const flatNode = existingNode && existingNode.key === node.key? existingNode : new FlatTreeNodeEdit();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.expandable = !!node.children?.length;
    flatNode.editing = false;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  }
  convertObjectToDataTree(obj: {[key:string]: any}, level: number): TreeNodeEdit[]{
    return Object.keys(obj).reduce<TreeNodeEdit[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeNodeEdit();
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
  convertDataTreeToObject(tree: TreeNodeEdit[]): {[key: string]: any}{
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
  hasChild = (_: number, _nodeData: FlatTreeNodeEdit) => _nodeData.expandable;

  insertItem(parent: TreeNodeEdit, key: string, value: any){
    if(parent.children){
      parent.children.push({key, value} as TreeNodeEdit);
    }
    this.dataSource.data = this.dataTree;
  }
  addNewItem(node: FlatTreeNodeEdit){
    const parentNode = this.flatNodeMap.get(node);
    this.insertItem(parentNode, '', '');
    this.treeControl.expand(node);
  }
  saveNode(node: FlatTreeNodeEdit, key: string, value: any){
    const nestedNode = this.flatNodeMap.get(node);
    this.updateItem(nestedNode, key, value);
    this.dataSource.data = this.dataTree;
  }
  updateItem(node: TreeNodeEdit, key: string, value: string){
    node.key = key;
    node.value = value;
    this.dataSource.data = this.dataTree;
  }
  deleteItem(node: FlatTreeNodeEdit){
    const parentNode = this.getParentNode(node);
    const flatParentNode = this.flatNodeMap.get(parentNode);
    if(flatParentNode && flatParentNode.children){
      flatParentNode.children = flatParentNode.children.filter(e => e.key !== node.key);
    } else {
      this.dataTree = this.dataTree.filter(e => e.key !== node.key);
    }
    this.dataSource.data = this.dataTree;
  }
  editItem(node: FlatTreeNodeEdit){
    const nestedNode = this.flatNodeMap.get(node);
    const { fieldName, fieldValue } = this.metadataForm.value;
    this.updateItem(nestedNode, fieldName, fieldValue);
    this.toggleEditMode(node);
    this.dataSource.data = this.dataTree;
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
  toggleEditMode(node: FlatTreeNodeEdit){
    node.editing = !node.editing;
    console.log("editing:", node.editing);
    this.addCurrentMetadata(node);
  }
  detectType(node: FlatTreeNodeEdit) {
    // const type = this.items.at(index).get("fieldType").value;
    // if (type === "quantity") {
    //   this.items.at(index).get("fieldUnit").enable();
    //   this.items
    //     .at(index)
    //     .get("fieldUnit")
    //     .setValidators([Validators.required, this.unitValidator()]);
    //   this.items.at(index).get("fieldUnit").updateValueAndValidity();
    // } else {
    //   this.items.at(index).get("fieldUnit").clearValidators();
    //   this.items.at(index).get("fieldUnit").setValue("");
    //   this.items.at(index).get("fieldUnit").disable();
    // }
  }
  getUnits(node: FlatTreeNodeEdit): void {
    // const name = this.items.at(index).get("fieldName").value;
    // this.units = this.unitsService.getUnits(name);
    // this.filteredUnits$ = this.items
    //   .at(index)
    //   .get("fieldUnit")
    //   .valueChanges.pipe(
    //     startWith(""),
    //     map((value: string) => {
    //       const filterValue = value.toLowerCase();
    //       return this.units.filter((unit) =>
    //         unit.toLowerCase().includes(filterValue)
    //       );
    //     })
    //   );
  }
  setValueInputType(node: FlatTreeNodeEdit) {
    return String;
    // const type = this.items.at(index).get("fieldType").value;
    // switch (type) {
    //   case "number":
    //   case "quantity": {
    //     return "number";
    //   }
    //   case "string": {
    //     return "text";
    //   }
    //   case "date": {
    //     return "datetime-local";
    //   }
    //   default: {
    //     return "text";
    //   }
    // }
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


  addCurrentMetadata(node: FlatTreeNodeEdit) {
    if (node.value !== null) {
      // this.metadataForm = new FormGroup({
      //   fieldName: new FormControl(node.key),
      //   fieldType: new FormControl("string"),
      //   fieldValue: new FormControl(node.value),
      //   fieldUnit: new FormControl("test")
      // });
      this.metadataForm = this.formBuilder.group({
        fieldName: node.key,
        fieldType: "string",
        fieldValue: node.value,
        fieldUnit: "test",
      });
      // this.metadataForm  = this.formBuilder.group({
      //   // fieldType: new FormControl("", [Validators.required]),
      //   fieldName: new FormControl("", [
      //     Validators.required,
      //     Validators.minLength(2),
      //   ]),
      //   fieldValue: new FormControl("", [
      //     Validators.required,
      //     Validators.minLength(1),
      //   ]),
      //   fieldUnit: new FormControl("", [
      //     Validators.required,
      //     this.unitValidator(),
      //   ]),
      // });
    }
    console.log(this.metadataForm);
  }

}
