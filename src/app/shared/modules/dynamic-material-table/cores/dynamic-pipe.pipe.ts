import { Injector, Pipe, PipeTransform } from "@angular/core";
import { IPipe } from "../models/pipe.model";

@Pipe({
  name: "dynamicPipe",
})
export class DynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) {}

  transform(value: any, pipes: IPipe[]): any {
    if (!pipes && pipes.length > 0) {
      pipes.forEach((pipe: IPipe) => {
        const localPipe = this.injector.get(pipe.token);
        value = localPipe.transform(value, ...pipe.data);
      });
    }
    return value;
  }
}
