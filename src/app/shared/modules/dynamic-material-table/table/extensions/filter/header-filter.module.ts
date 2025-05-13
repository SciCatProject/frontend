import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HeaderFilterComponent } from "./header-filter.component";
import { FilterEventDirective } from "./filter-event.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";

const components = [HeaderFilterComponent, FilterEventDirective];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class HeaderFilterModule {}
