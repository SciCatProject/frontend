import { DatePipe, SlicePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  DatasetClass,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription } from "rxjs";
import {
  PageChangeEvent,
  TableColumn,
} from "shared/modules/table/table.component";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import {
  changeDatasetsPageAction,
  fetchProposalDatasetsAction,
} from "state-management/actions/proposals.actions";
import { selectViewProposalPageViewModel } from "state-management/selectors/proposals.selectors";

export interface TableData {
  pid: string;
  name: string;
  sourceFolder: string;
  size: string;
  creationTime: string | null;
  owner: string;
  location: string;
}

@Component({
  selector: "app-proposal-datasets",
  templateUrl: "./proposal-datasets.component.html",
  styleUrls: ["./proposal-datasets.component.scss"],
})
export class ProposalDatasetsComponent implements OnInit {
  vm$ = this.store.select(selectViewProposalPageViewModel);

  subscriptions: Subscription[] = [];
  @Input() proposalId: string;

  tablePaginate = true;
  tableData: TableData[] = [];
  tableColumns: TableColumn[] = [
    { name: "name", icon: "portrait", sort: false, inList: true },
    { name: "sourceFolder", icon: "explore", sort: false, inList: true },
    { name: "size", icon: "save", sort: false, inList: true },
    { name: "creationTime", icon: "calendar_today", sort: false, inList: true },
    { name: "owner", icon: "face", sort: false, inList: true },
    { name: "location", icon: "explore", sort: false, inList: true },
  ];

  constructor(
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private slicePipe: SlicePipe,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        this.tableData = this.formatTableData(vm.datasets);
      }),
    );

    if (!this.tableData.length) {
      this.store.dispatch(
        fetchProposalDatasetsAction({ proposalId: this.proposalId }),
      );
    }
  }

  formatTableData(datasets: OutputDatasetObsoleteDto[]): TableData[] {
    let tableData: TableData[] = [];
    if (datasets) {
      tableData = datasets.map((dataset: any) => ({
        pid: dataset.pid,
        name: dataset.datasetName,
        sourceFolder:
          "..." + this.slicePipe.transform(dataset.sourceFolder, -14),
        size: this.filesizePipe.transform(dataset.size),
        creationTime: this.datePipe.transform(
          dataset.creationTime,
          "yyyy-MM-dd HH:mm",
        ),
        owner: dataset.owner,
        location: dataset.creationLocation,
      }));
    }
    return tableData;
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changeDatasetsPageAction({
        page: event.pageIndex,
        limit: event.pageSize,
      }),
    );
    this.store.dispatch(
      fetchProposalDatasetsAction({ proposalId: this.proposalId }),
    );
  }

  onRowClick(dataset: DatasetClass) {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }
}
