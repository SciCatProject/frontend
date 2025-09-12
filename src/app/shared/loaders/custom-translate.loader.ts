import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { AppConfigService } from "app-config.service";
import { Observable, of } from "rxjs";

export class CustomTranslateLoader implements TranslateLoader {
  appConfig = this.appConfigService.getConfig();

  constructor(private appConfigService: AppConfigService) {}

  getTranslation(): Observable<TranslationObject> {
    const labels = this.appConfig.labelsLocalization;

    return of(labels as unknown as TranslationObject);
  }
}
