import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';
import { MatDividerModule } from '@angular/material';

@NgModule({
  imports : [
    CommonModule,
    RouterModule,
    MatDividerModule
  ],
  declarations : [
    BreadcrumbComponent
  ],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbModule {
}
