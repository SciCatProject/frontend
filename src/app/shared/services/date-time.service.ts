import { Injectable } from "@angular/core";
import {DateTime} from "luxon";

@Injectable({
  providedIn: "root"
})
export class DateTimeService {
  isValidDateTime(input: string){
    return (
      DateTime.fromFormat(input, "yyyy-MM-dd").isValid ||
      DateTime.fromFormat(input, "yyyy-MM-dd HH:mm").isValid ||
      DateTime.fromFormat(input, "yyyy-MM-dd HH:mm:ss").isValid ||
      DateTime.fromFormat(input, "yyyy-MM-dd HH:mm:ss.SSS").isValid ||
      this.isISODateTime(input)
    )
  }
  isISODateTime(input:string){
    const regex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/g;
    if(input.match(regex) && DateTime.fromISO(input).isValid){
      return true;
    }
    return false;
  }
}
