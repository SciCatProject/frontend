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
import { FilterConfig } from "state-management/state/user.store";

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
    private store: Store,
    private appConfigService: AppConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  toggleVisibility(filter: FilterConfig): void {
    filter.enabled = !filter.enabled;
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
    return labelMaps[filter.key] || "Unknown filter";
  }
}
