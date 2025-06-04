import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from "@angular/core";

@Directive({
  selector: "[appDragAndDrop]",
  standalone: false,
})
export class DragAndDropDirective {
  @HostBinding("class.fileover") fileOver = false;
  @Output() fileDropped = new EventEmitter<unknown>();

  // Dragover listener
  @HostListener("dragover", ["$event"]) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener("dragleave", ["$event"]) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener("drop", ["$event"]) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    const files = event.dataTransfer
      ? event.dataTransfer.files
      : new FileList();

    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
