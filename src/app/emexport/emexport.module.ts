import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule } from "@angular/forms";
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { EmExportComponent } from "./emexport/emexport.component";
import { OneDepComponent } from "./onedep/onedep.component"

@NgModule({
  declarations: [
    EmExportComponent,
    OneDepComponent
  ],
  imports: [
    CommonModule, 
    MatCardModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatProgressSpinnerModule, 
    RouterModule,
    MatListModule,
    MatIconModule
  ],
})
export class EmExportModule { }
