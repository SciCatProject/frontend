import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { Subscription } from "rxjs";
import { Sample, Dataset } from "../../shared/sdk/models";
import {
  getCurrentSample,
  getDatasets,
  getDatasetsPerPage,
  getDatasetsPage,
  getDatasetsCount
} from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";
import {
  fetchSampleAction,
  fetchSampleDatasetsAction,
  changeDatasetsPageAction,
  saveCharacteristicsAction
} from "../../state-management/actions/samples.actions";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import {
  TableColumn,
  PageChangeEvent
} from "shared/modules/table/table.component";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  datasetsPage$ = this.store.pipe(select(getDatasetsPage));
  datasetsCount$ = this.store.pipe(select(getDatasetsCount));

  sample: Sample;
  sampleSubscription: Subscription;
  datasetsSubscription: Subscription;
  routeSubscription: Subscription;

  tableData: any[];
  tablePaginate = true;
  tableColumns: TableColumn[] = [
    { name: "name", icon: "portrait", sort: false, inList: true },
    { name: "sourceFolder", icon: "explore", sort: false, inList: true },
    { name: "size", icon: "save", sort: false, inList: true },
    { name: "creationTime", icon: "calendar_today", sort: false, inList: true },
    { name: "owner", icon: "face", sort: false, inList: true },
    { name: "location", icon: "explore", sort: false, inList: true }
  ];

  formatTableData(datasets: Dataset[]): any[] {
    if (datasets) {
      return datasets.map((dataset: any) => {
        return {
          pid: dataset.pid,
          name: dataset.datasetName,
          sourceFolder:
            "..." + this.slicePipe.transform(dataset.sourceFolder, -14),
          size: this.filesizePipe.transform(dataset.size),
          creationTime: this.datePipe.transform(
            dataset.creationTime,
            "yyyy-MM-dd HH:mm"
          ),
          owner: dataset.owner,
          location: dataset.creationLocation
        };
      });
    }
  }

  onSaveCharacteristics(characteristics: object) {
    this.store.dispatch(
      saveCharacteristicsAction({
        sampleId: this.sample.sampleId,
        characteristics
      })
    );
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changeDatasetsPageAction({ page: event.pageIndex, limit: event.pageSize })
    );
    this.store.dispatch(
      fetchSampleDatasetsAction({ sampleId: this.sample.sampleId })
    );
  }

  onRowClick(dataset: Dataset) {
    const id = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + id);
  }

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private router: Router,
    private route: ActivatedRoute,
    private slicePipe: SlicePipe,
    private store: Store<Sample>
  ) {}

  ngOnInit() {
    this.sampleSubscription = this.store
      .pipe(select(getCurrentSample))
      .subscribe(sample => {
        this.sample = sample;
      });

    this.datasetsSubscription = this.store
      .pipe(select(getDatasets))
      .subscribe(datasets => {
        this.tableData = this.formatTableData(datasets);
      });

    this.routeSubscription = this.route.params.subscribe(params => {
      this.store.dispatch(fetchSampleAction({ sampleId: params.id }));
      this.store.dispatch(fetchSampleDatasetsAction({ sampleId: params.id }));
    });
  }

  ngOnDestroy() {
    this.sampleSubscription.unsubscribe();
    this.datasetsSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
