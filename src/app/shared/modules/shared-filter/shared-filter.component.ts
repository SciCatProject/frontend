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

type FacetItem = { _id?: string; label?: string; count: number };
@Component({
  selector: "shared-filter",
  templateUrl: "./shared-filter.component.html",
  styleUrls: ["./shared-filter.component.scss"],
  standalone: false,
})
export class SharedFilterComponent implements OnChanges {
  checkboxDisplaylimit = 10;
  checkboxFacetCounts: FacetItem[] = [];
  private dateRange: DateRange = {
    begin: null,
    end: null,
  };

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

  @Output() textChange = new EventEmitter<string>();
  @Output() checkBoxChange = new EventEmitter<string[]>();
  @Output() selectionChange = new EventEmitter<MultiSelectFilterValue>();
  @Output() numericRangeChange = new EventEmitter<INumericRange>();
  @Output() dateRangeChange = new EventEmitter<{
    begin: string;
    end: string;
  }>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes["prefilled"] || changes["filterType"]) {
      if (this.filterType === "text") {
        this.filterForm
          .get("textField")!
          .setValue((this.prefilled as string) || "");
      } else if (this.filterType === "checkbox") {
        this.facetCounts$.subscribe((facets) => {
          this.checkboxFacetCounts = facets;
        });
        this.filterForm
          .get("selectedIds")!
          .setValue((this.prefilled as string[]) || []);
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

  /** Checkbox filter helpers */
  get visibleFacetCounts(): FacetItem[] {
    const term = (this.filterForm.get("textField")?.value ?? "")
      .toLowerCase()
      .trim();
    const selected = new Set(this.filterForm.get("selectedIds")?.value ?? []);

    const base = this.checkboxFacetCounts;

    // always include checked items
    const pinned = base.filter((x) => selected.has(x._id));

    // apply text filter to the rest
    const filtered = term
      ? base.filter((x) => (x.label ?? x._id).toLowerCase().includes(term))
      : base;

    // merge (checked/pinned to the top), de-duplicate by _id
    const merged = [...pinned, ...filtered].filter(
      (x, i, arr) => arr.findIndex((y) => y._id === x._id) === i,
    );

    // slice based on display limit
    return merged.slice(0, this.checkboxDisplaylimit);
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
  get hasMore(): boolean {
    return this.checkboxFacetCounts.length > this.checkboxDisplaylimit;
  }

  trackById = (_: number, x: FacetItem) => x._id;
}
