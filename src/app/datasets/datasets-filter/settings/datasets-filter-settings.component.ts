import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { SearchParametersDialogComponent } from "../../../shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AppConfigService } from "app-config.service";
import { AsyncPipe } from "@angular/common";
import { addScientificConditionAction } from "../../../state-management/actions/datasets.actions";
import { selectColumnAction } from "../../../state-management/actions/user.actions";
import { Store } from "@ngrx/store";
import { selectMetadataKeys } from "../../../state-management/selectors/datasets.selectors";
import { FilterConfig } from "../datasets-filter.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-type-datasets-filter-settings",
  templateUrl: `./datasets-filter-settings.component.html`,
  styleUrls: [`./datasets-filter-settings.component.scss`],
})
export class DatasetsFilterSettingsComponent {
  showFilterOptions = false;

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
          this.store.dispatch(
            addScientificConditionAction({ condition: data }),
          );
          this.store.dispatch(
            selectColumnAction({ name: data.lhs, columnType: "custom" }),
          );
        }
      });
  }

  addFilter() {
    alert("Add filter");
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
