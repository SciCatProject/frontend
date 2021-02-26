import { Injector, Pipe, PipeTransform } from "@angular/core";
import {
  CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, KeyValuePipe, LowerCasePipe,
  PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe
} from "@angular/common";
import { FilePathTruncate } from "./file-path-truncate.pipe";
import { FileSizePipe } from "./filesize.pipe";
import { JsonHeadPipe } from "./json-head.pipe";
import { ObjKeysPipe } from "./obj-keys.pipe";
import { PrettyUnitPipe } from "./pretty-unit.pipe";
import { ReplaceUnderscorePipe } from "./replace-underscore.pipe";
import { StripProposalPrefixPipe } from "./stripProposalPrefix.pipe";
import { ThumbnailPipe } from "./thumbnail.pipe";



@Pipe({
  name: "newDynamicPipe",
})
export class NewDynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) { }

  transform(value: any, pipeDef: any): any {
    if (pipeDef) {
      const parts = pipeDef.split(" ");
      if (parts.length === 0) {
        return value;
      } else {
        let pipeToken;
        const pipeString = parts[0];
        switch (pipeString) {
          case "json":
            pipeToken = JsonPipe;
            break;
          case "date":
            pipeToken = DatePipe;
            break;
          case "filesize":
            pipeToken = FileSizePipe;
            break;
          case "filepathtruncate":
            pipeToken = FilePathTruncate;
            break;
          case "jsonhead":
            pipeToken = JsonHeadPipe;
            break;
          case "objkeys":
            pipeToken = ObjKeysPipe;
            break;
          case "prettyunit":
            pipeToken = PrettyUnitPipe;
            break;
          case "replaceunderscore":
            pipeToken = ReplaceUnderscorePipe;
            break;
          case "stripproposalprefix":
            pipeToken = StripProposalPrefixPipe;
            break;
          case "thumbnail":
            pipeToken = ThumbnailPipe;
            break;
          case "titlecase":
            pipeToken = TitleCasePipe;
            break;
          case "currency":
            pipeToken = CurrencyPipe;
            break;
          case "decimal":
            pipeToken = DecimalPipe;
            break;
          case "keyvalue":
            pipeToken = KeyValuePipe;
            break;
          case "lowercase":
            pipeToken = LowerCasePipe;
            break;
          case "percent":
            pipeToken = PercentPipe;
            break;
          case "slice":
            pipeToken = SlicePipe;
            break;
          case "uppercase":
            pipeToken = UpperCasePipe;
            break;
          default:
            console.log("No such pipe exists:", value, pipeString);
            return value;
        }
        const pipeArgs = parts.length > 1 ? parts.slice(1, parts.length) : [];
        const pipe = this.injector.get<any>(pipeToken);
        return pipe.transform(value, ...pipeArgs);
      }
    } else {
      return value;
    }
  }
}
