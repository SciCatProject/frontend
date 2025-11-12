import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { selectLogbooksDashboardPageViewModel } from "state-management/selectors/logbooks.selectors";
import {
  fetchLogbookAction,
  setTextFilterAction,
  setDisplayFiltersAction,
  changePageAction,
  sortByColumnAction,
  clearLogbookAction,
} from "state-management/actions/logbooks.actions";
import { LogbookFilters } from "state-management/models";

import {
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { AppConfigService } from "app-config.service";
import { Logbook } from "@scicatproject/scicat-sdk-ts-angular";

export interface LogbookData {
  logbook: Logbook;
  entriesCount: number;
  entriesPerPage: number;
  currentPage: number;
  filters: LogbookFilters;
}
@Component({
  selector: "app-proposal-logbook",
  templateUrl: "./proposal-logbook.component.html",
  styleUrls: ["./proposal-logbook.component.scss"],
})
export class ProposalLogbookComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  logbook$ = this.store.select(selectLogbooksDashboardPageViewModel);
  appConfig = this.appConfigService.getConfig();
  subscriptions: Subscription[] = [];

  @Input() proposalId: string;

  constructor(
    public appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private store: Store,
  ) {}

  onTextSearchChange(proposalId: string, query: string) {
    // TODO: query.length return undefined when it is empty
    const queryText = query.length ? query : "";
    this.store.dispatch(setTextFilterAction({ textSearch: queryText }));
    this.store.dispatch(fetchLogbookAction({ name: proposalId }));
  }

  onFilterSelect(proposalId: string, filters: LogbookFilters) {
    const { showBotMessages, showImages, showUserMessages } = filters;

    this.store.dispatch(
      setDisplayFiltersAction({
        showBotMessages,
        showImages,
        showUserMessages,
      }),
    );
    this.store.dispatch(fetchLogbookAction({ name: proposalId }));
  }

  onPageChange(proposalId: string, event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize }),
    );
    this.store.dispatch(fetchLogbookAction({ name: proposalId }));
  }

  onSortChange(proposalId: string, event: SortChangeEvent) {
    const { active: column, direction } = event;
    this.store.dispatch(sortByColumnAction({ column, direction }));
    this.store.dispatch(fetchLogbookAction({ name: proposalId }));
  }

  ngOnInit() {
    this.store.dispatch(fetchLogbookAction({ name: this.proposalId }));
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.store.dispatch(clearLogbookAction());
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
