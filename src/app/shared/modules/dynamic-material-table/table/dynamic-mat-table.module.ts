import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatSortModule } from "@angular/material/sort";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTableModule } from "@angular/material/table";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDividerModule } from "@angular/material/divider";
import { TableCoreDirective } from "../cores/table.core.directive";
import { RowMenuModule } from "./extensions/row-menu/row-menu.module";
import {
  DynamicCellDirective,
  DynamicMatTableComponent,
} from "./dynamic-mat-table.component";
import { TableMenuModule } from "./extensions/table-menu/table-menu.module";
import { HeaderFilterModule } from "./extensions/filter/header-filter.module";
import { TableVirtualScrollModule } from "../cores/table-virtual-scroll.module";
import { PrintTableDialogComponent } from "./extensions/print-dialog/print-dialog.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRippleModule } from "@angular/material/core";
import { TooltipComponent } from "../tooltip/tooltip.component";
import { OverlayModule } from "@angular/cdk/overlay";
import { TooltipDirective } from "../tooltip/tooltip.directive";
import { TemplateOrStringDirective } from "../tooltip/template-or-string.directive";
import { FormsModule } from "@angular/forms";
import { TableSetting } from "../models/table-setting.model";

// eslint-disable-next-line @typescript-eslint/naming-convention
const ExtensionsModule = [HeaderFilterModule, RowMenuModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    ScrollingModule,
    TableVirtualScrollModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatProgressBarModule,
    MatIconModule,
    DragDropModule,
    TableMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatRippleModule,
    OverlayModule,
    ExtensionsModule,
  ],
  exports: [DynamicMatTableComponent],
  declarations: [
    DynamicMatTableComponent,
    PrintTableDialogComponent,
    TableCoreDirective,
    DynamicCellDirective,
    TooltipComponent,
    TooltipDirective,
    TemplateOrStringDirective,
  ],
})
export class DynamicMatTableModule {
  static forRoot(
    config: TableSetting,
  ): ModuleWithProviders<DynamicMatTableModule> {
    return {
      ngModule: DynamicMatTableModule,
      providers: [
        {
          provide: TableSetting,
          useValue: config,
        },
      ],
    };
  }
}
