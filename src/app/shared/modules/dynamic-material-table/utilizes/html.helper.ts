import { ElementRef } from "@angular/core";

export function requestFullscreen(element: ElementRef) {
  if (element.nativeElement.requestFullscreen) {
    element.nativeElement.requestFullscreen();
  } else if (element.nativeElement.webkitRequestFullscreen) {
    /* Safari */
    element.nativeElement.webkitRequestFullscreen();
  } else if (element.nativeElement.msRequestFullscreen) {
    /* IE11 */
    element.nativeElement.msRequestFullscreen();
  }
}
