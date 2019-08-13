import * as ua from "state-management/actions/user.actions";
import {
  DatasetApi,
  AttachmentApi,
  LoopBackAuth,
  OrigDatablockApi
} from "shared/sdk/services";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { DatablockApi, Attachment } from "shared/sdk";
import { Dataset, OrigDatablock } from "shared/sdk/models";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

@Injectable()
export class DatasetService {
  limit = 1000;
  loading = false;
  selected: Dataset = null;
  datasets: Array<Dataset> = [];
  datasetChange: Subject<string> = new Subject<string>();
  facetSubject = new BehaviorSubject<object>({});

  detailFilter = {
    limit: this.limit,
    include: [{ relation: "origdatablocks" }]
  };

  filter = {
    limit: this.limit
  };

  nullLifecycle = {
    archiveRetentionTime: "unknown",
    archiveStatusMessage: "unknown",
    dateOfLastMessage: "unknown",
    doi: "unknown",
    exportedTo: "unknown",
    id: null,
    isExported: "unknown",
    isOnDisk: "unknown",
    isOnTape: "unknown",
    isPublished: "unknown",
    publishingDate: "unknown",
    retrieveStatusMessage: "unknown"
  };

  userID;
  userGroups = null;

  constructor(
    private rds: DatasetApi,
    private daSrv: AttachmentApi,
    private odb: OrigDatablockApi,
    private db: DatablockApi,
    private auth: LoopBackAuth,
    private store: Store<any>
  ) {}

  /**
   * Search datasets with search terms,
   * defaults to just limiting search size.
   * @param {any} [terms={limit: this.limit}]
   * @memberof DatasetService
   */

  searchDatasets(terms: object = this.filter) {
    this.loading = true;
    const filter = Object.assign(terms, this.filter);

    this.rds.find(filter).subscribe(
      ret => {
        this.loading = false;
        this.datasets = <Array<Dataset>>ret;

        if (this.datasets.length > 0) {
          // this.updateStatus(0, 10);
          this.datasetChange.next("reload");
        }
      },
      error => {
        console.error(error);
      },
      () => {}
    );
  }

  getDataset(id: string) {
    return this.rds.findById(id, this.detailFilter);
  }

  addAttachment(attachment: Attachment) {
    return this.daSrv.create(attachment);
  }

  deleteAttachment(attachment_id: string) {
    return this.daSrv.deleteById(attachment_id);
  }

  getAttachments(attachment_id: string) {
    return this.daSrv.deleteById(attachment_id);
  }

  setDataset(dataset: Dataset) {
    return this.rds.upsert(dataset);
  }

  searchDatasetsObservable(terms: object = this.filter) {
    const filter = Object.assign(terms, this.filter);
    return this.rds.find(filter);
  }

  /**
   * Load blocks based on dataset ID
   * @param set
   */

  getDatasetBlocks(set, type = "original") {
    const datasetSearch = { where: { datasetId: set.pid } };
    let service: any = this.db;
    if (type === "original") {
      service = this.odb;
    }
    service.find(datasetSearch).subscribe(
      bl => {
        console.log(bl);
        set["datablocks"] = <Array<OrigDatablock>>bl;
      },
      error => {
        this.store.dispatch({
          type: ua.SHOW_MESSAGE,
          payload: {
            content: error.message,
            type: "error",
            title: "Error searching for datablocks"
          }
        });
      }
    );
  }

  /**
   * Returns observable to sub to
   * of datablock retrieval
   * @param id
   * @returns {Observable<T[]>}
   */

  getBlockObservable(set, type = "original"): Observable<Array<any>> {
    const datasetSearch = { where: { datasetId: set.pid } };

    let service: any = this.db;
    if (type === "original") {
      service = this.odb;
    }

    return service.find(datasetSearch);
  }
}
