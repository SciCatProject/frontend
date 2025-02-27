import { Type } from "@angular/core";

export interface IPipe {
  token?: Type<any>;
  data?: any[];
}
