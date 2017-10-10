import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  DashboardComponent,
  DatablocksComponent,
  DatafilesComponent,
  DatasetDetailComponent,
  DatasetService,
  DatasetsFilterComponent,
  DatasetTableComponent
} from 'datasets/index';
import {
  AutoCompleteModule,
  CalendarModule,
  ConfirmationService,
  ConfirmDialogModule,
  DataTableModule,
  DialogModule,
  DropdownModule,
  SharedModule,
  TabViewModule,
  TreeModule,
  TreeNode,
  TreeTableModule
} from 'primeng/primeng';
import {SharedCatanieModule} from 'shared/shared.module';

@NgModule({
  imports : [
    CommonModule, FormsModule, DialogModule, ReactiveFormsModule,
    SharedCatanieModule, DataTableModule, SharedModule, TabViewModule,
    ConfirmDialogModule, TreeModule, CalendarModule, TreeTableModule,
    DropdownModule, AutoCompleteModule
  ],
  declarations : [
    DashboardComponent, DatasetTableComponent, DatablocksComponent,
    DatafilesComponent, DatasetsFilterComponent, DatasetDetailComponent
  ],
  providers : [ DatasetService, ConfirmationService ],
  exports : [ DatasetTableComponent, DatasetsFilterComponent ]
})
export class DatasetsModule {
}
