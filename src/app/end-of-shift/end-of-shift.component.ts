import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { DatasetService } from "datasets/dataset.service";
import { RawDataset } from "shared/sdk/models";
import { ProposalApi, RawDatasetApi } from "shared/sdk/services";
import * as ua from "state-management/actions/user.actions";

@Component({
  selector: "app-end-of-shift",
  templateUrl: "./end-of-shift.component.html",
  styleUrls: ["./end-of-shift.component.css"]
})
export class EndOfShiftComponent implements OnInit {
  selectedGroup: string;
  ownerGroups: Array<any> = [];

  datasets: Array<RawDataset>;

  constructor(
    private cds: DatasetService,
    private ds: RawDatasetApi,
    private ps: ProposalApi,
    private store: Store<any>
  ) {
    this.ps.find({ limit: 10 }).subscribe(proposals => {
      console.log(proposals);
    });
    this.cds.searchDatasetsObservable({ order: "creationTime DESC" }).subscribe(
      results => {
        this.datasets = <Array<RawDataset>>results;
      },
      error => {
        this.store.dispatch({
          type: ua.SHOW_MESSAGE,
          payload: {
            content: error.message,
            class: "ui negative message",
            timeout: 3
          }
        });
      },
      () => {}
    );
  }

  ngOnInit() {}

  /**
   * Handle group filtering of available
   * datasets and show these in the table
   * @memberof EndOfShiftComponent
   */
  onGroupSelect() {
    const datasetSearch = { where: { or: [] }, order: "creationTime DESC" };
    const or: Array<object> = datasetSearch["where"]["or"];
    or.push({ ownerGroup: this.selectedGroup });
    this.cds.searchDatasetsObservable(datasetSearch).subscribe(
      ret => {
        this.datasets = <Array<RawDataset>>ret;
        console.log(this.datasets[0]);
        if (this.datasets.length <= 0) {
          console.error("No Datasets found for group", this.selectedGroup);
          this.store.dispatch({
            type: ua.SHOW_MESSAGE,
            payload: {
              content: "No datasets found for group",
              class: "ui negative message",
              timeout: 3
            }
          });
        }
      },
      error => {
        this.store.dispatch({
          type: ua.SHOW_MESSAGE,
          payload: {
            content: error.message,
            class: "ui negative message",
            timeout: 3
          }
        });
      }
    );
  }
}
