import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { AppLayoutComponent } from "./app-layout/app-layout.component";
import { AppMainLayoutComponent } from "./app-main-layout/app-main-layout.component";
import { BatchCardModule } from "datasets/batch-card/batch-card.module";
import { BreadcrumbModule } from "shared/modules/breadcrumb/breadcrumb.module";
import { UsersModule } from "../users/users.module";

@NgModule({
  declarations: [
    AppLayoutComponent,
    AppHeaderComponent,
    AppMainLayoutComponent,
  ],
  imports: [
    CommonModule,
    BatchCardModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterModule,
    BreadcrumbModule,
    UsersModule,
  ],
  exports: [],
})
export class LayoutModule {}
