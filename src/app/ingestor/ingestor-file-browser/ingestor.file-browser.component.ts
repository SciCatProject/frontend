import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { IngestorAPIManager } from "ingestor/ingestor/helper/ingestor-api-manager";
import {
  IngestionRequestInformation,
  IngestorHelper,
  DialogDataObject,
} from "ingestor/ingestor/helper/ingestor.component-helper";
import { FolderNode } from "ingestor/model/folderNode";
import { GetBrowseDatasetResponse } from "ingestor/model/models";
import { PageChangeEvent } from "shared/modules/table/table.component";

export interface BrowsableNode extends FolderNode {
  childrenNodes?: BrowsableNode[];
  isExpanded?: boolean;
  isChildrenLoaded?: boolean;
  isLoading?: boolean;
}

export interface GoBackNode extends FolderNode {
  isRootNode: boolean;
}

@Component({
  selector: "ingestor.file-browser.component",
  templateUrl: "ingestor.file-browser.component.html",
  styleUrls: ["../ingestor/ingestor.component.scss"],
})
export class IngestorFileBrowserComponent implements OnInit {
  private _activeNode: BrowsableNode | null = null;
  activeNodeChildrenTotal = 0;

  isListView = true;
  backendURL = "";
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  browseFolderPageSize = 50;
  browseFolderPage = 0;

  availableNodes: BrowsableNode | null = null;
  goBackNode: GoBackNode | null = null;
  rootNode: FolderNode | null = null;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
    private apiManager: IngestorAPIManager,
    private cdr: ChangeDetectorRef,
  ) {
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
    this.apiManager.connect(this.backendURL);
  }

  get activeNode(): BrowsableNode | null {
    return this._activeNode;
  }

  set activeNode(node: BrowsableNode | null) {
    this._activeNode = node;

    let backNodePath = "/";
    let isRootNode = false;

    if (node != null) {
      backNodePath = node?.path.split("/").slice(0, -1).join("/");
      if (backNodePath === "") {
        backNodePath = "/";
      }

      isRootNode = node?.path === "/";
    }

    this.goBackNode = {
      name: "..",
      path: backNodePath,
      children: true,
      isRootNode: isRootNode,
    };
  }

  async ngOnInit(): Promise<void> {
    const rootNode: FolderNode = {
      name: "",
      path:
        this.createNewTransferData.selectedPath !== ""
          ? this.createNewTransferData.selectedPath
          : "/",
      children: false,
    };

    const rootNodeChildren = await this.onLoadFilePath(rootNode.path);
    this.setExtendedNodeActive(rootNode, rootNodeChildren);
  }

  setExtendedNodeActive(
    newNode: FolderNode,
    requestResponse: GetBrowseDatasetResponse,
  ): void {
    this.activeNodeChildrenTotal = requestResponse.total;

    if (requestResponse.folders.length > 0) {
      const rootNodeExtended: BrowsableNode = {
        ...newNode,
        children: true,
        childrenNodes: requestResponse.folders,
      };

      this.activeNode = rootNodeExtended;
    } else {
      this.activeNode = newNode;
    }
  }

  onCancel = (): void => { };

  onSelect = (): void => {
    if (this.activeNode) {
      this.createNewTransferData.selectedPath = this.activeNode.path;
    }
  };

  toggleView = (): void => {
    this.isListView = !this.isListView;
  };

  trackByFn(index: number, item: any): number {
    return item.id; // or any unique identifier for the items
  }

  async onLoadFolderNode(item: BrowsableNode, resetPage = true): Promise<void> {
    if (resetPage) {
      // Reset Page, when clicking on an item
      this.browseFolderPage = 0;
    }

    const newActiveNode: BrowsableNode = {
      ...item,
      childrenNodes: [],
      children: false,
    };
    const newActiveNodeChildren = await this.onLoadFilePath(item.path);
    this.setExtendedNodeActive(newActiveNode, newActiveNodeChildren);
    //this.cdr.detectChanges();
  }

  async onLoadFilePath(path: string): Promise<GetBrowseDatasetResponse | null> {
    try {
      const folderNodeResponse = await this.apiManager.getBrowseFilePath(
        this.browseFolderPage + 1, // 1-based
        this.browseFolderPageSize,
        path,
      );

      return folderNodeResponse;
    } catch (error) {
      console.error("Error loading path:", path, error);
      return null;
    }
  }

  onFileBrowserChildrenPageChange(event: PageChangeEvent) {
    this.browseFolderPage = event.pageIndex;

    // Reload Active Node children
    this.onLoadFolderNode(this.activeNode, false);
  }
}

export interface Section {
  name: string;
  updated?: Date;
}
