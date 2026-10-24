import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverlayModule } from "@angular/cdk/overlay";
import { MatIconModule } from "@angular/material/icon";
import { InfoPopupComponent } from "./info-popup.component";

@NgModule({
  declarations: [InfoPopupComponent],
  imports: [CommonModule, OverlayModule, MatIconModule],
  exports: [InfoPopupComponent],
})
export class InfoPopupModule {}
