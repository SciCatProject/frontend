import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { TableMenuComponent } from "./table-menu.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";

const components = [TableMenuComponent];

@NgModule({
  declarations: [components],
  exports: components,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    DragDropModule,
    MatMenuModule,
    MatRadioModule,
    MatDividerModule,
  ],
})
export class TableMenuModule {}
