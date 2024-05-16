import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  fetchDatasetsAction,
  fetchFacetCountsAction,
  setSearchTermsAction,
  setTextFilterAction,
} from "../../../state-management/actions/datasets.actions";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  withLatestFrom,
} from "rxjs/operators";
import { selectSearchTerms } from "../../../state-management/selectors/datasets.selectors";

@Component({
  selector: "full-text-search-bar",
  template: ` <mat-form-field appearance="fill" class="full-text-search-field">
      <mat-label>Search</mat-label>
      <input
        matInput
        placeholder="Type to search..."
        type="search"
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchTermChange($event)"
      />
    </mat-form-field>
    <span>
      <button
        mat-flat-button
        color="accent"
        data-cy="search-button"
        (click)="onSearch()"
      >
        <mat-icon>search</mat-icon>
        Search
      </button>
      <button mat-flat-button data-cy="search-clear-button" (click)="onClear()">
        <mat-icon>close</mat-icon>
        Clear
      </button>
    </span>`,
  styles: [
    `
      .full-text-search-field {
        max-width: 80%;
        width: 100%;
        margin-left: 5em;
      }

      .full-text-search-field + span {
        margin-left: 5em;
      }
    `,
  ],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class FullTextSearchBarComponent implements OnInit, OnDestroy {
  @Input() prefilledValue = "";
  @Input() placeholder = "Text Search";
  @Input() clear: boolean;

  searchTerm = "";

  searchTermSubject = new BehaviorSubject<string>("");
  searchClickSubject = new Subject<void>();
  subscriptions: Subscription[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.searchTermSubject.next(this.prefilledValue);

    this.subscriptions.push(
      this.searchTermSubject
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe((terms) => {
          console.log(`set terms: ${terms}`);
          this.store.dispatch(setSearchTermsAction({ terms }));
          this.store.dispatch(setTextFilterAction({ text: terms }));
        }),
    );

    const searchTerms$ = this.store.select(selectSearchTerms);

    this.subscriptions.push(
      this.searchClickSubject
        .pipe(debounceTime(250), withLatestFrom(searchTerms$))
        .subscribe(([_, terms]) => {
          console.log(`latest terms: ${terms}`);
          this.store.dispatch(fetchDatasetsAction());
          this.store.dispatch(fetchFacetCountsAction());
        }),
    );
  }

  onSearch(): void {
    this.searchClickSubject.next();
  }

  onSearchTermChange(terms: string) {
    this.searchTermSubject.next(terms);
  }

  onClear(): void {
    this.searchTerm = "";
    this.searchTermSubject.next(undefined);
    this.searchClickSubject.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
