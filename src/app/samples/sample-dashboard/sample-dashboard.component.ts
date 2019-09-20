import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Store, select } from "@ngrx/store";
import { Sample } from "shared/sdk";
import {
  SearchSampleAction,
  ChangePageAction,
  FetchSamplesAction,
  SampleSortByColumnAction,
  FetchSampleAction,
  FetchSampleCountAction
} from "state-management/actions/samples.actions";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import { Subscription } from "rxjs";
import {
  getSamplesList,
  getSampleCount,
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
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private store: Store<Sample>
  ) {}

  sampleSubscription: Subscription;

  sampleCount$ = this.store.pipe(select(getSampleCount));
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
    this.store.dispatch(new SearchSampleAction(query));
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
    this.store.dispatch(new FetchSamplesAction());
  }

  onSortChange(event: SortChangeEvent) {
    if (event.active === "creationTime") {
      event.active = "createdAt";
    }
    this.store.dispatch(
      new SampleSortByColumnAction(event.active, event.direction)
    );
  }

  onRowClick(sample: Sample) {
    this.store.dispatch(new FetchSampleAction(sample.sampleId));
    this.router.navigateByUrl("/samples/" + sample.sampleId);
  }

  ngOnInit() {
    this.store.dispatch(new FetchSamplesAction());
    this.store.dispatch(new FetchSampleCountAction(0));

    this.sampleSubscription = this.store
      .pipe(select(getSamplesList))
      .subscribe(samples => {
        this.tableData = this.formatTableData(samples);
      });
  }

  ngOnDestroy() {
    this.sampleSubscription.unsubscribe();
  }
}
