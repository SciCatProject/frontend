import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTime } from "luxon";
import { Observable } from "rxjs";
import { DateRange } from "state-management/state/proposals.store";
import { MultiSelectFilterValue } from "../filters/multiselect-filter.component";
import { INumericRange } from "../numeric-range/form/model/numeric-range-field.model";
import { FilterType } from "state-management/state/user.store";
import { toIsoUtc } from "../filters/utils";
import { orderBy } from "lodash-es";

type FacetItem = { _id: string; label?: string; count: number };
@Component({
  selector: "shared-filter",
  templateUrl: "./shared-filter.component.html",
  styleUrls: ["./shared-filter.component.scss"],
  standalone: false,
})
export class SharedFilterComponent implements OnChanges {
  private dateRange: DateRange = {
    begin: null,
    end: null,
  };
  checkboxDisplaylimit = 10;
  searchInputDisplayThreshold = 10;
  checkboxFacetCounts: FacetItem[] = [];
  showCheckboxSearch = false;

  filterForm = new FormGroup({
    textField: new FormControl(""),
    dateRangeField: new FormGroup({
      start: new FormControl<Date>(null),
      end: new FormControl<Date>(null),
    }),
    multiSelectField: new FormControl([]),
    numberRange: new FormControl({ min: null, max: null }),
    selectedIds: new FormControl<string[]>([]),
  });

  @ViewChild("input", { static: true }) input!: ElementRef<HTMLInputElement>;

  @Input() key = "";
  @Input() label = "Filter";
  @Input() tooltip = "";
  @Input() placeholder = "";
  @Input() facetCounts$!: Observable<FacetItem[]>;
  @Input() localization = "";
  @Input() currentFilter$!: Observable<string[]>;
  @Input() dispatchAction!: () => void;
  @Input() filterType: FilterType;
  @Input() prefilled: string | DateRange | string[] | INumericRange = undefined;
  @Input()
  set clear(value: boolean) {
    this.checkboxDisplaylimit = 10;
    if (value) {
      this.filterForm.reset({
        textField: "",
        dateRangeField: { start: null, end: null },
      });
    }
  }

  @Input() filterValue:
    | string[]
    | string
    | INumericRange
    | DateRange
    | undefined
    | null;
  @Input() showBadge = false;
  @Input() collapsible = false;
  collapsed = false;

  @Output() textChange = new EventEmitter<string>();
  @Output() checkBoxChange = new EventEmitter<string[]>();
  @Output() selectionChange = new EventEmitter<MultiSelectFilterValue>();
  @Output() numericRangeChange = new EventEmitter<INumericRange>();
  @Output() dateRangeChange = new EventEmitter<{
    begin?: string;
    end?: string;
  }>();

  constructor() {}
  ngOnInit() {
    // Reset display limit whenever the text search changes
    this.filterForm.get("textField")!.valueChanges.subscribe(() => {
      this.checkboxDisplaylimit = 10;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.checkboxFacetCounts.length > this.searchInputDisplayThreshold) {
      this.showCheckboxSearch = true;
    } else {
      this.showCheckboxSearch = false;
    }

    if (changes["prefilled"] || changes["filterType"]) {
      if (this.filterType === "text") {
        this.filterForm
          .get("textField")!
          .setValue((this.prefilled as string) || "");
      } else if (this.filterType === "checkbox") {
        this.handleCheckboxFacets(this.prefilled as string[]);
      } else if (this.filterType === "number") {
        const range = this.prefilled as unknown as INumericRange;
        this.filterForm.get("numberRange")!.setValue({
          min: range?.min ?? null,
          max: range?.max ?? null,
        });
      } else {
        const range = (this.prefilled as DateRange) || {
          begin: null,
          end: null,
        };
        this.filterForm
          .get("dateRangeField.start")!
          .setValue(range.begin ? new Date(range.begin) : null);
        this.filterForm
          .get("dateRangeField.end")!
          .setValue(range.end ? new Date(range.end) : null);
      }
    }
  }

  onInput(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.textChange.emit(value);
  }

  dateChanged(evt: MatDatepickerInputEvent<DateTime>, side: "begin" | "end") {
    const isoDate = toIsoUtc(evt.value);
    if (side === "begin") {
      this.dateRange.begin = isoDate;
    }
    if (side === "end") {
      this.dateRange.end = isoDate;
    }
    this.dateRangeChange.emit(this.dateRange);
  }

  onSelectionChange(value: MultiSelectFilterValue) {
    this.selectionChange.emit(value);
  }

  onNumericRangeChange(value: INumericRange) {
    this.numericRangeChange.emit(value);
  }

  /** Checkbox filter helpers START*/
  filteredFacetCounts(): FacetItem[] {
    const term = (this.filterForm.get("textField")?.value ?? "")
      .toLowerCase()
      .trim();
    const selected = new Set(this.filterForm.get("selectedIds")?.value ?? []);

    // the filter is to prevent showing items with empty _id or null which should not be selected anyway
    const base = orderBy(this.checkboxFacetCounts, ["count"], ["desc"]).filter(
      (item) => item._id,
    );

    // always include checked items
    const pinned = base.filter((x) => selected.has(x._id));

    // apply text filter to the rest
    const filtered = term
      ? base.filter((x) =>
          (x.label ?? x._id ?? "").toLowerCase().includes(term),
        )
      : base;

    // merge (checked/pinned to the top), de-duplicate by _id
    const merged = [...pinned, ...filtered]
      .filter((x, i, arr) => arr.findIndex((y) => y._id === x._id) === i)
      .filter((x) => x.count > 0 || selected.has(x._id));

    return merged;
  }

  onShowMore() {
    this.checkboxDisplaylimit += 10;
  }

  onToggleCheckbox(id: string, checked: boolean) {
    const ctrl = this.filterForm.get("selectedIds")!;
    const arr = ctrl.value ?? [];
    const next = checked ? [...arr, id] : arr.filter((x: string) => x !== id);
    ctrl.setValue(next);
    this.checkBoxChange.emit(next);
  }

  get visibleFacetCounts(): FacetItem[] {
    return this.filteredFacetCounts().slice(0, this.checkboxDisplaylimit);
  }
  get hasMore(): boolean {
    return this.filteredFacetCounts().length > this.checkboxDisplaylimit;
  }

  trackById = (_: number, x: FacetItem) => x._id;

  handleCheckboxFacets(prefilledValue: string[]) {
    this.facetCounts$.subscribe((facets) => {
      const prefilled = [prefilledValue].flat().filter(Boolean);
      const selectedIds = new Set(prefilled);
      this.filterForm.get("selectedIds")!.setValue([...selectedIds]);

      const selectedItems = [...selectedIds].map(
        (id) => facets.find((f) => f._id === id) || { _id: id, count: 0 },
      );

      const merged = orderBy(
        [...facets, ...selectedItems].filter(
          (x, i, arr) => arr.findIndex((y) => y._id === x._id) === i,
        ),
        ["count"],
        ["desc"],
      );

      this.checkboxFacetCounts = merged.filter(
        (x) => selectedIds.has(x._id) || x.count > 0,
      );
    });
  }

  get badgeCount(): number {
    return Array.isArray(this.filterValue) ? this.filterValue.length : 0;
  }
  get shouldShowBadge(): boolean {
    return this.collapsible && this.collapsed && this.badgeCount > 0;
  }

  toggleCollapse() {
    if (this.collapsible && this.filterType === "checkbox") {
      this.collapsed = !this.collapsed;
    }
  }

  /** Checkbox filter helpers END*/
}
