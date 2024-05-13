import { Component } from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  SearchParametersDialogComponent
} from "../../../shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AppConfigService } from "app-config.service";
import { AsyncPipe } from "@angular/common";
import {addScientificConditionAction} from "../../../state-management/actions/datasets.actions";
import {selectColumnAction} from "../../../state-management/actions/user.actions";
import {Store} from "@ngrx/store";
import {selectMetadataKeys} from "../../../state-management/selectors/datasets.selectors";

@Component({
  selector: "app-type-datasets-filter-settings",
  template: `<h2 mat-dialog-title>Add Filter</h2>
  <mat-dialog-content>
    <button mat-button color="primary" *ngIf="appConfig.scienceSearchEnabled" (click)="addCondition()"><mat-icon>add</mat-icon> Add Condition</button>
    <button mat-button color="primary" (click)="addFilter()"><mat-icon>add</mat-icon> Add Filter</button>
    <div *ngIf="showFilterOptions" class="filter-options">
      <div class="filter-option" (click)="selectFilter('PID Filter')">PID Filter</div>
      <div class="filter-option" (click)="selectFilter('Location Filter')">Location Filter</div>
    </div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button (click)="onCancel()">Cancel</button>
    <button mat-button (click)="onApply()">Apply</button>
  </mat-dialog-actions>`,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class DatasetsFilterSettingsComponent {
  showFilterOptions: boolean = false;

  metadataKeys$ = this.store.select(selectMetadataKeys);

  appConfig = this.appConfigService.getConfig();

  constructor(public dialogRef: MatDialogRef<DatasetsFilterSettingsComponent>,
              public dialog: MatDialog,
              private store: Store,
              private asyncPipe: AsyncPipe,
              private appConfigService: AppConfigService) {}

  addCondition(){
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

  addFilter(){
    this.showFilterOptions = true;
  }

  selectFilter(filter: string){

  }

  onApply(){
    //TODO update state
    this.dialogRef.close();
  }

  onCancel(){
    //TODO reset state
    this.dialogRef.close();
  }
}
