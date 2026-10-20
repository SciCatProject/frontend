import { Component, ElementRef, Input, ViewChild, signal } from "@angular/core";
import { ConnectedPosition } from "@angular/cdk/overlay";

/** A help icon that opens a popup with the content that is placed inside it. */
@Component({
  selector: "info-popup",
  templateUrl: "./info-popup.component.html",
  styleUrls: ["./info-popup.component.scss"],
  standalone: false,
})
export class InfoPopupComponent {
  @ViewChild("trigger", { static: true })
  private trigger: ElementRef<HTMLElement>;

  @Input() title = "";
  @Input() label = "More information";
  @Input() icon = "help_outline";

  readonly isOpen = signal(false);
  readonly positions: ConnectedPosition[] = [
    {
      originX: "start",
      originY: "bottom",
      overlayX: "start",
      overlayY: "top",
      offsetY: 8,
    },
    {
      originX: "start",
      originY: "top",
      overlayX: "start",
      overlayY: "bottom",
      offsetY: -8,
    },
  ];

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onOutsideClick(event: MouseEvent): void {
    // the trigger toggles on its own
    if (!this.trigger.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
      this.trigger.nativeElement.focus();
    }
  }
}
