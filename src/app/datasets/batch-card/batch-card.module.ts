import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { ADAuthService } from "users/adauth.service";
import { BatchCardComponent } from "./batch-card.component";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  declarations: [
    BatchCardComponent
  ],
  providers: [
    ADAuthService,
  ],
  exports: [
    BatchCardComponent,
  ],
})
export class BatchCardModule {}
