import { Component, OnDestroy } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import { createSuggestionObserver, getFacetCount, getFacetId } from "../utils";
import {
  selectKeywordFacetCounts,
  selectKeywordsFilter,
  selectKeywordsTerms,
} from "../../../state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import {
  addKeywordFilterAction,
  removeKeywordFilterAction,
} from "../../../state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";

@Component({
  selector: "app-keyword-filter",
  template: `<mat-form-field>
    <mat-label>{{ label }}</mat-label>
    <mat-chip-grid #keywordChipList>
      <mat-chip-row
        *ngFor="let keyword of keywordsFilter$ | async"
        [removable]="true"
        (removed)="keywordRemoved(keyword)"
        >{{ keyword }}<mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip-row>
    </mat-chip-grid>
    <input
      #input
      (input)="onKeywordInput($event)"
      [value]="keywordsInput$ | async"
      matInput
      class="keyword-input"
      [matChipInputFor]="keywordChipList"
      [matAutocomplete]="kw"
    />
    <mat-autocomplete #kw="matAutocomplete">
      <mat-option
        (onSelectionChange)="keywordSelected(getFacetId(fc))"
        *ngFor="let fc of keywordsSuggestions$ | async"
      >
        <span>{{ getFacetId(fc, "No Keywords") }}</span>
        <small>: {{ getFacetCount(fc) }}</small>
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>`,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class KeywordFilterComponent
  extends ClearableInputComponent
  implements OnDestroy
{
  static kName = "keyword";

  protected readonly getFacetCount = getFacetCount;
  protected readonly getFacetId = getFacetId;

  label = "Keywords";

  keywordsTerms$ = this.store.select(selectKeywordsTerms);

  keywordsFilter$ = this.store.select(selectKeywordsFilter);

  keywordsInput$ = new BehaviorSubject<string>("");
  keywordFacetCounts$ = this.store.select(selectKeywordFacetCounts);

  subscription = undefined;

  keywordsSuggestions$ = createSuggestionObserver(
    this.keywordFacetCounts$,
    this.keywordsInput$,
    this.keywordsFilter$,
  );

  constructor(private store: Store) {
    super();

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
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.keywordsInput$.next("");
  }

  keywordRemoved(keyword: string) {
    this.store.dispatch(removeKeywordFilterAction({ keyword }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
