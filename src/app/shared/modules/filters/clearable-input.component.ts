import { Component, ElementRef, Input, ViewChild } from "@angular/core";

//TODO move to common
@Component({
  template: "",
  standalone: false,
})
export class ClearableInputComponent<T = any> {
  @ViewChild("input", { static: true }) input!: ElementRef;

  @Input()
  set clear(value: boolean) {
    if (value) {
      this.input.nativeElement.value = "";
    }
  }
}
