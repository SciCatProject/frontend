import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import {
  PageChangeEvent,
  TableColumn,
} from "shared/modules/table/table.component";
import { Dataset } from "shared/sdk";
import {
  changeRelatedDatasetsPageAction,
  fetchRelatedDatasetsAction,
} from "state-management/actions/datasets.actions";
import { selectRelatedDatasetsPageViewModel } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "app-related-datasets",
  templateUrl: "./related-datasets.component.html",
  styleUrls: ["./related-datasets.component.scss"],
})
export class RelatedDatasetsComponent {
  vm$ = this.store.select(selectRelatedDatasetsPageViewModel).pipe(
    map((vm) => ({
      ...vm,
      relatedDatasets: this.formatTableData(vm.relatedDatasets),
    })),
  );

  tablePaginate = true;
  tableColumns: TableColumn[] = [
    {
      name: "name",
      icon: "portrait",
      sort: true,
      inList: true,
    },
    {
      name: "sourceFolder",
      icon: "explore",
      sort: true,
      inList: true,
    },
    {
      name: "size",
      icon: "save",
      sort: true,
      inList: true,
    },
    {
      name: "type",
      icon: "bubble_chart",
      sort: true,
      inList: true,
    },
    {
      name: "creationTime",
      icon: "calendar_today",
      sort: true,
      inList: true,
    },
    {
      name: "owner",
      icon: "face",
      sort: true,
      inList: true,
    },
  ];

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private store: Store,
  ) {}

  formatTableData(datasets: Dataset[]): Record<string, unknown>[] {
    if (!datasets) {
      return [];
    }

    return datasets.map((dataset) => ({
      pid: dataset.pid,
      name: dataset.datasetName,
      sourceFolder: dataset.sourceFolder,
      size: dataset.size,
      type: dataset.type,
      creationTime: this.datePipe.transform(
        dataset.creationTime,
        "yyyy-MM-dd, hh:mm",
      ),
      owner: dataset.owner,
    }));
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(
      changeRelatedDatasetsPageAction({
        page: event.pageIndex,
        limit: event.pageSize,
      }),
    );
    this.store.dispatch(fetchRelatedDatasetsAction());
  }

  onRowClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }
}
