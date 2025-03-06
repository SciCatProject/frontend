import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { IngestorAPIManager } from "ingestor/ingestor/helper/ingestor-api-manager";
import {
  IngestionRequestInformation,
  IngestorHelper,
  DialogDataObject,
} from "ingestor/ingestor/helper/ingestor.component-helper";
import { FolderNode } from "ingestor/model/folderNode";
import { GetBrowseDatasetResponse } from "ingestor/model/models";

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

  isListView = true;
  backendURL = "";
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  availableNodes: BrowsableNode | null = null;
  goBackNode: GoBackNode | null = null;
  rootNode: FolderNode | null = null;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
    private apiManager: IngestorAPIManager,
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
      name: "...",
      path: backNodePath,
      children: true,
      isRootNode: isRootNode,
    };
  }

  async ngOnInit(): Promise<void> {
    const rootNode: FolderNode = {
      name: "Root",
      path: "/",
      children: false,
    };

    const rootNodeChildren = await this.onLoadFilePath(rootNode.path);
    this.setExtendedNodeActive(rootNode, rootNodeChildren);
  }

  setExtendedNodeActive(
    newNode: FolderNode,
    requestResponse: GetBrowseDatasetResponse,
  ): void {
    if (
      requestResponse &&
      requestResponse.folders &&
      requestResponse.folders.length > 0
    ) {
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

  onCancel = (): void => {};

  onConfirm = (): void => {
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

  async onItemClick(itemName: string, itemPath: string): Promise<void> {
    const newActiveNode: BrowsableNode = {
      name: itemName,
      path: itemPath,
      children: false,
    };
    const newActiveNodeChildren = await this.onLoadFilePath(itemPath);
    this.setExtendedNodeActive(newActiveNode, newActiveNodeChildren);
  }

  async onLoadFilePath(path: string): Promise<GetBrowseDatasetResponse | null> {
    const page = 1;
    const pageSize = 50;

    try {
      const folderNodeResponse = await this.apiManager.getBrowseFilePath(
        page,
        pageSize,
        path,
      );

      return folderNodeResponse;
    } catch (error) {
      console.error("Error loading path:", path, error);
      return null;
    }
  }
}

export interface Section {
  name: string;
  updated?: Date;
}
