import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "StripProposalPrefix"
})
export class StripProposalPrefixPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return "";
    }
    return value.replace(/proposal-/i, "");
  }
}
