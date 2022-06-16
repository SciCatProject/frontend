import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TableColumn } from "shared/modules/table/table.component";
import { Dataset } from "shared/sdk";
import { fetchRelatedDatasetsAction } from "state-management/actions/datasets.actions";
import { selectRelatedDatasets } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "app-related-datasets",
  templateUrl: "./related-datasets.component.html",
  styleUrls: ["./related-datasets.component.scss"],
})
export class RelatedDatasetsComponent implements OnInit {
  tableData$: Observable<Partial<Dataset>[]> = this.store
    .select(selectRelatedDatasets)
    .pipe(map((relatedDatasets) => this.formatTableData(relatedDatasets)));

  tableColumns: TableColumn[] = [
    {
      name: "datasetName",
      icon: "fingerprint",
      sort: true,
      inList: true,
    },
    {
      name: "sourceFolder",
      icon: "description",
      sort: true,
      inList: true,
    },
    {
      name: "size",
      icon: "face",
      sort: true,
      inList: true,
    },
    {
      name: "type",
      icon: "date_range",
      sort: true,
      inList: true,
    },
    {
      name: "createdAt",
      icon: "group",
      sort: true,
      inList: true,
    },
    {
      name: "owner",
      icon: "group",
      sort: true,
      inList: true,
    },
  ];

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private store: Store
  ) {}

  formatTableData(datasets: Dataset[]): any {
    if (datasets) {
      return datasets.map((dataset) => ({
        pid: dataset.pid,
        datasetName: dataset.datasetName,
        sourceFolder: dataset.sourceFolder,
        size: dataset.size,
        type: dataset.type,
        createdAt: this.datePipe.transform(
          dataset.createdAt,
          "yyyy-MM-dd, hh:mm"
        ),
        owner: dataset.owner,
      }));
    }
  }

  onRowClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchRelatedDatasetsAction());
  }
}
