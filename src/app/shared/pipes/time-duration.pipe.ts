import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "secondsTimeDuration",
  standalone: false,
})
@Injectable()
export class TimeDurationPipe implements PipeTransform {
  transform(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const leftMinutes = minutes % 60;
    const leftSeconds = Math.round(seconds % 60);

    if (hours === 0) {
      if (leftMinutes === 0) return `${leftSeconds}s`;
      return `${leftMinutes}m ${leftSeconds}s`;
    }
    return `${hours}h ${leftMinutes}m ${leftSeconds}s`;
  }
}
