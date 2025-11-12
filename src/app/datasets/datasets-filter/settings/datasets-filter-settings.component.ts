import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { AppConfigService } from "app-config.service";
import { Store } from "@ngrx/store";
import { selectMetadataKeys } from "../../../state-management/selectors/datasets.selectors";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { FilterConfig } from "../../../shared/modules/filters/filters.module";

@Component({
  selector: "app-type-datasets-filter-settings",
  templateUrl: `./datasets-filter-settings.component.html`,
  styleUrls: [`./datasets-filter-settings.component.scss`],
})
export class DatasetsFilterSettingsComponent {
  metadataKeys$ = this.store.select(selectMetadataKeys);

  appConfig = this.appConfigService.getConfig();

  filterValidationStatus = {};

  constructor(
    public dialogRef: MatDialogRef<DatasetsFilterSettingsComponent>,
    public dialog: MatDialog,
    private store: Store,
    private appConfigService: AppConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

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
