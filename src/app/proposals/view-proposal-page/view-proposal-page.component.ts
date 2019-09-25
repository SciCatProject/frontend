import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Subscription, Observable } from "rxjs";
import {
  SelectProposalAction,
  FetchProposalAction,
  FetchDatasetsForProposalAction,
  ChangePageAction
} from "state-management/actions/proposals.actions";
import {
  getCurrentProposal,
  getSelectedProposalDatasets,
  getPage,
  getdatasetCount
} from "state-management/selectors/proposals.selectors";
import { AppState } from "state-management/state/app.store";
import { Dataset, Proposal } from "state-management/models";
import {
  TableColumn,
  PageChangeEvent
} from "shared/modules/table/table.component";
import { DatePipe, SlicePipe } from "@angular/common";
import { getDatasetsPerPage } from "state-management/selectors/datasets.selectors";
import { FileSizePipe } from "shared/pipes/filesize.pipe";

@Component({
  selector: "view-proposal-page",
  templateUrl: "view-proposal-page.component.html",
  styleUrls: ["view-proposal-page.component.scss"]
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
  proposal$: Observable<Proposal> = this.store.pipe(select(getCurrentProposal));
  currentPage$ = this.store.pipe(select(getPage));
  datasetCount$ = this.store.pipe(select(getdatasetCount));
  itemsPerPage$ = this.store.pipe(select(getDatasetsPerPage));

  datasetsSubscription: Subscription;
  routeSubscription: Subscription;

  tablePaginate: boolean = true;
  tableData: any[];
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

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
  }

  onRowClick(dataset: Dataset) {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  constructor(
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private route: ActivatedRoute,
    private router: Router,
    private slicePipe: SlicePipe,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.store.dispatch(new FetchProposalAction(params.id));
      this.store.dispatch(new FetchDatasetsForProposalAction(params.id));
      this.store.dispatch(new SelectProposalAction(params.id));
    });

    this.datasetsSubscription = this.store
      .pipe(select(getSelectedProposalDatasets))
      .subscribe(datasets => {
        this.tableData = this.formatTableData(datasets);
      });
  }

  ngOnDestroy() {
    this.datasetsSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
