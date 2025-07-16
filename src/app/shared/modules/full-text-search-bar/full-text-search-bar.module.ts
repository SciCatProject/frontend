import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FullTextSearchBarComponent } from "./full-text-search-bar.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [FullTextSearchBarComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [FullTextSearchBarComponent],
})
export class FullTextSearchBarModule {}
