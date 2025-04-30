import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  IngestionRequestInformation,
  IngestorHelper,
  DialogDataObject,
} from "ingestor/ingestor-page/helper/ingestor.component-helper";
import { FolderNode } from "shared/sdk/models/ingestor/folderNode";
import { GetBrowseDatasetResponse } from "shared/sdk/models/ingestor/models";
import { PageChangeEvent } from "shared/modules/table/table.component";
import {
  selectIngestionObject,
  selectIngestorBrowserActiveNode,
} from "state-management/selectors/ingestor.selector";
import { Store } from "@ngrx/store";
import * as fromActions from "state-management/actions/ingestor.actions";

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
  styleUrls: ["../../ingestor-page/ingestor.component.scss"],
})
export class IngestorFileBrowserComponent implements OnInit {
  private _activeNode: BrowsableNode | null = null;

  ingestionObject$ = this.store.select(selectIngestionObject);
  selectIngestorBrowserActiveNode$ = this.store.select(
    selectIngestorBrowserActiveNode,
  );

  activeNodeChildrenTotal = 0;
  nextNode: BrowsableNode | null = null;

  isListView = true;
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
    private store: Store,
  ) { }

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

  ngOnInit(): void {
    this.ingestionObject$.subscribe((ingestionObject) => {
      if (ingestionObject) {
        this.createNewTransferData = ingestionObject;

        const rootNode: FolderNode = {
          name: "",
          path:
            this.createNewTransferData.selectedPath !== ""
              ? this.createNewTransferData.selectedPath
              : "/",
          children: false,
        };

        this.selectIngestorBrowserActiveNode$.subscribe((newNode) => {
          if (newNode) {
            const newActiveNode: BrowsableNode = {
              ...(this.nextNode ?? rootNode),
              childrenNodes: [],
              children: false,
            };
            this.setExtendedNodeActive(newActiveNode, newNode);
          }
        });

        this.onLoadFolderNode(rootNode, true);
      }
    });
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

  onSelect = (): void => {
    if (this.activeNode) {
      this.createNewTransferData.selectedPath = this.activeNode.path;
      this.store.dispatch(
        fromActions.updateIngestionObject({
          ingestionObject: this.createNewTransferData,
        }),
      );
    }
  };

  toggleView = (): void => {
    this.isListView = !this.isListView;
  };

  trackByFn(index: number, item: any): number {
    return item.id; // or any unique identifier for the items
  }

  onLoadFolderNode(item: BrowsableNode, resetPage = true): void {
    if (resetPage) {
      // Reset Page, when clicking on an item
      this.browseFolderPage = 0;
    }

    this.nextNode = item;

    this.store.dispatch(
      fromActions.getBrowseFilePath({
        page: this.browseFolderPage + 1, // 1-based
        pageNumber: this.browseFolderPageSize,
        path: item.path,
      }),
    );
  }

  onFileBrowserChildrenPageChange(event: PageChangeEvent) {
    this.browseFolderPage = event.pageIndex;
    this.onLoadFolderNode(this.activeNode, false);
  }
}
