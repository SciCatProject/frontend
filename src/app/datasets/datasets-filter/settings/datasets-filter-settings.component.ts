import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { SearchParametersDialogComponent } from "../../../shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AppConfigService } from "app-config.service";
import { AsyncPipe } from "@angular/common";
import {
  addScientificConditionAction,
  removeScientificConditionAction,
} from "../../../state-management/actions/datasets.actions";
import {
  deselectColumnAction,
  selectColumnAction,
} from "../../../state-management/actions/user.actions";
import { Store } from "@ngrx/store";
import { selectMetadataKeys } from "../../../state-management/selectors/datasets.selectors";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  ConditionConfig,
  FilterConfig,
} from "../../../shared/modules/filters/filters.module";
import { isEqual } from "lodash-es";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-type-datasets-filter-settings",
  templateUrl: `./datasets-filter-settings.component.html`,
  styleUrls: [`./datasets-filter-settings.component.scss`],
  standalone: false,
})
export class DatasetsFilterSettingsComponent {
  metadataKeys$ = this.store.select(selectMetadataKeys);

  appConfig = this.appConfigService.getConfig();

  filterValidationStatus = {};

  constructor(
    public dialogRef: MatDialogRef<DatasetsFilterSettingsComponent>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store,
    private asyncPipe: AsyncPipe,
    private appConfigService: AppConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  addCondition() {
    this.dialog
      .open(SearchParametersDialogComponent, {
        data: {
          parameterKeys: this.asyncPipe.transform(this.metadataKeys$),
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const { data } = res;

          // If the condition already exists, do nothing
          const existingConditionIndex = this.data.conditionConfigs.findIndex(
            (config) => isEqual(config.condition, data),
          );
          if (existingConditionIndex !== -1) {
            this.snackBar.open("Condition already exists", "Close", {
              duration: 2000,
              panelClass: ["snackbar-warning"],
            });
            return;
          }
          const condition = this.toggleCondition({
            condition: data,
            enabled: false,
          });
          this.data.conditionConfigs.push(condition);
        }
      });
  }

  editCondition(condition: ConditionConfig, i: number) {
    this.dialog
      .open(SearchParametersDialogComponent, {
        data: {
          parameterKeys: this.asyncPipe.transform(this.metadataKeys$),
          condition: condition.condition,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const { data } = res;

          // If the condition is unchanged, do nothing
          if (isEqual(condition.condition, data)) {
            return;
          }

          this.store.dispatch(
            removeScientificConditionAction({
              condition: condition.condition,
            }),
          );
          this.store.dispatch(
            deselectColumnAction({
              name: condition.condition.lhs,
              columnType: "custom",
            }),
          );

          this.data.conditionConfigs[i] = {
            ...condition,
            condition: data,
          };
          this.store.dispatch(
            addScientificConditionAction({ condition: data }),
          );
          this.store.dispatch(
            selectColumnAction({ name: data.lhs, columnType: "custom" }),
          );
        }
      });
  }

  removeCondition(condition: ConditionConfig, index: number) {
    this.data.conditionConfigs.splice(index, 1);
    if (condition.enabled) {
      this.store.dispatch(
        removeScientificConditionAction({ condition: condition.condition }),
      );
      this.store.dispatch(
        deselectColumnAction({
          name: condition.condition.lhs,
          columnType: "custom",
        }),
      );
    }
  }

  toggleCondition(condition: ConditionConfig) {
    condition.enabled = !condition.enabled;
    const data = condition.condition;
    if (condition.enabled) {
      this.store.dispatch(addScientificConditionAction({ condition: data }));
      this.store.dispatch(
        selectColumnAction({ name: data.lhs, columnType: "custom" }),
      );
    } else {
      this.store.dispatch(removeScientificConditionAction({ condition: data }));
      this.store.dispatch(
        deselectColumnAction({ name: data.lhs, columnType: "custom" }),
      );
    }
    return condition;
  }

  toggleVisibility(filter: FilterConfig): void {
    const key = this.getFilterKey(filter);
    filter[key] = !filter[key];
  }

  getChecked(filter: FilterConfig): boolean {
    const key = this.getFilterKey(filter);
    return filter[key];
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.data.filterConfigs,
      event.previousIndex,
      event.currentIndex,
    );
  }

  onApply() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }

  resolveFilterLabel(
    labelMaps: Record<string, string>,
    filter: FilterConfig,
  ): string {
    const key = this.getFilterKey(filter);
    return labelMaps[key] || "Unknown filter";
  }

  getFilterKey(filter: FilterConfig): string {
    return Object.keys(filter)[0];
  }
}
