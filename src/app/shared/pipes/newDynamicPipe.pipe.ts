import { DatePipe, JsonPipe } from "@angular/common";
import { Injector, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "newDynamicPipe",
})
export class NewDynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) { }

  transform(value: any, pipeDef: any): any {
    //console.log("pipedef:", pipeDef, value);
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
          default:
            console.log("No such pipe exists:", value, pipeString);
            return value
        }
        const pipeArgs = parts.length > 1 ? parts.slice(1, parts.length) : [];
        const pipe = this.injector.get(pipeToken);
        return pipe.transform(value, ...pipeArgs);
      }
    } else {
      return value;
    }
  }
}
