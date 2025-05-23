import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
} from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import {
  FlatNode,
  TreeBaseComponent,
  TreeNode,
} from "shared/modules/scientific-metadata-tree/base-classes/tree-base";
import { DatePipe } from "@angular/common";
@Component({
  selector: "tree-view",
  templateUrl: "./tree-view.component.html",
  styleUrls: ["./tree-view.component.scss"],
  standalone: false,
})
export class TreeViewComponent
  extends TreeBaseComponent
  implements OnInit, OnChanges
{
  @Input() metadata: any;
  constructor(datePipe: DatePipe) {
    super();
    this.datePipe = datePipe;
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<FlatNode>(
      this.getLevel,
      this.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );
    this.nestNodeMap = new Map<TreeNode, FlatNode>();
    this.flatNodeMap = new Map<FlatNode, TreeNode>();
  }
  ngOnInit() {
    this.dataTree = this.buildDataTree(this.metadata, 0);
    this.dataSource.data = this.dataTree;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "metadata") {
        this.metadata = changes[propName].currentValue;
        this.dataTree = this.buildDataTree(this.metadata, 0);
        this.dataSource.data = this.dataTree;
        this.filterText = this._filterText;
      }
    }
  }
  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.key === node.key
        ? existingNode
        : new FlatNode();
    flatNode.key = node.key;
    flatNode.level = level;
    flatNode.value = node.value;
    flatNode.unit = node.unit;
    flatNode.expandable = node.children?.length > 0;
    flatNode.visible = true;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  };
}
