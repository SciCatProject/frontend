import { MatTreeModule} from '@angular/material/tree';
import { NgModule } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from 'shared/pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { TreeEditComponent } from './tree-edit/tree-edit.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MetadataInputComponent } from './metadata-input/metadata-input.component';
import { MatTableModule } from '@angular/material/table';
import { MetadataInputModalComponent } from './metadata-input-modal/metadata-input-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [TreeEditComponent, TreeViewComponent, MetadataInputComponent, MetadataInputModalComponent],
  imports: [
    MatFormFieldModule,
    MatTreeModule,
    PipesModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDividerModule,
    MatDialogModule,
    FlexModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatDividerModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  exports: [TreeEditComponent, TreeViewComponent]
})
export class ScientificMetadataTreeModule {}
