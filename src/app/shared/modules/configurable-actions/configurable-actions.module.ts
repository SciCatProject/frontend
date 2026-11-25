import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { ConfigurableActionsComponent } from "./configurable-actions.component";
import { ConfigurableActionComponent } from "./configurable-action.component";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  declarations: [ConfigurableActionsComponent, ConfigurableActionComponent],
  exports: [ConfigurableActionsComponent, ConfigurableActionComponent],
})
export class ConfigurableActionsModule {}
