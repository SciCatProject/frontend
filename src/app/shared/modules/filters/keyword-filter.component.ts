import { Component, OnDestroy } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import {
  selectKeywordFacetCounts,
  selectKeywordsFilter,
  selectKeywordsTerms,
} from "state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import {
  addKeywordFilterAction,
  removeKeywordFilterAction,
} from "state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "app-keyword-filter",
  templateUrl: "keyword-filter.component.html",
  styleUrls: ["keyword-filter.component.scss"],
  standalone: false,
})
export class KeywordFilterComponent
  extends ClearableInputComponent
  implements OnDestroy
{
  protected readonly getFacetCount = getFacetCount;
  protected readonly getFacetId = getFacetId;
  readonly componentName: string = "KeywordFilter";
  readonly label: string = "Keyword Filter";
  readonly tooltipText: string = "Filters datasets by keyword";

  appConfig = this.appConfigService.getConfig();

  keywordsTerms$ = this.store.select(selectKeywordsTerms);

  keywordsFilter$ = this.store.select(selectKeywordsFilter);

  keywordsInput$ = new BehaviorSubject<string>("");
  keywordFacetCounts$ = this.store.select(selectKeywordFacetCounts);

  subscription = undefined;
  typedKeyword: string = "";

  keywordsSuggestions$ = createSuggestionObserver(
    this.keywordFacetCounts$,
    this.keywordsInput$,
    this.keywordsFilter$,
  );

  constructor(
    private store: Store,
    private appConfigService: AppConfigService,
  ) {
    super();

    const filters = this.appConfig.labelMaps?.filters;
    this.label = getFilterLabel(filters, this.componentName, this.label);
    this.subscription = this.keywordsTerms$
      .pipe(
        skipWhile((terms) => terms === ""),
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((terms) => {
        this.store.dispatch(addKeywordFilterAction({ keyword: terms }));
      });
  }

  onKeywordInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.keywordsInput$.next(value);
    this.typedKeyword = value;
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.keywordsInput$.next("");
    this.typedKeyword = "";
  }

  keywordRemoved(keyword: string) {
    this.store.dispatch(removeKeywordFilterAction({ keyword }));
  }

  onKeywordKeyEnter() {
    if (this.typedKeyword) {
      this.keywordSelected(this.typedKeyword);
    }
  }

  onKeywordBlur() {
    if (this.typedKeyword) {
      this.keywordSelected(this.typedKeyword);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
