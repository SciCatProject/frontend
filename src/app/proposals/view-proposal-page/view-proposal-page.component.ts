import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  fetchProposalAction,
  fetchProposalDatasetsAction,
  changeDatasetsPageAction,
  fetchParentProposalAction,
  clearProposalsStateAction,
} from "state-management/actions/proposals.actions";
import { selectViewProposalPageViewModel } from "state-management/selectors/proposals.selectors";
import {
  TableColumn,
  PageChangeEvent,
} from "shared/modules/table/table.component";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { fetchLogbookAction } from "state-management/actions/logbooks.actions";
import { AppConfigService } from "app-config.service";
import { selectLogbooksDashboardPageViewModel } from "state-management/selectors/logbooks.selectors";
import {
  DatasetClass,
  OutputDatasetObsoleteDto,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";

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
  selector: "view-proposal-page",
  templateUrl: "view-proposal-page.component.html",
  styleUrls: ["view-proposal-page.component.scss"],
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
  vm$ = this.store.select(selectViewProposalPageViewModel);
  logbook$ = this.store.select(selectLogbooksDashboardPageViewModel);
  appConfig = this.appConfigService.getConfig();

  proposal: ProposalClass;

  subscriptions: Subscription[] = [];

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
    public appConfigService: AppConfigService,
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private route: ActivatedRoute,
    private router: Router,
    private slicePipe: SlicePipe,
    private store: Store,
  }

  ngOnInit() {
    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        if (vm.proposal) {
          this.proposal = vm.proposal;

          if (
            this.proposal["parentProposalId"] &&
            this.proposal["parentProposalId"] !== ""
          ) {
            this.fetchProposalRelatedDocuments();
          }
        }
      }),
    );

    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.store.dispatch(fetchProposalAction({ proposalId: params.id }));
        this.store.dispatch(
          fetchProposalDatasetsAction({ proposalId: params.id }),
        );
        this.store.dispatch(fetchLogbookAction({ name: params.id }));
      }),
    );

  }

  fetchProposalRelatedDocuments(): void {
    this.store.dispatch(
      fetchParentProposalAction({
        proposalId: this.proposal["parentProposalId"] as string,
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.store.dispatch(clearProposalsStateAction());
  }
}
