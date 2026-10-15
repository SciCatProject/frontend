import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "secondsTimeDuration",
  standalone: false,
})
@Injectable()
export class TimeDurationPipe implements PipeTransform {
  transform(seconds: number | undefined): string {
    if (seconds == null || seconds < 0) {
      return "0s";
    }
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const leftSeconds = Math.floor(seconds % 60);

    const parts: string[] = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (leftSeconds > 0 || parts.length === 0) parts.push(`${leftSeconds}s`);

    return parts.join(" ");
  }
}
