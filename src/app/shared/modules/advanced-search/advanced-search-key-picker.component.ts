import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from "@angular/core";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  Subject,
  catchError,
  debounceTime,
  filter,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import { MetadataKey } from "state-management/models";
import { ConditionKeySource, KEY_PAGE_SIZE } from "./advanced-search.keys";

/** The list is wider than the field to fit the name and the key, if there is room. */
const WIDE_PANEL_WIDTH = 420;
const WIDE_PANEL_MIN_VIEWPORT = 700;

/** The value of the "Show more" row, it is not a key, picking it with the keyboard loads more. */
export const LOAD_MORE = "\u0000load-more";

/** The search waits until typing has stopped for this long. */
export const SEARCH_DEBOUNCE_MS = 250;

/** Picks a scientific metadata key, loaded page by page, or lets the user type one. */
@Component({
  selector: "advanced-search-key-picker",
  templateUrl: "./advanced-search-key-picker.component.html",
  styleUrls: ["./advanced-search-key-picker.component.scss"],
  standalone: false,
})
export class AdvancedSearchKeyPickerComponent {
  private readonly requests$ = new Subject<{ term: string; skip: number }>();
  private readonly typed$ = new Subject<string>();
  // the search term the listed keys belong to
  private loadedTerm = "";
  // the list opens again after "Show more", with the keys it has
  private keepOnOpen = false;

  @ViewChild(MatAutocompleteTrigger) private trigger?: MatAutocompleteTrigger;

  @Input({ required: true }) source: ConditionKeySource;
  @Input() key = "";
  @Input() error = "";
  @Output() keyChange = new EventEmitter<string>();

  readonly pageSize = KEY_PAGE_SIZE;
  readonly loadMoreValue = LOAD_MORE;
  readonly options = signal<MetadataKey[]>([]);
  readonly loading = signal(false);
  readonly hasMore = signal(true);

  constructor() {
    this.requests$
      .pipe(
        tap(() => this.loading.set(true)),
        // a new search or page replaces the one that is still loading
        switchMap(({ term, skip }) =>
          this.source(term, skip, KEY_PAGE_SIZE).pipe(
            map((keys) => ({ keys, skip })),
            catchError(() => of({ keys: [] as MetadataKey[], skip })),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(({ keys, skip }) => {
        this.options.update((loaded) =>
          skip === 0 ? keys : [...loaded, ...keys],
        );
        this.hasMore.set(keys.length === KEY_PAGE_SIZE);
        this.loading.set(false);
      });

    this.typed$
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        filter((term) => term !== this.loadedTerm),
        takeUntilDestroyed(),
      )
      .subscribe((term) => this.load(term));
  }

  get panelWidth(): number | "auto" {
    return window.innerWidth < WIDE_PANEL_MIN_VIEWPORT
      ? "auto"
      : WIDE_PANEL_WIDTH;
  }

  private load(term: string): void {
    this.loadedTerm = term;
    this.requests$.next({ term, skip: 0 });
  }

  /** The list is for all keys when it opens, typing narrows it. */
  onOpened(): void {
    if (this.keepOnOpen) {
      this.keepOnOpen = false;
      return;
    }
    if (!this.options().length || this.loadedTerm !== "") {
      this.load("");
    }
  }

  // the input keeps its key when the "Show more" row is picked
  readonly displayKey = (value: string): string =>
    value === LOAD_MORE ? this.key : value;

  loadMore(): void {
    if (this.hasMore() && !this.loading()) {
      this.requests$.next({
        term: this.loadedTerm,
        skip: this.options().length,
      });
    }
  }

  onInput(text: string): void {
    this.keyChange.emit(text);
    const term = text.trim();
    // the list says it is loading at once, not only after the search started
    this.loading.set(term !== this.loadedTerm);
    this.typed$.next(term);
  }

  onSelected(key: string): void {
    if (key === LOAD_MORE) {
      this.loadMore();
      // picking a row closes the list, it opens again to show the keys that came
      this.keepOnOpen = true;
      setTimeout(() => this.trigger?.openPanel());
    } else if (key != null) {
      this.keyChange.emit(key);
    }
  }
}
