import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[appFilterEvent]",
})
export class FilterEventDirective {
  @HostListener("click", ["$event"])
  onClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    return false;
  }
}
