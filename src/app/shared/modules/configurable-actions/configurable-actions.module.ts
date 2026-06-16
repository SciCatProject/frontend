import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { ConfigurableActionsComponent } from "./configurable-actions.component";
import { ConfigurableActionComponent } from "./configurable-action.component";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  declarations: [
    ConfigurableActionsComponent,
    ConfigurableActionComponent,
    ConfirmationDialogComponent,
  ],
  exports: [ConfigurableActionsComponent, ConfigurableActionComponent],
})
export class ConfigurableActionsModule {}
