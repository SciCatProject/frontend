import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ErrorPageComponent } from "shared/modules/error-page/error-page.component";
import { AppLayoutComponent } from "_layout/app-layout/app-layout.component";
import { AppMainLayoutComponent } from "_layout/app-main-layout/app-main-layout.component";
import { ServiceGuard } from "./service.guard";

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "/datasets",
        pathMatch: "full",
      },
      {
        path: "login",
        loadChildren: () =>
          import("./lazy/login-routing/login.feature.module").then(
            (m) => m.LoginFeatureModule,
          ),
      },
      {
        path: "auth-callback",
        loadChildren: () =>
          import(
            "./lazy/auth-callback-routing/auth-callback.feature.module"
          ).then((m) => m.AuthCallbackFeatureModule),
      },
      {
        path: "",
        component: AppMainLayoutComponent,
        children: [
          {
            path: "datasets",
            loadChildren: () =>
              import("./lazy/datasets-routing/datasets.feature.module").then(
                (m) => m.DatasetsFeatureModule,
              ),
          },
          {
            path: "files",
            loadChildren: () =>
              import("./lazy/file-routing/file.feature.module").then(
                (m) => m.FileFeatureModule,
              ),
          },
          {
            path: "instruments",
            loadChildren: () =>
              import(
                "./lazy/instruments-routing/instruments.feature.module"
              ).then((m) => m.InstrumentsFeatureModule),
          },
          {
            path: "proposals",
            loadChildren: () =>
              import("./lazy/proposal-routing/proposal.feature.module").then(
                (m) => m.ProposalFeatureModule,
              ),
          },
          {
            path: "publishedDatasets",
            loadChildren: () =>
              import(
                "./lazy/publisheddata-routing/publisheddata.feature.module"
              ).then((m) => m.PublisheddataFeatureModule),
          },
          {
            path: "samples",
            loadChildren: () =>
              import("./lazy/samples-routing/samples.feature.module").then(
                (m) => m.SamplesFeatureModule,
              ),
          },
          {
            path: "policies",
            loadChildren: () =>
              import("./lazy/policies-routing/policies.feature.module").then(
                (m) => m.PoliciesFeatureModule,
              ),
          },

          {
            path: "user",
            loadChildren: () =>
              import("./lazy/user-routing/user.feature.module").then(
                (m) => m.UsersFeatureModule,
              ),
          },
          {
            path: "about",
            loadChildren: () =>
              import("./lazy/about-routing/about.feature.module").then(
                (m) => m.AboutFeatureModule,
              ),
          },
          {
            path: "help",
            loadChildren: () =>
              import("./lazy/help-routing/help.feature.module").then(
                (m) => m.HelpFeatureModule,
              ),
          },
          {
            path: "logbooks",
            loadChildren: () =>
              import("./lazy/logbooks-routing/logbooks.feature.module").then(
                (m) => m.LogbooksFeatureModule,
              ),
            canActivate: [ServiceGuard],
            data: { service: "logbook" },
          },
          {
            path: "error",
            component: ErrorPageComponent,
            data: { errorTitle: "Location Not Found" },
          },
          {
            path: "404",
            component: ErrorPageComponent,
            data: {
              errorTitle: "404 Page not found",
              message: "Sorry, the page you are trying to view doesn't exist",
            },
          },
          {
            path: "401",
            component: ErrorPageComponent,
            data: {
              errorTitle: "401 Unauthorized",
              message: "Sorry, you don't have permission to view this page",
            },
          },
          {
            path: "**",
            pathMatch: "full",
            component: ErrorPageComponent,
            data: {
              errorTitle: "404 Page not found",
              message: "Sorry, the page you are trying to view doesn't exist",
            },
          },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
