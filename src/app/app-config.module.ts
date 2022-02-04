import { NgModule, InjectionToken } from "@angular/core";
import { environment } from "../environments/environment";
import { TableColumn } from "state-management/models";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export class OAuth2Endpoint {
  displayText = "";
  displayImage?: string | null = null;
  authURL = "";
}

export class RetrieveDestinations {
  option = "";
  location?: string | null = null;
}

export class AppConfig {
  production = false;
}

export const APP_DI_CONFIG: AppConfig = {
  production: environment.production,
};

@NgModule({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: APP_DI_CONFIG,
    },
  ],
})
export class AppConfigModule {}
