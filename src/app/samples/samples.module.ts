import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleDetailComponent } from './sample-detail/sample-detail.component';
import { SampleTableComponent } from './sample-table/sample-table.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SampleDetailComponent, SampleTableComponent]
})
export class SamplesModule { }
