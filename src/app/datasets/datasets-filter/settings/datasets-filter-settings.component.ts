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

@Component({
  selector: "app-type-datasets-filter-settings",
  templateUrl: `./datasets-filter-settings.component.html`,
  styleUrls: [`./datasets-filter-settings.component.scss`],
})
export class DatasetsFilterSettingsComponent {
  metadataKeys$ = this.store.select(selectMetadataKeys);

  appConfig = this.appConfigService.getConfig();

  constructor(
    public dialogRef: MatDialogRef<DatasetsFilterSettingsComponent>,
    public dialog: MatDialog,
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
          const condition = this.toggleCondition({
            condition: data,
            enabled: false,
          });
          this.data.conditionConfigs.push(condition);
        }
      });
  }

  editCondition(condition: ConditionConfig, i: number) {
    this.store.dispatch(
      removeScientificConditionAction({ condition: condition.condition }),
    );
    this.store.dispatch(
      deselectColumnAction({
        name: condition.condition.lhs,
        columnType: "custom",
      }),
    );
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
    const key = Object.keys(filter)[0];
    filter[key] = !filter[key];
  }

  getChecked(filter: FilterConfig): boolean {
    const key = Object.keys(filter)[0];
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
    const key = Object.keys(filter)[0];

    return labelMaps[key] || "Unknown filter";
  }
}
