import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";
import { take } from "rxjs/operators";
import { ConditionConfig } from "state-management/state/user.store";
import { isEqual } from "lodash-es";
import {
  ScientificCondition,
  ConditionSettingsKey,
} from "state-management/models";
import { ConnectedPosition } from "@angular/cdk/overlay";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AsyncPipe } from "@angular/common";
import { UnitsService } from "shared/services/units.service";
import { UnitsOptionsService } from "shared/services/units-options.service";
import { Subscription } from "rxjs";
import {
  SearchParametersDialogComponent,
  SearchParametersDialogData,
} from "../search-parameters-dialog/search-parameters-dialog.component";
import {
  updateConditionsConfigs,
  updateUserSettingsAction,
  updateSampleConditionsConfigs,
} from "state-management/actions/user.actions";
import {
  selectConditions,
  selectSampleConditions,
} from "state-management/selectors/user.selectors";
@Component({
  selector: "shared-condition",
  templateUrl: "./shared-condition.component.html",
  styleUrl: "./shared-condition.component.scss",
  standalone: false,
})
export class SharedConditionComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  // Condition filter inputs
  @Input() showConditions = false;
  @Input() metadataKeys: string[] = [];
  @Input() unitsEnabled = false;
  @Input() showConditionToggle = false;
  @Input() conditionSettingsKey: ConditionSettingsKey;
  @Input() addConditionAction: (condition: ScientificCondition) => void;
  @Input() removeConditionAction: (condition: ScientificCondition) => void;
  @Output() conditionsApplied = new EventEmitter<void>();

  conditionConfigs$ = this.store.select(selectConditions);

  humanNameMap: { [key: string]: string } = {};
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
    switch (this.conditionSettingsKey) {
      case "fe_dataset_table_conditions":
        this.conditionConfigs$ = this.store.select(selectConditions);
        break;
      case "fe_sample_table_conditions":
        this.conditionConfigs$ = this.store.select(selectSampleConditions);
        break;
      default:
        throw new Error("Invalid conditionSettingsKey");
    }
    if (this.showConditions) {
      this.buildMetadataMaps();
      this.applyEnabledConditions();
    }
  }

  /** Condition filter helpers and methods START */

  // Helper to get all conditions and update store
  updateStore(updatedConditions: ConditionConfig[]) {
    if (this.conditionSettingsKey === "fe_dataset_table_conditions") {
      this.store.dispatch(
        updateConditionsConfigs({ conditionConfigs: updatedConditions }),
      );
    } else if (this.conditionSettingsKey === "fe_sample_table_conditions") {
      this.store.dispatch(
        updateSampleConditionsConfigs({ conditionConfigs: updatedConditions }),
      );
    }
    
    this.store.dispatch(
      updateUserSettingsAction({
        property: { [this.conditionSettingsKey]: updatedConditions },
      }),
    );
  }

  buildMetadataMaps() {
    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditionConfigs) => {
        conditionConfigs.forEach((config) => {
          // Commented out human_name for now, but it will be used later
          // const { lhs,human_name } = config.condition;
          // if (lhs && human_name) this.humanNameMap[lhs] = human_name;
        });
      }),
    );
  }

  applyEnabledConditions() {
    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditions = []) => {
        conditions.forEach((config) => {
          if (config.condition.lhs) {
            this.removeConditionAction?.(config.condition);
          }
        });

        conditions.forEach((config) => {
          this.applyUnitsOptions(config.condition);
          if (config.enabled && config.condition.lhs && config.condition.rhs) {
            const condition = { ...config.condition };
            const rhsValue = condition.rhs;
            const isNumeric = rhsValue !== "" && !isNaN(Number(rhsValue));

            if (isNumeric) {
              condition.rhs = Number(rhsValue);
            }

            if (condition.relation === "EQUAL_TO") {
              condition.relation = !isNumeric
                ? "EQUAL_TO_STRING"
                : "EQUAL_TO_NUMERIC";
            }

            this.addConditionAction?.(condition);
          }
        });
      }),
    );
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

    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditions = []) => {
        const usedFields = conditions.map((config) => config.condition.lhs);
        const availableKeys = this.metadataKeys.filter(
          (key) => !usedFields.includes(key),
        );

        this.subscriptions.push(
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

                const existingConditionIndex = conditions.findIndex((config) =>
                  isEqual(config.condition.lhs, data.lhs),
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
                    human_name: this.humanNameMap[data.lhs],
                  },
                  enabled: true,
                };

                this.updateStore([...conditions, newCondition]);


                this.snackBar.open("Condition added successfully", "Close", {
                  duration: 2000,
                  panelClass: ["snackbar-success"],
                });
              }
            }),
        );
      }),
    );
  }

  removeCondition(condition: ConditionConfig, index: number) {
    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditions = []) => {
        const actualIndex = conditions.findIndex(
          (c) => c.condition.lhs === condition.condition.lhs,
        );

        if (actualIndex === -1) return;

        const updatedConditions = [...conditions];
        updatedConditions.splice(actualIndex, 1);
        this.tempConditionValues.splice(index, 1);

        if (condition.enabled) {
          this.removeConditionAction?.(condition.condition);
        }

        if (condition.condition.lhs) {
          this.unitsOptionsService.clearUnitsOptions(condition.condition.lhs);
        }

        this.updateStore(updatedConditions);
      }),
    );
  }

  updateConditionField(index: number, updates: Partial<ScientificCondition>) {
    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditions = []) => {
        if (!conditions[index]) return;

        const actualIndex = conditions.findIndex(
          (c) => c.condition.lhs === conditions[index].condition.lhs,
        );

        if (actualIndex === -1) return;

        const updatedConditions = [...conditions];
        const conditionConfig = updatedConditions[actualIndex];

        updatedConditions[actualIndex] = {
          ...conditionConfig,
          condition: {
            ...conditionConfig.condition,
            ...updates,
            human_name: this.humanNameMap[conditionConfig.condition.lhs],
          },
        };

        if (this.conditionSettingsKey === "fe_dataset_table_conditions") {
          this.store.dispatch(
            updateConditionsConfigs({ conditionConfigs: updatedConditions }),
          );
        } else if (this.conditionSettingsKey === "fe_sample_table_conditions") {
          this.store.dispatch(
            updateSampleConditionsConfigs({
              conditionConfigs: updatedConditions,
            }),
          );
        }
      }),
    );
  }

  updateConditionOperator(
    index: number,
    newOperator: ScientificCondition["relation"],
  ) {
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
    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditions = []) => {
        if (!conditions[index]) return;

        const actualIndex = conditions.findIndex(
          (c) => c.condition.lhs === conditions[index].condition.lhs,
        );

        if (actualIndex === -1) return;

        const updatedConditions = [...conditions];
        updatedConditions[actualIndex] = {
          ...updatedConditions[actualIndex],
          enabled,
        };
        const condition = updatedConditions[actualIndex].condition;

        if (enabled && condition.lhs && condition.rhs) {
          this.addConditionAction?.(condition);
        } else {
          this.removeConditionAction?.(condition);
        }

        this.updateStore(updatedConditions);
      }),
    );
  }

  applyConditions() {
    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditions = []) => {
        const updatedMyConditions = conditions.map((config, i) => {
          const lhs = config.condition.lhs;
          const baseCondition = {
            ...config.condition,
            human_name: this.humanNameMap[lhs],
          };

          const value =
            this.tempConditionValues[i] !== undefined
              ? this.tempConditionValues[i]
              : config.condition.rhs;
          const isNumeric = value !== "" && !isNaN(Number(value));

          if (
            config.condition.relation === "EQUAL_TO" ||
            config.condition.relation === "EQUAL_TO_NUMERIC" ||
            config.condition.relation === "EQUAL_TO_STRING"
          ) {
            return {
              ...config,
              condition: {
                ...baseCondition,
                rhs: isNumeric ? Number(value) : value,
                relation: (!isNumeric
                  ? "EQUAL_TO_STRING"
                  : "EQUAL_TO_NUMERIC") as ScientificCondition["relation"],
              },
            };
          } else if (config.condition.relation !== "RANGE") {
            return {
              ...config,
              condition: {
                ...baseCondition,
                rhs: isNumeric ? Number(value) : value,
              },
            };
          }

          return { ...config, condition: baseCondition };
        });

        // Removes old conditions
        conditions.forEach((c) => this.removeConditionAction?.(c.condition));

        // Adds updated conditions
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

        // Merges other conditions with updated conditions
        this.updateStore(updatedMyConditions);
        this.tempConditionValues = [];
        this.conditionsApplied.emit();
      }),
    );
  }

  clearConditions() {
    this.subscriptions.push(
      this.conditionConfigs$.pipe(take(1)).subscribe((conditions = []) => {
        conditions.forEach((config) =>
          this.removeConditionAction?.(config.condition),
        );

        this.updateStore([]);
      }),
    );
  }

  /** Condition filter helpers and methods END */

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
