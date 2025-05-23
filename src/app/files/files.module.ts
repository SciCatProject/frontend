import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { FilesDashboardComponent } from "./files-dashboard/files-dashboard.component";
import { StoreModule } from "@ngrx/store";
import { filesReducer } from "state-management/reducers/files.reducer";
import { EffectsModule } from "@ngrx/effects";
import { FilesEffects } from "state-management/effects/files.effects";

@NgModule({
  declarations: [FilesDashboardComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([FilesEffects]),
    FlexLayoutModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    SharedScicatFrontendModule,
    StoreModule.forFeature("files", filesReducer),
  ],
  exports: [FilesDashboardComponent],
})
export class FilesModule {}
