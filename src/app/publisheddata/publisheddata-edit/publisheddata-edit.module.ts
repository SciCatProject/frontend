import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { PublisheddataEditComponent } from "./publisheddata-edit.component";

@NgModule({
  declarations: [PublisheddataEditComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedScicatFrontendModule,
  ],
  exports: [PublisheddataEditComponent],
})
export class PublisheddataEditModule {}
