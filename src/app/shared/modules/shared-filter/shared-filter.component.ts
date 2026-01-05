import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTime } from "luxon";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { DateRange } from "state-management/state/proposals.store";
import { MultiSelectFilterValue } from "../filters/multiselect-filter.component";
import { INumericRange } from "../numeric-range/form/model/numeric-range-field.model";
import { FilterType, ConditionConfig } from "state-management/state/user.store";
import { toIsoUtc } from "../filters/utils";
import { orderBy, isEqual } from "lodash-es";
import { ScientificCondition } from "state-management/models";
import { ConnectedPosition } from "@angular/cdk/overlay";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AsyncPipe } from "@angular/common";
import { UnitsService } from "shared/services/units.service";
import { UnitsOptionsService } from "shared/services/units-options.service";
import {
  SearchParametersDialogComponent,
  SearchParametersDialogData,
} from "../search-parameters-dialog/search-parameters-dialog.component";
import {
  updateConditionsConfigs,
  updateUserSettingsAction,
  selectColumnAction,
  deselectColumnAction,
} from "state-management/actions/user.actions";
import { selectConditions } from "state-management/selectors/user.selectors";

type FacetItem = { _id: string; label?: string; count: number };

@Component({
  selector: "shared-filter",
  templateUrl: "./shared-filter.component.html",
  styleUrls: ["./shared-filter.component.scss"],
  standalone: false,
})
export class SharedFilterComponent implements OnChanges, OnInit {
  private dateRange: DateRange = { begin: null, end: null };

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
  // Condition filter inputs
  @Input() showConditions = false;
  @Input() metadataKeys: string[] = [];
  @Input() unitsEnabled = false;
  @Input() showConditionToggle = false;
  @Input() conditionType: "datasets" | "samples" = "datasets";
  @Input() addConditionAction: (condition: ScientificCondition) => void;
  @Input() removeConditionAction: (condition: ScientificCondition) => void;

  @Output() textChange = new EventEmitter<string>();
  @Output() checkBoxChange = new EventEmitter<string[]>();
  @Output() selectionChange = new EventEmitter<MultiSelectFilterValue>();
  @Output() numericRangeChange = new EventEmitter<INumericRange>();
  @Output() dateRangeChange = new EventEmitter<{
    begin?: string;
    end?: string;
  }>();
  @Output() conditionsApplied = new EventEmitter<void>();

  allConditions$ = this.store.select(selectConditions);

  conditionConfigs$ = this.allConditions$.pipe(
    map((configs) =>
      (configs || []).filter((c) => c.conditionType === this.conditionType),
    ),
  );

  humanNameMap: { [key: string]: string } = {};
  fieldTypeMap: { [key: string]: string } = {};
  tempConditionValues: string[] = [];
  hoverKey: string | null = null;
  overlayPositions: ConnectedPosition[] = [
    {
      originX: "end",
      originY: "center",
      overlayX: "start",
      overlayY: "center",
      offsetX: 8,
    },
    {
      originX: "center",
      originY: "center",
      overlayX: "end",
      overlayY: "top",
      offsetY: 8,
    },
  ];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private asyncPipe: AsyncPipe,
    private unitsService: UnitsService,
    private unitsOptionsService: UnitsOptionsService,
  ) {}

  ngOnInit() {
    // Reset display limit whenever the text search changes
    this.filterForm.get("textField")!.valueChanges.subscribe(() => {
      this.checkboxDisplaylimit = 10;
    });

    if (this.showConditions) {
      this.buildMetadataMaps();
      this.applyEnabledConditions();
    }
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
    return this.showBadge && this.badgeCount > 0;
  }

  /** Checkbox filter helpers END*/

  /** Condition filter helpers and methods START */

  // Helper to get all conditions and update store
  updateStore(updatedConditions: ConditionConfig[]) {
    this.store.dispatch(
      updateConditionsConfigs({ conditionConfigs: updatedConditions }),
    );
    this.store.dispatch(
      updateUserSettingsAction({ property: { conditions: updatedConditions } }),
    );
  }

  buildMetadataMaps() {
    this.conditionConfigs$.pipe(take(1)).subscribe((conditionConfigs) => {
      (conditionConfigs || []).forEach((config) => {
        const { lhs, type, human_name } = config.condition;
        if (lhs && type) this.fieldTypeMap[lhs] = type;
        if (lhs && human_name) this.humanNameMap[lhs] = human_name;
      });
    });
  }

  applyEnabledConditions() {
    this.allConditions$.pipe(take(1)).subscribe((allConditions) => {
      const needsUpdate = (allConditions || []).some((c) => !c.conditionType);

      if (needsUpdate) {
        const updatedConditions = (allConditions || []).map((c) => ({
          ...c,
          conditionType: c.conditionType || this.conditionType,
        }));
        this.updateStore(updatedConditions);
      }

      const myConditions = (allConditions || []).filter(
        (c) => !c.conditionType || c.conditionType === this.conditionType,
      );

      myConditions.forEach((config) => {
        this.applyUnitsOptions(config.condition);
        if (config.enabled && config.condition.lhs && config.condition.rhs) {
          this.addConditionAction?.(config.condition);
        }
      });
    });
  }

  applyUnitsOptions(condition: ScientificCondition): void {
    const lhs = condition?.lhs;
    const unitsOptions = condition?.unitsOptions;
    if (lhs && unitsOptions?.length) {
      this.unitsOptionsService.setUnitsOptions(lhs, unitsOptions);
    }
  }

  trackByCondition(index: number, conditionConfig: ConditionConfig): string {
    return `${conditionConfig.condition.lhs}-${index}`;
  }

  getHumanName(key: string): string {
    return this.humanNameMap[key];
  }

  getOperatorUIValue(relation: string): string {
    return relation === "EQUAL_TO_NUMERIC" || relation === "EQUAL_TO_STRING"
      ? "EQUAL_TO"
      : relation;
  }

  getAllowedOperators(key: string): string[] {
    const type = this.fieldTypeMap[key];
    if (type === "string") return ["EQUAL_TO"];
    return [
      "EQUAL_TO",
      "GREATER_THAN",
      "LESS_THAN",
      "GREATER_THAN_OR_EQUAL",
      "LESS_THAN_OR_EQUAL",
      "RANGE",
    ];
  }

  getUnits(parameterKey: string): string[] {
    const stored = this.unitsOptionsService.getUnitsOptions(parameterKey);
    if (stored?.length) return stored;
    return this.unitsService.getUnits(parameterKey);
  }

  getConditionDisplayText(
    condition: ScientificCondition,
    index?: number,
  ): string {
    if (condition.relation === "RANGE") {
      if (!condition.lhs || !condition.rhs) return "Configure condition...";
      const rangeValues = Array.isArray(condition.rhs)
        ? condition.rhs
        : [undefined, undefined];
      const min = rangeValues[0] !== undefined ? rangeValues[0] : "?";
      const max = rangeValues[1] !== undefined ? rangeValues[1] : "?";
      const unit = condition.unit ? ` ${condition.unit}` : "";
      return `${min} <-> ${max}${unit}`;
    }

    const rhsValue =
      this.tempConditionValues[index] != undefined
        ? this.tempConditionValues[index]
        : condition.rhs;
    if (!condition.lhs || rhsValue == null || rhsValue === "")
      return "Configure condition...";

    let relationSymbol = "";
    switch (condition.relation) {
      case "EQUAL_TO_NUMERIC":
      case "EQUAL_TO_STRING":
      case "EQUAL_TO":
        relationSymbol = "=";
        break;
      case "LESS_THAN":
        relationSymbol = "<";
        break;
      case "GREATER_THAN":
        relationSymbol = ">";
        break;
      case "GREATER_THAN_OR_EQUAL":
        relationSymbol = "≥";
        break;
      case "LESS_THAN_OR_EQUAL":
        relationSymbol = "≤";
        break;
    }

    const unit = condition.unit ? ` ${condition.unit}` : "";
    return `${relationSymbol} ${rhsValue}${unit}`;
  }

  addCondition() {
    this.buildMetadataMaps();

    this.allConditions$.pipe(take(1)).subscribe((allConditions) => {
      const myConditions = (allConditions || []).filter(
        (c) => c.conditionType === this.conditionType,
      );
      const usedFields = myConditions.map((config) => config.condition.lhs);
      const availableKeys = (this.metadataKeys || []).filter(
        (key) => !usedFields.includes(key),
      );

      this.dialog
        .open<SearchParametersDialogComponent, SearchParametersDialogData>(
          SearchParametersDialogComponent,
          {
            data: {
              usedFields: usedFields,
              parameterKeys: availableKeys,
              humanNameMap: this.humanNameMap,
            },
            restoreFocus: false,
          },
        )
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            const { data } = res;

            const existingConditionIndex = myConditions.findIndex((config) =>
              isEqual(this.humanNameMap[config.condition.lhs], data.lhs),
            );

            if (existingConditionIndex !== -1) {
              this.snackBar.open("Condition already exists", "Close", {
                duration: 2000,
                panelClass: ["snackbar-warning"],
              });
              return;
            }

            const newCondition: ConditionConfig = {
              condition: {
                ...data,
                rhs: "",
                type: this.fieldTypeMap[data.lhs],
                human_name: this.humanNameMap[data.lhs],
              },
              enabled: true,
              conditionType: this.conditionType,
            };

            this.updateStore([...(allConditions || []), newCondition]);
            this.store.dispatch(
              selectColumnAction({ name: data.lhs, columnType: "custom" }),
            );

            this.snackBar.open("Condition added successfully", "Close", {
              duration: 2000,
              panelClass: ["snackbar-success"],
            });
          }
        });
    });
  }

  removeCondition(condition: ConditionConfig, index: number) {
    this.allConditions$.pipe(take(1)).subscribe((allConditions) => {
      const actualIndex = (allConditions || []).findIndex(
        (c) =>
          c.condition.lhs === condition.condition.lhs &&
          c.conditionType === this.conditionType,
      );

      if (actualIndex === -1) return;

      const updatedConditions = [...(allConditions || [])];
      updatedConditions.splice(actualIndex, 1);
      this.tempConditionValues.splice(index, 1);

      if (condition.enabled) {
        this.removeConditionAction?.(condition.condition);
        this.store.dispatch(
          deselectColumnAction({
            name: condition.condition.lhs,
            columnType: "custom",
          }),
        );
      }

      if (condition.condition.lhs) {
        this.unitsOptionsService.clearUnitsOptions(condition.condition.lhs);
      }

      this.updateStore(updatedConditions);
    });
  }

  updateConditionField(index: number, updates: Partial<ScientificCondition>) {
    this.allConditions$.pipe(take(1)).subscribe((allConditions) => {
      const myConditions = (allConditions || []).filter(
        (c) => c.conditionType === this.conditionType,
      );

      if (!myConditions[index]) return;

      const actualIndex = (allConditions || []).findIndex(
        (c) =>
          c.condition.lhs === myConditions[index].condition.lhs &&
          c.conditionType === this.conditionType,
      );

      if (actualIndex === -1) return;

      const updatedConditions = [...(allConditions || [])];
      const conditionConfig = updatedConditions[actualIndex];

      updatedConditions[actualIndex] = {
        ...conditionConfig,
        condition: {
          ...conditionConfig.condition,
          ...updates,
          type: this.fieldTypeMap[conditionConfig.condition.lhs],
          human_name: this.humanNameMap[conditionConfig.condition.lhs],
        },
      };

      this.store.dispatch(
        updateConditionsConfigs({ conditionConfigs: updatedConditions }),
      );
    });
  }

  updateConditionOperator(
    index: number,
    newOperator: ScientificCondition["relation"],
  ) {
    delete this.tempConditionValues[index];
    this.updateConditionField(index, {
      relation: newOperator,
      rhs: newOperator === "RANGE" ? [undefined, undefined] : "",
      unit: newOperator === "EQUAL_TO_STRING" ? "" : undefined,
    });
  }

  updateConditionValue(index: number, event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.tempConditionValues[index] = newValue;
  }

  updateConditionRangeValue(index: number, event: Event, rangeIndex: 0 | 1) {
    const newValue = (event.target as HTMLInputElement).value;
    const currentRhs = this.asyncPipe.transform(this.conditionConfigs$)?.[index]
      ?.condition.rhs;
    const rhs = Array.isArray(currentRhs)
      ? [...currentRhs]
      : [undefined, undefined];
    rhs[rangeIndex] = Number(newValue);
    this.updateConditionField(index, { rhs });
  }

  updateConditionUnit(index: number, event: any) {
    const newUnit = event.target
      ? (event.target as HTMLInputElement).value
      : event.option.value;
    this.updateConditionField(index, { unit: newUnit || undefined });
  }

  toggleConditionEnabled(index: number, enabled: boolean) {
    this.allConditions$.pipe(take(1)).subscribe((allConditions) => {
      const myConditions = (allConditions || []).filter(
        (c) => c.conditionType === this.conditionType,
      );

      if (!myConditions[index]) return;

      const actualIndex = (allConditions || []).findIndex(
        (c) =>
          c.condition.lhs === myConditions[index].condition.lhs &&
          c.conditionType === this.conditionType,
      );

      if (actualIndex === -1) return;

      const updatedConditions = [...(allConditions || [])];
      updatedConditions[actualIndex] = {
        ...updatedConditions[actualIndex],
        enabled,
      };
      const condition = updatedConditions[actualIndex].condition;

      if (enabled && condition.lhs && condition.rhs) {
        this.addConditionAction?.(condition);
        this.store.dispatch(
          selectColumnAction({ name: condition.lhs, columnType: "custom" }),
        );
      } else {
        this.removeConditionAction?.(condition);
        this.store.dispatch(
          deselectColumnAction({ name: condition.lhs, columnType: "custom" }),
        );
      }

      this.updateStore(updatedConditions);
    });
  }

  applyConditions() {
    this.allConditions$.pipe(take(1)).subscribe((allConditions) => {
      const myConditions = (allConditions || []).filter(
        (c) => c.conditionType === this.conditionType,
      );
      const otherConditions = (allConditions || []).filter(
        (c) => c.conditionType !== this.conditionType,
      );

      const updatedMyConditions = myConditions.map((config, i) => {
        const lhs = config.condition.lhs;
        const baseCondition = {
          ...config.condition,
          type: this.fieldTypeMap[lhs],
          human_name: this.humanNameMap[lhs],
        };

        if (this.tempConditionValues[i] !== undefined) {
          const value = this.tempConditionValues[i];
          const fieldType = this.fieldTypeMap[config.condition.lhs];
          const isNumeric = value !== "" && !isNaN(Number(value));

          if (config.condition.relation === "EQUAL_TO") {
            return {
              ...config,
              condition: {
                ...baseCondition,
                rhs: isNumeric ? Number(value) : value,
                relation:
                  fieldType === "string" || !isNumeric
                    ? ("EQUAL_TO_STRING" as ScientificCondition["relation"])
                    : ("EQUAL_TO_NUMERIC" as ScientificCondition["relation"]),
              },
            };
          } else {
            return {
              ...config,
              condition: {
                ...baseCondition,
                rhs: isNumeric ? Number(value) : value,
              },
            };
          }
        }
        return { ...config, condition: baseCondition };
      });

      // Removes old conditions for this type
      updatedMyConditions.forEach((c) =>
        this.removeConditionAction?.(c.condition),
      );

      // Adds updated conditions for this type
      updatedMyConditions.forEach((config) => {
        if (
          config.enabled &&
          config.condition.lhs &&
          config.condition.rhs != null &&
          config.condition.rhs !== ""
        ) {
          this.addConditionAction?.(config.condition);
        }
      });

      // Merges other conditions with updated conditions for this type
      this.updateStore([...otherConditions, ...updatedMyConditions]);
      this.tempConditionValues = [];
      this.conditionsApplied.emit();
    });
  }

  clearConditions() {
    this.allConditions$.pipe(take(1)).subscribe((allConditions) => {
      const myConditions = (allConditions || []).filter(
        (c) => c.conditionType === this.conditionType,
      );

      myConditions.forEach((config) =>
        this.removeConditionAction?.(config.condition),
      );

      const updatedConditions = (allConditions || []).filter(
        (c) => c.conditionType !== this.conditionType,
      );
      this.updateStore(updatedConditions);
    });
  }

  /** Condition filter helpers and methods END */
}
