import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, merge, Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { selectSearchTerms } from "../../../state-management/selectors/datasets.selectors";
import { concatLatestFrom } from "@ngrx/operators";

@Component({
  selector: "full-text-search-bar",
  templateUrl: "./full-text-search-bar.component.html",
  styleUrls: ["./full-text-search-bar.component.scss"],
  standalone: false,
})
export class FullTextSearchBarComponent implements OnInit, OnDestroy {
  @Input() prefilledValue = "";
  @Input() placeholder = "Text Search";
  @Input() clear: boolean;

  @Output() textChange = new EventEmitter<string>();

  @Output() searchAction = new EventEmitter<void>();

  searchTerm = "";

  searchTermSubject = new BehaviorSubject<string>("");
  searchClickSubject = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.searchTerm = this.prefilledValue;
    this.searchTermSubject.next(this.searchTerm);
    const searchTerms$ = this.store.select(selectSearchTerms);

    merge(
      // 1) Debounced text changes
      this.searchTermSubject.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap((term) => this.textChange.emit(term)),
      ),

      // 2) Debounced “search” clicks
      this.searchClickSubject.pipe(
        debounceTime(250),
        concatLatestFrom(() => searchTerms$),
        tap(() => this.searchAction.emit()),
      ),
    ).subscribe();
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

  ngOnDestroy(): void {}
}
