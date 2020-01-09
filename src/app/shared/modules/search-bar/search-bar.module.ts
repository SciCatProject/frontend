import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchBarComponent } from "./search-bar.component";
import {
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule
} from "@angular/material";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [SearchBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  exports: [SearchBarComponent]
})
export class SearchBarModule {}
