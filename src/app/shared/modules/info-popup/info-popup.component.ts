import { Component, ElementRef, Input, ViewChild, signal } from "@angular/core";
import {
  CdkConnectedOverlay,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
} from "@angular/cdk/overlay";

/** The width of the popup in the stylesheet, and how close to the edge of the window it may get. */
const POPUP_WIDTH = 560;
const EDGE_MARGIN = 8;
const GAP = 8;
const MIN_HEIGHT = 160;

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

  @ViewChild(CdkConnectedOverlay)
  private overlay: CdkConnectedOverlay;

  private opensBelow = true;
  private fitted = false;
  private offsetX = 0;

  @Input() title = "";
  @Input() label = "More information";
  @Input() icon = "help_outline";

  readonly isOpen = signal(false);
  /** The popup scrolls when the window is not tall enough for it, and is no wider than its surroundings. */
  readonly maxHeight = signal(0);
  readonly maxWidth = signal(POPUP_WIDTH);
  // set when the popup opens, it depends on where the icon is
  positions: ConnectedPosition[] = [];

  /** The popup stays inside the dialog it is in, or inside the window. */
  private getBounds(): { left: number; right: number } {
    const dialog = this.trigger.nativeElement.closest(
      ".mat-mdc-dialog-container",
    );
    const { left, right } = dialog
      ? dialog.getBoundingClientRect()
      : { left: 0, right: document.documentElement.clientWidth };
    return { left: left + EDGE_MARGIN, right: right - EDGE_MARGIN };
  }

  private getPositions(): ConnectedPosition[] {
    const position = (isBelow: boolean): ConnectedPosition => ({
      originX: "start",
      originY: isBelow ? "bottom" : "top",
      overlayX: "start",
      overlayY: isBelow ? "top" : "bottom",
      offsetX: this.offsetX,
      offsetY: isBelow ? GAP : -GAP,
    });
    return [position(this.opensBelow), position(!this.opensBelow)];
  }

  /**
   * Opens on the side of the icon with more room, moved to the left as far as needed to stay
   * in the window, and no taller than that room.
   */
  private place(): void {
    const bounds = this.getBounds();
    const width = Math.min(POPUP_WIDTH, bounds.right - bounds.left);
    const { left, top, bottom } =
      this.trigger.nativeElement.getBoundingClientRect();
    const below = window.innerHeight - bottom - GAP - EDGE_MARGIN;
    const above = top - GAP - EDGE_MARGIN;

    this.fitted = false;
    this.opensBelow = below >= above;
    this.offsetX = Math.min(0, bounds.right - width - left);
    this.maxWidth.set(width);
    this.positions = this.getPositions();
    this.maxHeight.set(Math.max(this.opensBelow ? below : above, MIN_HEIGHT));
  }

  /** Measures where the popup really is, and moves it back into the window if it is not. */
  fit(): void {
    // once per opening, moving the popup tells about its position again
    if (this.fitted) {
      return;
    }
    this.fitted = true;

    const { left, right } =
      this.overlay.overlayRef.overlayElement.getBoundingClientRect();
    const bounds = this.getBounds();
    const shift =
      right > bounds.right
        ? bounds.right - right
        : Math.max(0, bounds.left - left);
    if (!shift) {
      return;
    }

    this.offsetX += shift;
    this.positions = this.getPositions();
    const strategy = this.overlay.overlayRef.getConfig()
      .positionStrategy as FlexibleConnectedPositionStrategy;
    strategy.withPositions(this.positions);
    this.overlay.overlayRef.updatePosition();
  }

  toggle(): void {
    if (!this.isOpen()) {
      this.place();
    }
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
