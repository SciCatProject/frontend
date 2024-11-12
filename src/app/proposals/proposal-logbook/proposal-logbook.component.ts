import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription, take } from "rxjs";
import { selectCurrentLogbook } from "state-management/selectors/logbooks.selectors";
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
import { Logbook } from "@scicatproject/scicat-sdk-ts";

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
  logbook$: Observable<any | null> = this.store.select(selectCurrentLogbook);
  appConfig = this.appConfigService.getConfig();
  subscriptions: Subscription[] = [];

  @Input() logbook: LogbookData | null = null; // Still accepting input from parent if provided

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
    if (!this.logbook) {
      this.logbook$.pipe(take(1)).subscribe((logbook) => {
        if (logbook && logbook.name) {
          this.store.dispatch(fetchLogbookAction({ name: logbook.name }));
        }
      });
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.store.dispatch(clearLogbookAction());
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
