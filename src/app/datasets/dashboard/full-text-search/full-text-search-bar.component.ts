import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
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
  templateUrl: "./full-text-search-bar.component.html",
  styleUrls: ["./full-text-search-bar.component.scss"],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
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
    //this.searchClickSubject.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
