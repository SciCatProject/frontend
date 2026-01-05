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
@Component({
  selector: "shared-condition",
  templateUrl: "./shared-condition.component.html",
  styleUrl: "./shared-condition.component.scss",
  standalone: false,
})
export class SharedConditionComponent {
  // Condition filter inputs
  @Input() showConditions = false;
  @Input() metadataKeys: string[] = [];
  @Input() unitsEnabled = false;
  @Input() showConditionToggle = false;
  @Input() conditionType: "datasets" | "samples" = "datasets";
  @Input() addConditionAction: (condition: ScientificCondition) => void;
  @Input() removeConditionAction: (condition: ScientificCondition) => void;
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
    if (this.showConditions) {
      this.buildMetadataMaps();
      this.applyEnabledConditions();
    }
  }

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
