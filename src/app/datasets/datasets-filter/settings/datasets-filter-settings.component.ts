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

  defaultFilters = [];
  userSavedFilters = [];

  mergedFilters = [];

  constructor(
    public dialogRef: MatDialogRef<DatasetsFilterSettingsComponent>,
    public dialog: MatDialog,
    private store: Store,
    private appConfigService: AppConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.defaultFilters = this.appConfig.defaultDatasetsListSettings.filters;
    this.userSavedFilters = this.data.filterConfigs || [];

    const newFilters = this.defaultFilters.reduce((filtered, item) => {
      if (
        !this.userSavedFilters.some((userFilter) => userFilter.key === item.key)
      ) {
        filtered.push({ ...item, enabled: false });
      }
      return filtered;
    }, []);

    this.mergedFilters = [...this.userSavedFilters].concat(newFilters);
  }

  toggleVisibility(filter: FilterConfig): void {
    filter.enabled = !filter.enabled;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.mergedFilters,
      event.previousIndex,
      event.currentIndex,
    );
  }

  onApply() {
    this.dialogRef.close({
      filterConfigs: this.mergedFilters,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
