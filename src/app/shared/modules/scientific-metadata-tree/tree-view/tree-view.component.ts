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
  DEFAULT_METADATA_PATH,
  FlatNode,
  TreeBaseComponent,
  TreeNode,
} from "shared/modules/scientific-metadata-tree/base-classes/tree-base";
import { DatePipe } from "@angular/common";
import { AppConfigService } from "app-config.service";
import { ContextMenuItem } from "shared/modules/dynamic-material-table/models/context-menu.model";
import { TableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import { ScientificMetadataColumnsService } from "shared/services/scientific-metadata-columns.service";
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
  @Input() allowAddAsColumn = false;
  @Input() metadataPath = DEFAULT_METADATA_PATH;

  canAddScientificMetadataKeysAsColumn = false;
  rowContextMenuItems: ContextMenuItem[] = [];
  tableSetting = new TableSetting();
  constructor(
    public datePipe: DatePipe,
    configService: AppConfigService,
    private scientificMetadataColumnsService: ScientificMetadataColumnsService,
  ) {
    super(configService);
    this.canAddScientificMetadataKeysAsColumn =
      configService.getConfig().addScientificMetadataKeysAsColumn === true;
    this.rowContextMenuItems = this.canAddScientificMetadataKeysAsColumn
      ? [this.scientificMetadataColumnsService.addAsColumnAction]
      : [];
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

  private getMetadataColumnName(path: string): string {
    const metadataPathPrefix = `${this.metadataPath}.`;

    return path.startsWith(metadataPathPrefix)
      ? path.slice(metadataPathPrefix.length)
      : path;
  }

  ngOnInit() {
    this.dataTree = this.buildDataTree(this.metadata, 0, this.metadataPath);
    this.dataSource.data = this.dataTree;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const shouldRebuildTree = !!changes.metadata || !!changes.metadataPath;

    if (changes.metadata) {
      this.metadata = changes.metadata.currentValue;
    }

    if (changes.metadataPath) {
      // Used for saved column paths when a dynamic section renders a nested metadata source.
      this.metadataPath =
        changes.metadataPath.currentValue || DEFAULT_METADATA_PATH;
    }

    if (!shouldRebuildTree) {
      return;
    }

    this.dataTree = this.buildDataTree(this.metadata, 0, this.metadataPath);
    this.dataSource.data = this.dataTree;
    this.filterText = this._filterText;
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
    flatNode.path = node.path;
    flatNode.columnName = node.columnName;
    flatNode.human_name = node.human_name;
    this.flatNodeMap.set(flatNode, node);
    this.nestNodeMap.set(node, flatNode);
    return flatNode;
  };

  canShowAddAsColumn(node: FlatNode): boolean {
    return (
      this.allowAddAsColumn &&
      this.rowContextMenuItems.length > 0 &&
      !node.expandable &&
      !!node.columnName
    );
  }

  async onRowActionChange(
    node: FlatNode,
    action: ContextMenuItem,
  ): Promise<void> {
    if (
      action.name !==
      this.scientificMetadataColumnsService.addAsColumnAction.name
    ) {
      return;
    }

    await this.addAsColumn(node);
  }

  async addAsColumn(node: FlatNode): Promise<void> {
    if (!this.canShowAddAsColumn(node)) {
      return;
    }

    await this.scientificMetadataColumnsService.addMetadataColumn({
      name: this.getMetadataColumnName(node.path),
      human_name: node.human_name,
      columnName: node.columnName,
    });
  }
}
