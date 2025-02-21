import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: "componentTranslate",
})
export class ComponentTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: any, component = "", ...args: any[]): string {
    const valueToBeTranslated = component ? component + "." + value : value;
    const translatedValue = this.translateService.instant(valueToBeTranslated);
    return translatedValue !== valueToBeTranslated ? translatedValue : value;
  }
}
