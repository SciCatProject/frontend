import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Store, select } from "@ngrx/store";
import { Sample } from "shared/sdk";
import {
  changePageAction,
  fetchSamplesAction,
  sortByColumnAction,
  setTextFilterAction
} from "state-management/actions/samples.actions";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import { Subscription } from "rxjs";
import {
  getSamples,
  getSamplesCount,
  getSamplesPerPage,
  getPage
} from "state-management/selectors/samples.selectors";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { SampleDialogComponent } from "samples/sample-dialog/sample-dialog.component";

@Component({
  selector: "sample-dashboard",
  templateUrl: "./sample-dashboard.component.html",
  styleUrls: ["./sample-dashboard.component.scss"]
})
export class SampleDashboardComponent implements OnInit, OnDestroy {
  sampleSubscription: Subscription;

  sampleCount$ = this.store.pipe(select(getSamplesCount));
  samplesPerPage$ = this.store.pipe(select(getSamplesPerPage));
  currentPage$ = this.store.pipe(select(getPage));

  tableData: any[];
  tableColumns: TableColumn[] = [
    { name: "sampleId", icon: "fingerprint", sort: true, inList: false },
    { name: "description", icon: "description", sort: false, inList: true },
    { name: "owner", icon: "face", sort: true, inList: true },
    { name: "creationTime", icon: "date_range", sort: true, inList: true },
    { name: "ownerGroup", icon: "group", sort: false, inList: true }
  ];
  tablePaginate = true;

  dialogConfig: MatDialogConfig;
  name: string;
  description: string;
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private store: Store<Sample>
  ) {}

  formatTableData(samples: Sample[]): any {
    if (samples) {
      return samples.map(sample => {
        return {
          sampleId: sample.sampleId,
          owner: sample.owner,
          creationTime: this.datePipe.transform(
            sample.createdAt,
            "yyyy-MM-dd, hh:mm"
          ),
          description: sample.description,
          ownerGroup: sample.ownerGroup
        };
      });
    }
  }

  openDialog() {
    this.dialogConfig = new MatDialogConfig();
    this.dialog.open(SampleDialogComponent, {
      width: "250px",
      data: { name: this.name, description: this.description }
    });
  }

  onTextSearchChange(query) {
    this.store.dispatch(setTextFilterAction({ text: query }));
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onSortChange(event: SortChangeEvent) {
    if (event.active === "creationTime") {
      event.active = "createdAt";
    }
    this.store.dispatch(
      sortByColumnAction({ column: event.active, direction: event.direction })
    );
  }

  onRowClick(sample: Sample) {
    const id = encodeURIComponent(sample.sampleId);
    this.router.navigateByUrl("/samples/" + id);
  }

  ngOnInit() {
    this.store.dispatch(fetchSamplesAction());

    this.sampleSubscription = this.store
      .pipe(select(getSamples))
      .subscribe(samples => {
        this.tableData = this.formatTableData(samples);
      });
  }

  ngOnDestroy() {
    this.sampleSubscription.unsubscribe();
  }
}
