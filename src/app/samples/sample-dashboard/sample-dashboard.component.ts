import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Store, select } from "@ngrx/store";
import { Sample } from "shared/sdk";
import {
  changePageAction,
  fetchSamplesAction,
  sortByColumnAction,
  setTextFilterAction,
  prefillFiltersAction,
  fetchMetadataKeysAction,
  addCharacteristicsFilterAction,
  removeCharacteristicsFilterAction,
} from "state-management/actions/samples.actions";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { combineLatest, Subscription } from "rxjs";
import {
  getSamples,
  getSamplesCount,
  getSamplesPerPage,
  getPage,
  getFilters,
  getHasPrefilledFilters,
  getTextFilter,
  getMetadataKeys,
  getCharacteristicsFilter,
} from "state-management/selectors/samples.selectors";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { SampleDialogComponent } from "samples/sample-dialog/sample-dialog.component";
import * as rison from "rison";
import * as deepEqual from "deep-equal";
import {
  filter,
  map,
  distinctUntilChanged,
  take,
} from "rxjs/operators";
import { SampleFilters } from "state-management/models";
import { SearchParametersDialogComponent } from "shared/modules/search-parameters-dialog/search-parameters-dialog.component";

@Component({
  selector: "sample-dashboard",
  templateUrl: "./sample-dashboard.component.html",
  styleUrls: ["./sample-dashboard.component.scss"],
})
export class SampleDashboardComponent implements OnInit, OnDestroy {
  sampleCount$ = this.store.pipe(select(getSamplesCount));
  samplesPerPage$ = this.store.pipe(select(getSamplesPerPage));
  currentPage$ = this.store.pipe(select(getPage));
  textFilter$ = this.store.pipe(select(getTextFilter));
  characteristics$ = this.store.pipe(select(getCharacteristicsFilter));
  readyToFetch$ = this.store.pipe(
    select(getHasPrefilledFilters),
    filter((has) => has)
  );

  subscriptions: Subscription[] = [];

  metadataKeys: string[];
  tableData: any[];
  tableColumns: TableColumn[] = [
    { name: "sampleId", icon: "fingerprint", sort: true, inList: false },
    { name: "description", icon: "description", sort: false, inList: true },
    { name: "owner", icon: "face", sort: true, inList: true },
    { name: "creationTime", icon: "date_range", sort: true, inList: true },
    { name: "ownerGroup", icon: "group", sort: false, inList: true },
  ];
  tablePaginate = true;

  dialogConfig: MatDialogConfig;
  name: string;
  description: string;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<Sample>
  ) {}

  formatTableData(samples: Sample[]): any {
    if (samples) {
      return samples.map((sample) => {
        return {
          sampleId: sample.sampleId,
          owner: sample.owner,
          creationTime: this.datePipe.transform(
            sample.createdAt,
            "yyyy-MM-dd, hh:mm"
          ),
          description: sample.description,
          ownerGroup: sample.ownerGroup,
        };
      });
    }
  }

  openDialog() {
    this.dialogConfig = new MatDialogConfig();
    this.dialog.open(SampleDialogComponent, {
      width: "250px",
      data: { name: this.name, description: this.description },
    });
  }

  onTextSearchChange(query) {
    this.store.dispatch(setTextFilterAction({ text: query }));
  }

  openSearchParametersDialog() {
    this.dialog
      .open(SearchParametersDialogComponent, {
        data: { parameterKeys: this.metadataKeys },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const { data } = res;
          console.log({ data });
          this.store.dispatch(
            addCharacteristicsFilterAction({ characteristic: data })
          );
        }
      });
  }

  removeCharacteristic(index: number) {
    this.store.dispatch(removeCharacteristicsFilterAction({ index }));
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
    this.store.dispatch(fetchMetadataKeysAction());

    this.subscriptions.push(
      this.store.pipe(select(getSamples)).subscribe((samples) => {
        this.tableData = this.formatTableData(samples);
      })
    );

    this.subscriptions.push(
      combineLatest([this.store.pipe(select(getFilters)), this.readyToFetch$])
        .pipe(
          map(([filters, _]) => filters),
          distinctUntilChanged(deepEqual)
        )
        .subscribe((filters) => {
          this.store.dispatch(fetchSamplesAction());
          this.router.navigate(["/samples"], {
            queryParams: { args: rison.encode(filters) },
          });
        })
    );

    this.subscriptions.push(
      this.store.pipe(select(getMetadataKeys)).subscribe((metadataKeys) => {
        this.metadataKeys = metadataKeys;
      })
    );

    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map((params) => params.args as string),
          take(1),
          map((args) => (args ? rison.decode<SampleFilters>(args) : {}))
        )
        .subscribe((filters) =>
          this.store.dispatch(prefillFiltersAction({ values: filters }))
        )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
