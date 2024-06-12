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
import {
  selectMetadataKeys,
  selectScientificConditions,
} from "../../../state-management/selectors/datasets.selectors";
import { ConditionConfig, FilterConfig } from "../datasets-filter.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ScientificCondition } from "../../../state-management/models";

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
        data: { parameterKeys: this.asyncPipe.transform(this.metadataKeys$) },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const { data } = res;
          this.data.conditionConfigs.push({
            condition: data,
            enabled: false,
          });
        }
      });
  }

  removeCondition(condition: ConditionConfig, index: number) {
    this.data.conditionConfigs.splice(index, 1);
    if (condition.enabled) {
      this.store.dispatch(removeScientificConditionAction({ index }));
      this.store.dispatch(
        deselectColumnAction({
          name: condition.condition.lhs,
          columnType: "custom",
        }),
      );
    }
  }

  toggleCondition(condition: ConditionConfig, index: number) {
    condition.enabled = !condition.enabled;
    const data = condition.condition;
    if (condition.enabled) {
      this.store.dispatch(addScientificConditionAction({ condition: data }));
      this.store.dispatch(
        selectColumnAction({ name: data.lhs, columnType: "custom" }),
      );
    } else {
      this.store.dispatch(removeScientificConditionAction({ index }));
      this.store.dispatch(
        deselectColumnAction({ name: data.lhs, columnType: "custom" }),
      );
    }
  }

  toggleVisibility(filter: FilterConfig) {
    filter.visible = !filter.visible;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.data.filterConfigs,
      event.previousIndex,
      event.currentIndex,
    );
  }

  onApply() {
    this.dialogRef.close(this.data.filterConfigs);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
