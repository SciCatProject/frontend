import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppHeaderComponent } from "./app-header/app-header.component";
import {
  MatMenuModule,
  MatIconModule,
  MatBadgeModule,
  MatToolbarModule,
  MatButtonModule
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { DatasetsModule } from "datasets/datasets.module";
import { AnonymousLayoutComponent } from "./anonymous-layout/anonymous-layout.component";
import { AppLayoutComponent } from "./app-layout/app-layout.component";
import { LoginHeaderComponent } from "./login-header/login-header.component";
import { LoginLayoutComponent } from "./login-layout/login-layout.component";
import { SharedCatanieModule } from "shared/shared.module";

@NgModule({
  declarations: [
    AnonymousLayoutComponent,
    AppHeaderComponent,
    AppLayoutComponent,
    LoginHeaderComponent,
    LoginLayoutComponent
  ],
  imports: [
    CommonModule,
    DatasetsModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterModule,
    SharedCatanieModule
  ],
  exports: []
})
export class LayoutModule {}
