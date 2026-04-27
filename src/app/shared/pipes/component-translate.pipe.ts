import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export function translateComponentLabel(
  translateService: TranslateService,
  value: any,
  component = "",
): string {
  const valueToBeTranslated = component ? component + "." + value : value;

  const translatedValue = translateService.instant(valueToBeTranslated);

  return translatedValue !== valueToBeTranslated ? translatedValue : value;
}

@Pipe({
  name: "translate",
  standalone: false,
})
export class ComponentTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: any, component = "", ...args: any[]): string {
    return translateComponentLabel(this.translateService, value, component);
  }
}
