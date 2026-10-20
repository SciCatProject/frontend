import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  signal,
} from "@angular/core";
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { MetadataKey } from "state-management/models";
import { ConditionKeySource, KEY_PAGE_SIZE } from "./condition-filter.keys";

/** The list is wider than the field to fit the name and the key, if there is room. */
const WIDE_PANEL_WIDTH = 420;
const WIDE_PANEL_MIN_VIEWPORT = 700;

/** Picks a scientific metadata key, loaded page by page, or lets the user type one. */
@Component({
  selector: "condition-key-picker",
  templateUrl: "./condition-key-picker.component.html",
  styleUrls: ["./condition-key-picker.component.scss"],
  standalone: false,
})
export class ConditionKeyPickerComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly requests$ = new Subject<{ term: string; skip: number }>();
  private readonly typed$ = new Subject<string>();
  // the search term the listed keys belong to
  private loadedTerm = "";

  @Input({ required: true }) source: ConditionKeySource;
  @Input() key = "";
  @Input() error = "";
  @Output() keyChange = new EventEmitter<string>();

  readonly pageSize = KEY_PAGE_SIZE;
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
        takeUntil(this.destroy$),
      )
      .subscribe(({ keys, skip }) => {
        this.options.update((loaded) =>
          skip === 0 ? keys : [...loaded, ...keys],
        );
        this.hasMore.set(keys.length === KEY_PAGE_SIZE);
        this.loading.set(false);
      });

    this.typed$
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
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
    if (!this.options().length || this.loadedTerm !== "") {
      this.load("");
    }
  }

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
    this.typed$.next(text.trim());
  }

  onSelected(key: string): void {
    this.keyChange.emit(key);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
