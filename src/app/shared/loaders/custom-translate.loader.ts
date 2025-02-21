import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { AppConfigService } from "app-config.service";
import { Observable, of } from "rxjs";

export class CustomTranslateLoader implements TranslateLoader {
  appConfig = this.appConfigService.getConfig();

  constructor(private appConfigService: AppConfigService) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    if (
      this.appConfig.labelsLocalization &&
      this.appConfig.labelsLocalization[lang]
    ) {
      return of(this.appConfig.labelsLocalization[lang]);
    }

    console.warn(`Translation for "${lang}" not found.`);
    return of({});
  }
}
