import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchBarComponent } from "./search-bar.component";
import {
  MatIconModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [SearchBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  exports: [SearchBarComponent]
})
export class SearchBarModule {}
