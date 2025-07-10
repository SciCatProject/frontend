import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
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
  subscriptions: Subscription[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.searchTermSubject.next(this.prefilledValue);

    this.subscriptions.push(
      this.searchTermSubject
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe((terms) => {
          this.textChange.emit(terms);
        }),
    );

    const searchTerms$ = this.store.select(selectSearchTerms);

    this.subscriptions.push(
      this.searchClickSubject
        .pipe(
          debounceTime(250),
          concatLatestFrom(() => [searchTerms$]),
        )
        .subscribe(([_, terms]) => {
          this.searchAction.emit();
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
